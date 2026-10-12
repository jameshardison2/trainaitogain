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

const DOMAINS_MAP = [
  ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed|preclinical/i],
  ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
  ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
  ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian|native speaker/i],
  ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
  ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear|energetic/i],
  ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
];

function sanitizeDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const JUNK = /steps? completed|submitted on|hired this month|early applicant|1-click apply|new opportunity|posted by|referral|refer |earn \$|bonus|^apply\b|^share\b|copy link|view all opportunities|^\$[\d,]+$|^[A-Z]$|^\d+ hired/i;
  const lines = desc.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 25 && !JUNK.test(l) && !/^\s*\$[\d,]+(?:\.\d+)?(?:\s*[-–to]+\s*\$?[\d,]+)?\s*(?:\/|per)\s*(?:hour|hr|month|mo|year|yr|task)/i.test(l));
  let clean = lines.join(' ').replace(/\s+/g, ' ').trim();
  if (JUNK.test(clean)) {
    // If entire string still has leaked phrases, extract safe part or clear
    clean = clean.split(JUNK)[0].trim();
  }
  return clean.substring(0, 350);
}

function resolveDomain(title, desc, existingDomain) {
  if (existingDomain && existingDomain !== 'SOFTWARE' && existingDomain !== 'GENERAL') {
    return existingDomain.toUpperCase();
  }
  for (const [dom, re] of DOMAINS_MAP) {
    if (re.test(title || '')) return dom;
  }
  for (const [dom, re] of DOMAINS_MAP) {
    if (re.test(desc || '')) return dom;
  }
  return (existingDomain || 'GENERAL').toUpperCase();
}

exports.directIngestJobs = onRequest(
  { cors: true, timeoutSeconds: 120, maxInstances: 5 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).send("Method Not Allowed");
        }

        const { jobs, token, syncedAt, platform, fullSync } = req.body || {};

        if (token !== "TRAINAITOGAIN_SYNC_SECURE_2026") {
          logger.warn("Unauthorized sync attempt to directIngestJobs");
          return res.status(401).json({ error: "Unauthorized: Invalid sync token" });
        }

        if (!Array.isArray(jobs)) {
          return res.status(400).json({ error: "Payload must include an array of jobs" });
        }

        const db = admin.firestore();

        // 1. Update metadata
        await db.collection("system").doc("sync_metadata").set({
          platform: platform || "Mercor",
          syncedAt: syncedAt || new Date().toISOString(),
          totalJobs: jobs.length,
          fullSync: !!fullSync,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 2. Write jobs into 'roles' collection in batches of up to 400
        const batchSize = 400;
        for (let i = 0; i < jobs.length; i += batchSize) {
          const chunk = jobs.slice(i, i + batchSize);
          const batch = db.batch();
          for (const job of chunk) {
            // Clean description and classify domain
            const cleanDesc = sanitizeDescription(job.description);
            const domain = resolveDomain(job.title, cleanDesc, job.domain);
            
            // Unique slug from title + pay or linkTarget per Section 6b.6
            const paySlug = (job.pay || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const linkSlug = (job.linkTarget || '').split('/').pop() || '';
            const titleSlug = (job.title || "job").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
            const rawId = `${titleSlug}-${paySlug || linkSlug || 'role'}`;
            const docId = rawId.substring(0, 80);
            
            const ref = db.collection("roles").doc(docId);
            batch.set(ref, {
              ...job,
              description: cleanDesc,
              domain: domain,
              lastUpdated: syncedAt || new Date().toISOString(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          }
          await batch.commit();
        }

        logger.info(`directIngestJobs: Synced ${jobs.length} jobs for ${platform || "Mercor"}`);
        return res.status(200).json({
          success: true,
          count: jobs.length,
          syncedAt: syncedAt || new Date().toISOString()
        });
      } catch (error) {
        logger.error("Error in directIngestJobs:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

exports.getRoles = onRequest(
  { cors: true, timeoutSeconds: 60, maxInstances: 5 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = admin.firestore();
        const snapshot = await db.collection("roles").get();
        const roles = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          if (doc.id === 'sample-engineer' || (d.title && (d.title.toLowerCase().includes('sample') || d.title.toLowerCase().includes('test')))) {
            return;
          }
          // Sanitize description and classify domain on read
          const sanitizedDesc = sanitizeDescription(d.description);
          const resolvedDom = resolveDomain(d.title, sanitizedDesc, d.domain);
          
          roles.push({
            ...d,
            description: sanitizedDesc,
            domain: resolvedDom
          });
        });
        const metaDoc = await db.collection("system").doc("sync_metadata").get();
        const meta = metaDoc.exists ? metaDoc.data() : {};
        return res.json({
          count: roles.length,
          meta,
          roles
        });
      } catch (error) {
        logger.error("Error in getRoles:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

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
