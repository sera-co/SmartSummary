// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const summarizeText = async (text) => {
  try {
    // Function schema
    const tools = [
      {
        functionDeclarations: [
          {
            name: "summarizeText",
            description: "Summarize text and extract keywords",
            parameters: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description: "Concise summary of the text in plain English",
                },
                length: {
                  type: "string",
                  enum: ["short", "medium", "long"],
                  description: "Length of the summary",
                },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 important keywords from the text",
                },
              },
              required: ["summary", "keywords"],
            },
          },
        ],
      },
    ];

    // 🟢 One-shot prompt → instruction + one example
    const oneShotPrompt = `
      You are an AI-powered study assistant.
      Summarize the given text and extract 3-5 keywords.
      Respond strictly in JSON matching the function schema.

      Example:
      Input Text: "The water cycle describes how water evaporates, forms clouds, and returns as rain."
      Expected JSON:
      {
        "summary": "The water cycle explains how water evaporates, condenses into clouds, and falls back as rain.",
        "length": "short",
        "keywords": ["water cycle", "evaporation", "clouds", "rain"]
      }

      Now summarize the following text:
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: oneShotPrompt },
            { text }, // actual user text appended after example
          ],
        },
      ],
      tools,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const raw = result.response.text();
    const parsed = JSON.parse(raw);

    return parsed;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`Failed to summarize text: ${error.message}`);
  }
};

module.exports = { summarizeText };
