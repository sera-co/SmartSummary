const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

const summarizeText = async (text) => {
  try {
    // Define the function schema
    const tools = [
      {
        functionDeclarations: [
          {
            name: "summarizeText",
            description: "Summarize text and extract keywords",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string", description: "Concise summary of the text" },
                length: { type: "string", enum: ["short", "medium", "long"], description: "Length of the summary" },
                keywords: { type: "array", items: { type: "string" }, description: "3-5 keywords" }
              },
              required: ["summary", "keywords"]
            }
          }
        ]
      }
    ];

    // Send request with tools
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
      tools,
      generationConfig: { responseMimeType: "application/json" }
    });

    // The model will now return function call arguments
    const response = result.response;
    return JSON.parse(response.text());

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`Failed to summarize text: ${error.message}`);
  }
};

module.exports = { summarizeText };
