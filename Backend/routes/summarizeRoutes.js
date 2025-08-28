// routes/summarizeRoutes.js
const express = require("express");
const { summarizeText } = require("../services/geminiService.js");

const router = express.Router();

// POST /api/summarize
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Summarization Error:", error);
  }
});

module.exports = router;
