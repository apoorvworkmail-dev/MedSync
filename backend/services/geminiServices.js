const { GoogleGenerativeAI } = require("@google/generative-ai");

// Uses GOOGLE AI Studio API key via env var:
//   GEMINI_API_KEY=... (or you can set GOOGLE_GEMINI_API_KEY)
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  // Do not crash server on import; only fail when chat is called.
  console.warn(
    "Warning: GEMINI_API_KEY is not set. AI endpoint will return 500 until you set it."
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function askGemini(prompt) {
  if (!apiKey || !genAI) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const text = result?.response?.text();

  return text || "No response from AI";
}

module.exports = askGemini;

