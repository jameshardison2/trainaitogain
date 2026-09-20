const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });

exports.generateAiResponse = onRequest(
  { secrets: ["GEMINI_API_KEY"], cors: true, timeoutSeconds: 60 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).send("Method Not Allowed");
        }
        
        const { systemInstruction, contents, generationConfig } = req.body;
        
        if (!contents) {
          return res.status(400).json({ error: "Missing contents" });
        }
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          logger.error("GEMINI_API_KEY secret is missing");
          return res.status(500).json({ error: "Server Configuration Error" });
        }
        
        const payload = { contents };
        if (systemInstruction) payload.systemInstruction = systemInstruction;
        if (generationConfig) payload.generationConfig = generationConfig;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          logger.error("Gemini API Error:", response.status, errorText);
          return res.status(response.status).json({ error: "Gemini API Error", details: errorText });
        }
        
        const data = await response.json();
        return res.json(data);
      } catch (error) {
        logger.error("Error in generateAiResponse:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
);
