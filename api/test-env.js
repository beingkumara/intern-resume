export default function handler(req, res) {
  res.status(200).json({
    hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    secretKey: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.slice(0, 5) + '...' : undefined,
    hasDbUrl: !!process.env.DATABASE_URL
  });
}
