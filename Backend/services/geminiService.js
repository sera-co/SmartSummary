// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const summarizeText = async (text) => {
  try {
    const systemPrompt = `
      ROLE: You are an AI-powered study assistant.
      TASK: Summarize the text in JSON format.
      FORMAT: JSON object with fields:
        - summary: (string) concise summary in plain text
        - length: (string) short/medium/long depending on summary size
        - keywords: (array of strings) 3-5 key terms
      CONTEXT: The input is educational content to help students.
    `;

    const userPrompt = `Here is the text:\n\n${text}`;
    const finalPrompt = `${systemPrompt}\n\nUSER: ${userPrompt}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // ✅ force JSON output
      },
    });

    // Now Gemini is forced to return JSON
    const parsedOutput = JSON.parse(result.response.text());
    return parsedOutput;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`Failed to summarize text: ${error.message}`);
  }
};

module.exports = { summarizeText };
