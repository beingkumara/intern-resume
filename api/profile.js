import * as dotenv from 'dotenv';
import { resolve } from 'path';

// For local dev with Vercel CLI, explicitly load .env.local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: resolve(process.cwd(), '.env.local') });
}

import { verifyToken } from '@clerk/backend';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // 1. Verify Authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  let userId;
  console.log("Checking env vars:", {
    hasSecret: !!process.env.CLERK_SECRET_KEY,
    hasPubKey: !!process.env.VITE_CLERK_PUBLISHABLE_KEY,
  });

  try {
    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    userId = verified.sub;
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    // 2. Handle GET Request
    if (req.method === 'GET') {
      let profile = await prisma.userProfile.findUnique({
        where: { userId },
        include: {
          experiences: true,
          educations: true,
          projects: true,
          responsibilities: true,
        },
      });

      // If it doesn't exist yet, create a blank one for this user
      if (!profile) {
         profile = await prisma.userProfile.create({
           data: { userId },
           include: { experiences: true, educations: true, projects: true, responsibilities: true }
         });
      }

      return res.status(200).json(profile);
    } 
    
    // 3. Handle PATCH Request
    else if (req.method === 'PATCH') {
      const body = req.body;
      
      // Ensure the profile exists before updating
      let existingProfile = await prisma.userProfile.findUnique({ where: { userId } });
      if (!existingProfile) {
        await prisma.userProfile.create({ data: { userId } });
      }

      const profile = await prisma.userProfile.update({
        where: { userId },
        data: {
          name: body.name,
          rollNumber: body.rollNumber,
          linkedin: body.linkedin,
          github: body.github,
          portfolio: body.portfolio,
          summary: body.summary,
          cocurriculars: Array.isArray(body.cocurriculars) ? body.cocurriculars : [],
          achievements: Array.isArray(body.achievements) ? body.achievements : [],
          coursework: Array.isArray(body.coursework) ? body.coursework : [],
          skills: body.skills || null,
          
          // Update Experiences
          ...(body.experiences ? {
            experiences: {
              deleteMany: {},
              create: body.experiences.map((exp) => ({
                company: exp.company || "",
                role: exp.role || "",
                location: exp.location || "",
                startDate: exp.startDate || "",
                endDate: exp.endDate || "",
                current: exp.current || false,
                description: JSON.stringify(exp.bullets || []),
              }))
            }
          } : {}),

          // Update Educations
          ...(body.educations ? {
            educations: {
              deleteMany: {},
              create: body.educations.map((edu) => ({
                institution: edu.institution || "",
                degree: edu.degree || "",
                field: edu.field || "",
                location: edu.location || "",
                startDate: edu.startDate || "",
                endDate: edu.endDate || "",
                current: edu.current || false,
                gpa: edu.gpa || "",
              }))
            }
          } : {}),

          // Update Projects
          ...(body.projects ? {
            projects: {
              deleteMany: {},
              create: body.projects.map((proj) => ({
                name: proj.name || "",
                description: JSON.stringify(proj.bullets || []),
                technologies: Array.isArray(proj.technologies) 
                  ? proj.technologies.join(', ') 
                  : (proj.technologies || ""),
                startDate: proj.startDate || "",
                endDate: proj.endDate || "",
                link: proj.url || "",
                github: proj.github || "",
                guide: proj.guide || "",
                courseName: proj.courseName || "",
              }))
            }
          } : {}),

          // Update Responsibilities
          ...(body.responsibilities ? {
            responsibilities: {
              deleteMany: {},
              create: body.responsibilities.map((resp) => ({
                name: resp.name || "",
                description: JSON.stringify(resp.bullets || []),
                technologies: Array.isArray(resp.technologies) 
                  ? resp.technologies.join(', ') 
                  : (resp.technologies || ""),
                startDate: resp.startDate || "",
                endDate: resp.endDate || "",
                link: resp.url || "",
                github: resp.github || "",
                guide: resp.guide || "",
                courseName: resp.courseName || "",
              }))
            }
          } : {}),
        },
        include: {
          experiences: true,
          educations: true,
          projects: true,
          responsibilities: true,
        }
      });

      return res.status(200).json(profile);
    } 
    
    // 4. Method Not Allowed
    else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("[PROFILE_API_ERROR]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
