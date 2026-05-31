// api/polish.js  — place this at /api/polish.js in your Vercel project root
// The HF token never reaches the browser; it lives only in Vercel env vars.

const HF_URL = "https://api-inference.huggingface.co/v1/chat/completions";
const HF_MODEL = "Qwen/Qwen2.5-72B-Instruct";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "HF_TOKEN environment variable is not set on Vercel." });
  }

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Missing text field in request body." });
  }

  try {
    const hfRes = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a senior technical resume strategist with 15+ years of experience helping candidates land roles at top-tier companies (FAANG, Fortune 500, elite startups). You have deep expertise in ATS (Applicant Tracking System) optimization, recruiter psychology, and translating raw experience into compelling, quantified achievements.

<task>
Transform the resume bullet point or section provided by the user into a polished, high-impact version that maximizes recruiter engagement and ATS compatibility.
</task>

<instructions>
Follow these steps in order when rewriting the resume text:

1. LEAD WITH A STRONG ACTION VERB: Start with a past-tense, industry-specific power verb (e.g., Architected, Spearheaded, Engineered, Orchestrated, Optimized, Delivered). Never start with "Responsible for", "Helped", "Worked on", or "Assisted".

2. QUANTIFY IMPACT: Add or preserve concrete metrics wherever possible. Use the formula: Action + Context + Result (with numbers). If no numbers exist in the input, infer plausible scope (e.g., "across a team of X", "serving N users") or use relative language ("significantly reduced", "by 40%+").

3. HIGHLIGHT TECHNICAL SPECIFICITY: Preserve and surface specific technologies, frameworks, methodologies, or tools mentioned. If absent, keep the language precise but domain-neutral.

4. OPTIMIZE FOR ATS: Use industry-standard keywords that align with software engineering / tech roles. Avoid jargon that ATS systems cannot parse. Prefer noun phrases that match common job description terms.

5. TIGHTEN THE LANGUAGE: Each bullet must be one sentence, 15–25 words. Cut filler words (e.g., "various", "multiple", "in order to"). Make every word earn its place.

6. PRESERVE THE CORE TRUTH: Do not fabricate experience. Elevate and reframe what is already there — do not invent skills, roles, or outcomes that were not implied by the input.
</instructions>

<constraints>
- Do NOT add preamble, commentary, or explanation of your changes.
- Do NOT wrap the output in quotes or markdown formatting.
- Do NOT ask clarifying questions.
- Do NOT output multiple alternatives — produce one definitive, polished version.
- Output ONLY the rewritten resume text, exactly as it should appear on the resume.
- STRICT LENGTH LIMIT: The output must be a single line. Do NOT produce multiple lines, multiple bullets, or line breaks of any kind, regardless of how much input is provided.
</constraints>

<output_format>
Return exactly ONE line of polished resume text — no newlines, no bullet symbols, no numbering. The single line must follow the formula: [Power Verb] + [What you did] + [Measurable result], kept to 15–25 words.
</output_format>`,

          },
          {
            role: "user",
            content: `<resume_text>
${text}
</resume_text>`,
          },
        ],
        max_tokens: 80,
      }),
    });

    const data = await hfRes.json();

    if (data.error) {
      return res.status(502).json({ error: data.error.message || "HuggingFace API error" });
    }

    return res.status(200).json({ result: data.choices[0].message.content.trim() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}