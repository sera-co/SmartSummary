// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use latest stable model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const summarizeText = async (text) => {
  try {
    const systemPrompt = `
      ROLE: You are an AI-powered study assistant that simplifies information.
      TASK: Summarize the provided text in a clear and concise way.
      FORMAT: Provide the summary in 3 to 5 sentences, plain text only.
      CONTEXT: The input is educational or article-based content. The goal is to help students quickly understand the key ideas.
    `;

    const userPrompt = `Here is the text:\n\n${text}`;
    const finalPrompt = `${systemPrompt}\n\nUSER: ${userPrompt}`;

    const result = await model.generateContent(finalPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to summarize text");
  }
};

module.exports = { summarizeText };
