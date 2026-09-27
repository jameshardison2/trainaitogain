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

const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp();
}

const { onSchedule } = require("firebase-functions/v2/scheduler");

exports.sendFollowUpEmails = onSchedule("every 1 hours", async (event) => {
  const db = admin.firestore();
  const now = new Date();
  
  // Look for leads created between 24 and 25 hours ago
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);

  try {
    const snapshot = await db.collection("leads")
      .where("timestamp", "<=", twentyFourHoursAgo)
      .where("timestamp", ">=", twentyFiveHoursAgo)
      .get();

    if (snapshot.empty) {
      logger.info("No leads found in the 24h-25h window.");
      return;
    }

    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Skip if we already sent it
      if (data.followUpSent) return;
      if (!data.email) return;

      // 1. Create the email document to trigger the Firebase Extension
      const mailRef = db.collection("mail").doc();
      batch.set(mailRef, {
        to: data.email,
        message: {
          subject: "Did you finish your Mercor application?",
          html: `<p>Hi ${data.firstName || 'there'},</p>
                 <p>We noticed you started the process to join the AI Talent Network. Did you finish your application?</p>
                 <p>Here are the 3 steps people miss that guarantee proper routing to the high-paying roles:</p>
                 <ol>
                   <li>Complete the initial profile setup.</li>
                   <li>Take the 15-minute AI voice interview.</li>
                   <li>Make sure your resume is fully uploaded.</li>
                 </ol>
                 <p>You can resume your application here: <a href="https://trainaitogain.com/apply">https://trainaitogain.com/apply</a></p>
                 <p>Let us know if you need any help!</p>
                 <p>- The TrainAIToGain Team</p>`
        }
      });

      // 2. Mark the lead so we don't email them again
      batch.update(doc.ref, { followUpSent: true });
      count++;
    });

    if (count > 0) {
      await batch.commit();
      logger.info(`Successfully queued ${count} follow-up emails.`);
    }
  } catch (error) {
    logger.error("Error processing follow-up emails:", error);
  }
});
