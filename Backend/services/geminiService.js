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

    // 🟢 Multi-shot prompt → multiple examples
    const multiShotPrompt = `
      You are an AI-powered study assistant.
      Summarize the given text and extract 3-5 keywords.
      Respond strictly in JSON matching the function schema.

      Example 1:
      Input Text: "The water cycle describes how water evaporates, forms clouds, and returns as rain."
      Expected JSON:
      {
        "summary": "The water cycle explains how water evaporates, condenses into clouds, and falls back as rain.",
        "length": "short",
        "keywords": ["water cycle", "evaporation", "clouds", "rain"]
      }

      Example 2:
      Input Text: "Photosynthesis is the process by which plants use sunlight to make food from carbon dioxide and water."
      Expected JSON:
      {
        "summary": "Photosynthesis allows plants to create food using sunlight, carbon dioxide, and water.",
        "length": "short",
        "keywords": ["photosynthesis", "plants", "sunlight", "carbon dioxide", "water"]
      }

      Example 3:
      Input Text: "World War II was a global conflict from 1939 to 1945 involving most of the world's nations."
      Expected JSON:
      {
        "summary": "World War II was a worldwide conflict between 1939 and 1945 involving major global powers.",
        "length": "short",
        "keywords": ["World War II", "global conflict", "1939", "1945", "nations"]
      }

      Now summarize the following text:
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: multiShotPrompt },
            { text }, // actual user text appended after multiple examples
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
