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
            content:
              "You are an expert resume writer. Polish the given resume text to be more impactful, action-oriented, quantifiable, and ATS-friendly. Return ONLY the polished text. No quotes, no preamble, no explanation.",
          },
          { role: "user", content: text },
        ],
        max_tokens: 300,
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