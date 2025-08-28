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

    // Zero-shot prompt → no examples, just direct instruction
    const zeroShotPrompt = `
      You are an AI-powered study assistant.
      Summarize the given text and extract 3-5 keywords.
      Respond strictly in JSON matching the function schema.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: zeroShotPrompt },
            { text }, // actual user text appended after instructions
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

module.exports = { summarizeText }; //


