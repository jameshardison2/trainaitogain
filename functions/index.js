const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

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

const REFERRAL_LEAK_RE = /signed up|application (started|completed)|offer extended|referee|earnings cap|paid to date|vouched|bulk reminder|loaded \d+ of|my referrals|my connections/i;

function sanitizeDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  if (REFERRAL_LEAK_RE.test(desc)) return '';
  const JUNK = /steps? completed|submitted on|hired this month|early applicant|1-click apply|new opportunity|posted by|referral|refer |earn \$|bonus|^apply\b|^share\b|copy link|view all opportunities|^\$[\d,]+$|^[A-Z]$|^\d+ hired|signed up|application (started|completed)|offer extended|referee|earnings cap|paid to date|vouched|bulk reminder|loaded \d+ of|my referrals|my connections/i;
  const lines = desc.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 25 && !JUNK.test(l) && !/^\s*\$[\d,]+(?:\.\d+)?(?:\s*[-–to]+\s*\$?[\d,]+)?\s*(?:\/|per)\s*(?:hour|hr|month|mo|year|yr|task)/i.test(l));
  let clean = lines.join(' ').replace(/\s+/g, ' ').trim();
  if (JUNK.test(clean) || REFERRAL_LEAK_RE.test(clean)) {
    clean = clean.split(JUNK)[0].trim();
  }
  if (REFERRAL_LEAK_RE.test(clean)) return '';
  return clean.substring(0, 350);
}

function resolveDomain(title, desc, existingDomain) {
  if (existingDomain && typeof existingDomain === 'string' && existingDomain.trim()) {
    const dUpper = existingDomain.trim().toUpperCase();
    if (dUpper !== 'GENERAL') return dUpper;
  }
  for (const [dom, re] of DOMAINS_MAP) {
    if (re.test(title || '')) return dom;
  }
  for (const [dom, re] of DOMAINS_MAP) {
    if (re.test(desc || '')) return dom;
  }
  return 'GENERAL';
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
            // Apply junk filter and resolve domain
            let cleanDesc = sanitizeDescription(job.description);
            if (REFERRAL_LEAK_RE.test(job.description || '') || REFERRAL_LEAK_RE.test(cleanDesc)) {
              cleanDesc = '';
            }
            const domain = (job.domain && typeof job.domain === 'string' && job.domain.trim())
              ? job.domain.trim().toUpperCase()
              : resolveDomain(job.title, cleanDesc, null);
            
            // Unique slug from title + pay or linkTarget per Section 6b.6
            const paySlug = (job.pay || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const linkSlug = (job.linkTarget || '').split('/').pop() || '';
            const titleSlug = (job.title || "job").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
            const rawId = `${titleSlug}-${paySlug || linkSlug || 'role'}`;
            const docId = rawId.substring(0, 80);
            
            const ref = db.collection("roles").doc(docId);
            batch.set(ref, {
              title: job.title || "",
              linkTarget: job.linkTarget || "", // Kept exactly as sent (Section 6b.1)
              pay: job.pay || "Competitive",     // Kept exactly as sent (Section 6b.2)
              payUnit: job.payUnit || null,
              payMin: job.payMin !== undefined ? job.payMin : null,
              payMax: job.payMax !== undefined ? job.payMax : null,
              description: cleanDesc,           // Junk-text & referral-leak filtered (Section 14 R2b-1, Section 15 R2c-1)
              domain: domain,                   // Saved domain (Section 14 R2b-2)
              atsKeywords: job.atsKeywords || [],
              tags: job.tags || ['Remote'],
              platform: job.platform || platform || "Mercor",
              linkIsSpecific: job.linkIsSpecific !== undefined ? job.linkIsSpecific : true,
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
        const cleanupBatch = db.batch();
        let cleanedDocsCount = 0;

        snapshot.forEach(doc => {
          const d = doc.data();
          if (doc.id === 'sample-engineer' || (d.title && (d.title.toLowerCase().includes('sample') || d.title.toLowerCase().includes('test')))) {
            return;
          }

          // Check if description has leaked referral text or is the Medicare Advantage role
          const hasLeakedDesc = (d.description && REFERRAL_LEAK_RE.test(d.description)) ||
            (d.title && d.title.toLowerCase().includes('medicare advantage brokers survey'));

          if (hasLeakedDesc && d.description) {
            cleanupBatch.update(doc.ref, { description: "" });
            cleanedDocsCount++;
          }

          // Sanitize description and classify domain on read
          let sanitizedDesc = hasLeakedDesc ? "" : sanitizeDescription(d.description);
          if (REFERRAL_LEAK_RE.test(sanitizedDesc)) sanitizedDesc = "";
          const resolvedDom = resolveDomain(d.title, sanitizedDesc, d.domain);
          
          // Return ONLY the public fields needed by the page (Section 15 R2c-1 item 3)
          roles.push({
            id: doc.id,
            title: d.title || "",
            pay: d.pay || "Competitive",
            payUnit: d.payUnit || null,
            domain: resolvedDom,
            tags: Array.isArray(d.tags) ? d.tags : ['Remote'],
            platform: d.platform || "Mercor",
            linkTarget: d.linkTarget || "",
            linkIsSpecific: d.linkIsSpecific !== undefined ? d.linkIsSpecific : true,
            description: sanitizedDesc,
            atsKeywords: Array.isArray(d.atsKeywords) ? d.atsKeywords : []
          });
        });

        if (cleanedDocsCount > 0) {
          await cleanupBatch.commit();
          logger.info(`Cleaned description on ${cleanedDocsCount} roles in Firestore`);
        }

        const metaDoc = await db.collection("system").doc("sync_metadata").get();
        const meta = metaDoc.exists ? metaDoc.data() : {};
        return res.json({
          count: roles.length,
          meta: {
            platform: meta.platform || "Mercor",
            syncedAt: meta.syncedAt || null,
            totalJobs: meta.totalJobs || roles.length
          },
          roles
        });
      } catch (error) {
        logger.error("Error in getRoles:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

exports.logPipelineEvent = onRequest(
  { cors: true, timeoutSeconds: 15, maxInstances: 10 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { event_type, referral_id, session_id, page_url } = req.body || {};
        
        const ALLOWED_EVENTS = new Set(["page_view", "application_started"]);
        if (!event_type || !ALLOWED_EVENTS.has(event_type)) {
          return res.status(400).json({ error: "Invalid event_type" });
        }

        const safeSessionId = typeof session_id === "string" ? session_id.substring(0, 64) : "sess_unknown";
        const safeReferralId = typeof referral_id === "string" ? referral_id.substring(0, 64) : "organic";
        const safePageUrl = typeof page_url === "string" ? page_url.substring(0, 128) : "/";

        const db = admin.firestore();
        await db.collection("pipeline_events").add({
          event_type,
          referral_id: safeReferralId,
          session_id: safeSessionId,
          page_url: safePageUrl,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(200).json({ success: true });
      } catch (error) {
        logger.error("Error in logPipelineEvent:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
);

// ===============================================================
// EMAIL SYSTEM & SUBSCRIBER SECURITY HELPERS
// ===============================================================

const rateLimitMap = new Map();
function isRateLimited(key, maxLimit = 3, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || (now - entry.startTime) > windowMs) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    return false;
  }
  if (entry.count >= maxLimit) {
    return true;
  }
  entry.count++;
  return false;
}

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

function escapeHtml(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getOrCreateSubscriber(db, email, subscribeToAlerts = false) {
  const cleanEmail = email.trim().toLowerCase();
  const subsRef = db.collection("subscribers");
  const q = await subsRef.where("email", "==", cleanEmail).limit(1).get();

  if (!q.empty) {
    const doc = q.docs[0];
    const data = doc.data();
    let unsubToken = data.unsubToken;
    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (!unsubToken) {
      unsubToken = generateToken();
      updates.unsubToken = unsubToken;
    }
    if (subscribeToAlerts) {
      updates.subscribedToAlerts = true;
      updates.unsubscribed = false;
    }
    await doc.ref.update(updates);
    return { id: doc.id, ...data, unsubToken };
  } else {
    const unsubToken = generateToken();
    const newDoc = {
      email: cleanEmail,
      unsubToken,
      subscribedToAlerts: !!subscribeToAlerts,
      unsubscribed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const ref = await subsRef.add(newDoc);
    return { id: ref.id, ...newDoc };
  }
}

// ===============================================================
// 1. sendMockResultsEmail (Server Function with Rate Limiting)
// ===============================================================
exports.sendMockResultsEmail = onRequest(
  { cors: true, timeoutSeconds: 30, maxInstances: 10 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email, targetRole, score, strengthSummary, growthSummary } = req.body || {};

        if (!email || typeof email !== "string" || !email.includes("@") || email.length > 100) {
          return res.status(400).json({ error: "Valid email address is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";

        // Rate limiting: max 5 requests per IP and max 3 requests per email per 10 minutes
        if (isRateLimited(`mock_ip_${clientIp}`, 5, 10 * 60 * 1000) ||
            isRateLimited(`mock_email_${cleanEmail}`, 3, 10 * 60 * 1000)) {
          return res.status(429).json({ error: "Rate limit exceeded. Please wait a few minutes before requesting another report." });
        }

        const db = admin.firestore();

        // Retrieve or generate subscriber token. IMPORTANT: DO NOT subscribe to role alerts.
        const subscriber = await getOrCreateSubscriber(db, cleanEmail, false);
        const unsubToken = subscriber.unsubToken || generateToken();

        const safeRole = escapeHtml((targetRole || "General AI Talent").substring(0, 80));
        const safeScore = Math.max(0, Math.min(100, parseInt(score, 10) || 75));
        const safeStrengths = escapeHtml((strengthSummary || "Structured pacing and clear communication.").substring(0, 1000));
        const safeGrowth = escapeHtml((growthSummary || "Continue incorporating STAR principles and measurable metrics.").substring(0, 1000));

        const unsubUrl = `https://trainaitogain.com/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

        const subject = `Your AI Practice Interview Results: ${safeRole} (Score: ${safeScore}/100)`;
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; margin:0; padding:24px; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">
    <tr>
      <td style="padding:24px 32px; background:#111827; text-align:center;">
        <span style="color:#ffffff; font-size:20px; font-weight:800; letter-spacing:-0.02em;">TrainAIToGain</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="font-size:22px; font-weight:800; color:#111827; margin:0 0 12px;">Your AI Practice Interview Summary</h2>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 24px;">
          Here are your mock interview performance metrics and coaching breakdown for <strong>${safeRole}</strong>.
        </p>

        <!-- Score Card -->
        <table width="100%" style="background:#f3f4f6; border-radius:8px; padding:20px; margin-bottom:24px; text-align:center;">
          <tr>
            <td>
              <div style="font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Overall Drill Score</div>
              <div style="font-size:44px; font-weight:900; color:#10b981;">${safeScore}<span style="font-size:22px; font-weight:600; color:#6b7280;">/100</span></div>
            </td>
          </tr>
        </table>

        <!-- Strengths -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:15px; font-weight:700; color:#065f46; margin:0 0 6px;">Key Strengths</h3>
          <p style="color:#374151; font-size:14px; line-height:1.6; margin:0; white-space:pre-line;">${safeStrengths}</p>
        </div>

        <!-- Growth Areas -->
        <div style="margin-bottom:24px;">
          <h3 style="font-size:15px; font-weight:700; color:#92400e; margin:0 0 6px;">Areas for Growth</h3>
          <p style="color:#374151; font-size:14px; line-height:1.6; margin:0; white-space:pre-line;">${safeGrowth}</p>
        </div>

        <!-- Next Steps Advice -->
        <div style="background:#ecfdf5; border-left:4px solid #10b981; padding:14px 16px; border-radius:4px; margin-bottom:28px;">
          <strong style="color:#065f46; font-size:14px;">Next Step:</strong>
          <p style="color:#047857; font-size:14px; line-height:1.5; margin:4px 0 0;">
            Use each platform&#39;s official practice option before your real interview.
          </p>
        </div>

        <div style="text-align:center; margin-bottom:24px;">
          <a href="https://trainaitogain.com/apply" style="display:inline-block; background:#10b981; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:8px;">
            Explore Active Matching Roles ➔
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#6b7280; line-height:1.6;">
        <p style="margin:0 0 8px;">TrainAIToGain &bull; [Postal Address Pending] &bull; Independent Candidate Preparation Platform</p>
        <p style="margin:0 0 8px;">You received this report because you requested your practice interview results.</p>
        <p style="margin:0;">
          <a href="${unsubUrl}" style="color:#6b7280; text-decoration:underline;">Unsubscribe</a> &bull; 
          <a href="https://trainaitogain.com/disclosure.html" style="color:#6b7280; text-decoration:underline;">Affiliate Disclosure</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const text = `TrainAIToGain - Your AI Practice Interview Summary\n\nTarget Role: ${safeRole}\nOverall Score: ${safeScore}/100\n\nKey Strengths:\n${safeStrengths}\n\nAreas for Growth:\n${safeGrowth}\n\nNext Step: Use each platform's official practice option before your real interview.\n\nExplore Active Roles: https://trainaitogain.com/apply\n\nTrainAIToGain • [Postal Address Pending] • Independent Candidate Preparation Platform\nUnsubscribe: ${unsubUrl}`;

        // Write directly to mail collection for Trigger Email extension (Admin SDK only)
        await db.collection("mail").add({
          to: cleanEmail,
          message: {
            subject,
            html,
            text
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Record telemetry event in pipeline_events
        await db.collection("pipeline_events").add({
          event_type: "email_sent_mock_results",
          email: cleanEmail,
          targetRole: safeRole,
          score: safeScore,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(200).json({ success: true, message: "Mock results email queued successfully" });
      } catch (error) {
        logger.error("Error in sendMockResultsEmail:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 2. subscribeRoleAlerts (Explicit Opt-In for Role Alerts)
// ===============================================================
exports.subscribeRoleAlerts = onRequest(
  { cors: true, timeoutSeconds: 30, maxInstances: 10 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email, role, domain } = req.body || {};
        if (!email || typeof email !== "string" || !email.includes("@") || email.length > 100) {
          return res.status(400).json({ error: "Valid email address is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";

        if (isRateLimited(`role_alert_ip_${clientIp}`, 5, 10 * 60 * 1000) ||
            isRateLimited(`role_alert_email_${cleanEmail}`, 3, 10 * 60 * 1000)) {
          return res.status(429).json({ error: "Rate limit exceeded. Please wait a few minutes." });
        }

        const db = admin.firestore();
        const subscriber = await getOrCreateSubscriber(db, cleanEmail, true);

        const updates = {
          subscribedToAlerts: true,
          unsubscribed: false,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        if (role) updates.preferredRole = String(role).substring(0, 80);
        if (domain) updates.preferredDomain = String(domain).substring(0, 50);

        await db.collection("subscribers").doc(subscriber.id).update(updates);

        // Section 20.1: Send Welcome Email instantly on signup
        const unsubToken = subscriber.unsubToken || generateToken();
        const unsubUrl = `https://trainaitogain.com/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
        const welcomeSubject = "You're on the list for new AI evaluation roles";
        const welcomeHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${welcomeSubject}</title></head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; margin:0; padding:24px; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">
    <tr>
      <td style="padding:24px 32px; background:#111827; text-align:center;">
        <span style="color:#ffffff; font-size:20px; font-weight:800; letter-spacing:-0.02em;">TrainAIToGain</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="font-size:20px; font-weight:800; color:#111827; margin:0 0 16px;">You&#39;re on the list for new AI evaluation roles</h2>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 16px;">
          Hi there, thanks for signing up. Each Friday, if new roles match your field, we&#39;ll email them to you with direct links to apply. No match that week, no email.
        </p>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 24px;">
          While you wait, you can check your resume against the roles open right now:
        </p>
        <div style="margin-bottom:28px;">
          <a href="https://trainaitogain.com/resume-ats-guide" style="display:inline-block; background:#10b981; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:12px 24px; border-radius:6px;">
            Check Open Roles on ATS Scanner ➔
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#6b7280; line-height:1.6;">
        <p style="margin:0 0 8px;">TrainAIToGain &bull; [Postal Address Pending] &bull; Independent Candidate Preparation Platform</p>
        <p style="margin:0;">
          <a href="${unsubUrl}" style="color:#6b7280; text-decoration:underline;">Unsubscribe</a> &bull; 
          <a href="https://trainaitogain.com/disclosure.html" style="color:#6b7280; text-decoration:underline;">Affiliate Disclosure</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const welcomeText = `Hi there, thanks for signing up. Each Friday, if new roles match your field, we'll email them to you with direct links to apply. No match that week, no email. While you wait, you can check your resume against the roles open right now: https://trainaitogain.com/resume-ats-guide\n\nTrainAIToGain • [Postal Address Pending] • Independent Candidate Preparation Platform\nUnsubscribe: ${unsubUrl}`;

        await db.collection("mail").add({
          to: cleanEmail,
          message: {
            subject: welcomeSubject,
            html: welcomeHtml,
            text: welcomeText
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(200).json({
          success: true,
          message: "Subscribed to role alerts successfully"
        });
      } catch (error) {
        logger.error("Error in subscribeRoleAlerts:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 3. recordUnsubscribe (Token-Based Opt-Out)
// ===============================================================
exports.recordUnsubscribe = onRequest(
  { cors: true, timeoutSeconds: 15, maxInstances: 10 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const token = (req.method === "POST" ? req.body?.token : req.query?.token) || "";
        const email = (req.method === "POST" ? req.body?.email : req.query?.email) || "";

        if (!token && !email) {
          return res.status(400).json({ error: "Token or email is required" });
        }

        const db = admin.firestore();
        let targetDoc = null;

        if (token && typeof token === "string") {
          const q = await db.collection("subscribers").where("unsubToken", "==", token.trim()).limit(1).get();
          if (!q.empty) {
            targetDoc = q.docs[0];
          }
        }

        if (!targetDoc && email && typeof email === "string" && email.includes("@")) {
          const q = await db.collection("subscribers").where("email", "==", email.trim().toLowerCase()).limit(1).get();
          if (!q.empty) {
            targetDoc = q.docs[0];
          }
        }

        if (targetDoc) {
          await targetDoc.ref.update({
            unsubscribed: true,
            subscribedToAlerts: false,
            unsubscribedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.status(200).json({
            success: true,
            email: targetDoc.data().email || email,
            message: "Successfully unsubscribed"
          });
        }

        // If not found in subscribers collection, log the opt-out anyway
        if (email && typeof email === "string" && email.includes("@")) {
          await db.collection("subscribers").add({
            email: email.trim().toLowerCase(),
            unsubToken: token || generateToken(),
            unsubscribed: true,
            subscribedToAlerts: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            unsubscribedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }

        return res.status(200).json({
          success: true,
          message: "Unsubscribe recorded successfully"
        });
      } catch (error) {
        logger.error("Error in recordUnsubscribe:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 4. sendRoleAlertsDigest (Manual Trigger Post-Sync, No Schedule)
// ===============================================================
exports.sendRoleAlertsDigest = onRequest(
  { cors: true, timeoutSeconds: 300, maxInstances: 1 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const authSecret = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") ||
          req.query.key ||
          req.body?.key;
        const EXPECTED_SECRET = process.env.ADMIN_SYNC_SECRET || "TRAINAITOGAIN_SYNC_SECURE_2026";

        if (!authSecret || authSecret !== EXPECTED_SECRET) {
          return res.status(401).json({ error: "Unauthorized: Invalid or missing sync secret key" });
        }

        const db = admin.firestore();

        // 1. Fetch active subscribers who opted in to role alerts
        const subsSnapshot = await db.collection("subscribers")
          .where("subscribedToAlerts", "==", true)
          .get();

        // TEST MODE FOR DIGEST & REMINDERS (Strictly send ONLY to approved test recipient until postal address is configured)
        const DIGEST_TEST_MODE = true;
        const APPROVED_TEST_RECIPIENT = "james.hardison2@gmail.com";

        let activeSubscribers = [];
        subsSnapshot.forEach((doc) => {
          const d = doc.data();
          if (!d.unsubscribed && d.email) {
            activeSubscribers.push({ id: doc.id, ...d });
          }
        });

        // Test mode restriction: strictly send only to james.hardison2@gmail.com until postal address provided
        if (DIGEST_TEST_MODE) {
          activeSubscribers = activeSubscribers.filter(s => s.email && s.email.toLowerCase() === APPROVED_TEST_RECIPIENT.toLowerCase());
          if (activeSubscribers.length === 0) {
            activeSubscribers = [{ id: "test-admin", email: APPROVED_TEST_RECIPIENT, unsubToken: "test-admin-token" }];
          }
        }

        if (activeSubscribers.length === 0) {
          return res.status(200).json({
            success: true,
            subscribersCount: 0,
            emailsQueued: 0,
            message: "No active subscribers found for role alerts digest."
          });
        }

        // 2. Fetch available roles from Firestore (or fallback to local waves)
        const rolesSnapshot = await db.collection("roles").get();
        const allRoles = [];
        rolesSnapshot.forEach((doc) => {
          const d = doc.data();
          if (doc.id === "sample-engineer") return;
          allRoles.push({ id: doc.id, ...d });
        });

        let availableRoles = allRoles;
        if (availableRoles.length === 0) {
          try {
            const wavesData = require("./waves.json");
            availableRoles = Array.isArray(wavesData) ? wavesData : [];
          } catch (e) {
            availableRoles = [];
          }
        }

        if (availableRoles.length === 0) {
          return res.status(200).json({
            success: true,
            subscribersCount: activeSubscribers.length,
            emailsQueued: 0,
            message: "No roles available to send."
          });
        }

        // Format role cards with strict referral link rules
        function formatRoleUrl(role) {
          const isMicro1 = (role.platform && role.platform.toLowerCase() === "micro1") ||
            (role.linkTarget && role.linkTarget.includes("micro1"));
          
          if (isMicro1) {
            const base = role.linkTarget || "https://refer.micro1.ai/referral/jobs/";
            const code = "05216c9f-87cc-49af-b448-f9f8a18d2efe";
            if (base.includes(code)) return base;
            return base.includes("?") ? `${base}&referralCode=${code}` : `${base}?referralCode=${code}`;
          }

          // Mercor link (t.mercor.com)
          let target = role.linkTarget || "https://t.mercor.com";
          if (!target.startsWith("http")) target = `https://t.mercor.com/${target}`;
          return target;
        }

        let queuedCount = 0;
        const now = admin.firestore.FieldValue.serverTimestamp();

        for (const sub of activeSubscribers) {
          const unsubToken = sub.unsubToken || generateToken();
          const unsubUrl = `https://trainaitogain.com/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

          // Select top 3 matched or latest roles
          let selectedRoles = availableRoles;
          if (sub.preferredDomain) {
            const domainFiltered = availableRoles.filter(r => r.domain === sub.preferredDomain);
            if (domainFiltered.length > 0) selectedRoles = domainFiltered;
          }
          const rolesForEmail = selectedRoles.slice(0, 3);

          const roleCardsHtml = rolesForEmail.map((r) => {
            const url = formatRoleUrl(r);
            const platformName = r.platform || (url.includes("micro1") ? "micro1" : "Mercor");
            return `
              <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; padding:18px; margin-bottom:14px; text-align:left;">
                <div style="font-size:12px; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">
                  ${escapeHtml(platformName)} &bull; ${escapeHtml(r.domain || "AI Talent")}
                </div>
                <h4 style="font-size:16px; font-weight:800; color:#111827; margin:0 0 6px;">${escapeHtml(r.title || "AI Specialist Role")}</h4>
                <div style="font-size:14px; font-weight:700; color:#059669; margin-bottom:8px;">${escapeHtml(r.pay || "Competitive")}</div>
                <div style="margin-top:10px;">
                  <a href="${url}" style="display:inline-block; background:#10b981; color:#ffffff; font-size:13px; font-weight:700; text-decoration:none; padding:10px 18px; border-radius:6px;">
                    View & Apply on ${escapeHtml(platformName)} ➔
                  </a>
                </div>
              </div>
            `;
          }).join("");

          const subject = `Weekly AI Role Matches: ${rolesForEmail.length} New Openings`;
          const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; margin:0; padding:24px; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">
    <tr>
      <td style="padding:24px 32px; background:#111827; text-align:center;">
        <span style="color:#ffffff; font-size:20px; font-weight:800; letter-spacing:-0.02em;">TrainAIToGain</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="font-size:22px; font-weight:800; color:#111827; margin:0 0 8px;">Weekly AI Role Digest</h2>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 24px;">
          Here are this week&#39;s newly synced opportunities matching active remote AI trainer, reviewer, and engineering requirements.
        </p>

        <!-- Role Cards -->
        <div style="margin-bottom:24px;">
          ${roleCardsHtml}
        </div>

        <div style="background:#ecfdf5; border-left:4px solid #10b981; padding:14px 16px; border-radius:4px; margin-bottom:28px;">
          <strong style="color:#065f46; font-size:14px;">Preparation Tip:</strong>
          <p style="color:#047857; font-size:14px; line-height:1.5; margin:4px 0 0;">
            Use each platform&#39;s official practice option before your real interview.
          </p>
        </div>

        <div style="text-align:center; margin-bottom:20px;">
          <a href="https://trainaitogain.com/apply" style="display:inline-block; background:#111827; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:12px 24px; border-radius:6px;">
            Browse All Active Roles ➔
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#6b7280; line-height:1.6;">
        <p style="margin:0 0 8px;">TrainAIToGain &bull; [Postal Address Pending] &bull; Independent Candidate Preparation Platform</p>
        <p style="margin:0 0 8px;">You are receiving this digest because you subscribed to weekly AI role alerts.</p>
        <p style="margin:0;">
          <a href="${unsubUrl}" style="color:#6b7280; text-decoration:underline;">Unsubscribe</a> &bull; 
          <a href="https://trainaitogain.com/disclosure.html" style="color:#6b7280; text-decoration:underline;">Affiliate Disclosure</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

          const text = `TrainAIToGain - Weekly AI Role Digest\n\nTop Newly Synced Openings:\n${rolesForEmail.map(r => `- ${r.title} (${r.pay || 'Competitive'}) on ${r.platform || 'Mercor'}: ${formatRoleUrl(r)}`).join('\n')}\n\nPreparation Tip: Use each platform's official practice option before your real interview.\n\nBrowse All Active Roles: https://trainaitogain.com/apply\n\nTrainAIToGain • [Postal Address Pending] • Independent Candidate Preparation Platform\nUnsubscribe: ${unsubUrl}`;

          await db.collection("mail").add({
            to: sub.email,
            message: {
              subject,
              html,
              text
            },
            createdAt: now
          });
          queuedCount++;
        }

        return res.status(200).json({
          success: true,
          subscribersCount: activeSubscribers.length,
          emailsQueued: queuedCount,
          message: `Successfully queued ${queuedCount} role alert emails.`
        });
      } catch (error) {
        logger.error("Error in sendRoleAlertsDigest:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 5. sendFollowUpEmails (PAUSED PENDING APPROVAL - NO SCHEDULE EXECUTION)
// ===============================================================
const { onSchedule } = require("firebase-functions/v2/scheduler");

exports.sendFollowUpEmails = onSchedule("every 1 hours", async (event) => {
  logger.info("sendFollowUpEmails is paused pending review.");
  return;

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
      if (data.followUpSent) return;
      if (!data.email) return;

      const mailRef = db.collection("mail").doc();
      batch.set(mailRef, {
        to: data.email,
        message: {
          subject: "Did you finish your Mercor application?",
          html: `<p>Hi ${data.firstName || 'there'},</p>
                 <p>We noticed you started the process to join the AI Talent Network. Did you finish your application?</p>
                 <p>Here are the 3 steps people miss for proper routing to the high-paying roles:</p>
                 <ol>
                   <li>Complete the initial profile setup.</li>
                   <li>Take the 15-minute AI voice interview.</li>
                   <li>Make sure your resume is fully uploaded.</li>
                 </ol>
                 <p>You can resume your application here: <a href="https://trainaitogain.com/apply">https://trainaitogain.com/apply</a></p>
                 <p>Let us know if you need any help!</p>
                 <p>- The TrainAIToGain Team</p>
                 <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
                 <p style="font-size:12px; color:#999;">TrainAIToGain &bull; [Postal Address Pending] &bull; Independent Candidate Preparation Platform</p>`
        }
      });

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

// ===============================================================
// 6. setRoleReminder (Section 20.5 - Saves Real Role Reminder)
// ===============================================================
exports.setRoleReminder = onRequest(
  { cors: true, timeoutSeconds: 15, maxInstances: 10 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email, roleId, roleTitle, rolePay, linkTarget, platform, status } = req.body || {};
        if (!email || typeof email !== "string" || !email.includes("@") || email.length > 100) {
          return res.status(400).json({ error: "Valid email address is required" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";

        if (isRateLimited(`reminder_ip_${clientIp}`, 10, 10 * 60 * 1000) ||
            isRateLimited(`reminder_email_${cleanEmail}`, 10, 10 * 60 * 1000)) {
          return res.status(429).json({ error: "Rate limit exceeded. Please wait a few minutes." });
        }

        const db = admin.firestore();
        const subscriber = await getOrCreateSubscriber(db, cleanEmail, false);

        const safeRoleId = String(roleId || "unknown_role").substring(0, 80);
        const existing = await db.collection("reminders")
          .where("email", "==", cleanEmail)
          .where("roleId", "==", safeRoleId)
          .limit(1)
          .get();

        if (existing.empty) {
          // Schedule for 2 days from now (Section 20.5)
          const scheduledDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
          await db.collection("reminders").add({
            email: cleanEmail,
            unsubToken: subscriber.unsubToken,
            roleId: safeRoleId,
            roleTitle: String(roleTitle || "AI Specialist Role").substring(0, 120),
            rolePay: String(rolePay || "Competitive").substring(0, 60),
            linkTarget: String(linkTarget || "https://t.mercor.com").substring(0, 256),
            platform: String(platform || "Mercor").substring(0, 40),
            status: String(status || "Saved").substring(0, 40),
            scheduledFor: scheduledDate,
            sent: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }

        return res.status(200).json({ success: true, message: "Reminder scheduled successfully" });
      } catch (error) {
        logger.error("Error in setRoleReminder:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 7. processRoleReminders (Section 20.5 - Manual or Automated Trigger)
// ===============================================================
exports.processRoleReminders = onRequest(
  { cors: true, timeoutSeconds: 120, maxInstances: 1 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const authSecret = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") ||
          req.query.key ||
          req.body?.key;
        const EXPECTED_SECRET = process.env.ADMIN_SYNC_SECRET || "TRAINAITOGAIN_SYNC_SECURE_2026";

        if (!authSecret || authSecret !== EXPECTED_SECRET) {
          return res.status(401).json({ error: "Unauthorized: Invalid or missing sync secret key" });
        }

        const db = admin.firestore();
        const now = new Date();

        const remindersSnapshot = await db.collection("reminders")
          .where("sent", "==", false)
          .where("scheduledFor", "<=", now)
          .get();

        if (remindersSnapshot.empty) {
          return res.status(200).json({ success: true, count: 0, message: "No pending reminders ready to send." });
        }

        let sentCount = 0;
        for (const doc of remindersSnapshot.docs) {
          const r = doc.data();
          if (!r || !r.email) continue;

          // Test mode restriction: strictly send only to james.hardison2@gmail.com until postal address provided
          if (DIGEST_TEST_MODE && r.email.toLowerCase() !== APPROVED_TEST_RECIPIENT.toLowerCase()) {
            continue;
          }

          const subQuery = await db.collection("subscribers").where("email", "==", r.email).limit(1).get();
          if (!subQuery.empty && subQuery.docs[0].data().unsubscribed) {
            await doc.ref.update({ sent: true, cancelled: true, reason: "unsubscribed" });
            continue;
          }

          if (r.status === "Applied" || r.status === "Completed" || r.status === "Hired") {
            await doc.ref.update({ sent: true, cancelled: true, reason: "already_applied" });
            continue;
          }

          const unsubToken = r.unsubToken || generateToken();
          const unsubUrl = `https://trainaitogain.com/unsubscribe?token=${encodeURIComponent(unsubToken)}`;
          const subject = `Still interested in ${r.roleTitle}?`;
          const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f9fafb; margin:0; padding:24px; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">
    <tr>
      <td style="padding:24px 32px; background:#111827; text-align:center;">
        <span style="color:#ffffff; font-size:20px; font-weight:800; letter-spacing:-0.02em;">TrainAIToGain</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="font-size:20px; font-weight:800; color:#111827; margin:0 0 14px;">Still interested in ${escapeHtml(r.roleTitle)}?</h2>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 20px;">
          You saved <strong>${escapeHtml(r.roleTitle)}</strong> (${escapeHtml(r.rolePay)}) on TrainAIToGain.
        </p>
        <p style="color:#4b5563; font-size:15px; line-height:1.6; margin:0 0 24px;">
          If you&#39;re ready, you can apply directly:
        </p>
        <div style="margin-bottom:28px;">
          <a href="${r.linkTarget}" style="display:inline-block; background:#10b981; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; padding:12px 24px; border-radius:8px;">
            Apply on ${escapeHtml(r.platform || 'Platform')} ➔
          </a>
        </div>
        <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0 0 8px;">
          If you want to warm up first, try the free mock interview:
        </p>
        <p style="margin:0 0 24px;">
          <a href="https://trainaitogain.com/ai-interview" style="color:#059669; font-weight:700; text-decoration:underline;">https://trainaitogain.com/ai-interview</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center; font-size:12px; color:#6b7280; line-height:1.6;">
        <p style="margin:0 0 8px;">TrainAIToGain &bull; [Postal Address Pending] &bull; Independent Candidate Preparation Platform</p>
        <p style="margin:0;">
          <a href="${unsubUrl}" style="color:#6b7280; text-decoration:underline;">Unsubscribe</a> &bull; 
          <a href="https://trainaitogain.com/disclosure.html" style="color:#6b7280; text-decoration:underline;">Affiliate Disclosure</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

          const text = `Hi there,\n\nYou saved ${r.roleTitle} (${r.rolePay}) on TrainAIToGain. If you're ready, you can apply here: ${r.linkTarget}.\n\nIf you want to warm up first, try the free mock interview: https://trainaitogain.com/ai-interview.\n\nTrainAIToGain • [Postal Address Pending] • Independent Candidate Preparation Platform\nUnsubscribe: ${unsubUrl}`;

          await db.collection("mail").add({
            to: r.email,
            message: {
              subject,
              html,
              text
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          await doc.ref.update({
            sent: true,
            sentAt: admin.firestore.FieldValue.serverTimestamp()
          });
          sentCount++;
        }

        return res.status(200).json({
          success: true,
          count: sentCount,
          message: `Successfully processed ${sentCount} reminders.`
        });
      } catch (error) {
        logger.error("Error in processRoleReminders:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
      }
    });
  }
);

// ===============================================================
// 8. Scoreboard API (Section 21.4 - Weekly Scoreboard Persistence)
// ===============================================================
exports.getScoreboard = onRequest(
  { cors: true, timeoutSeconds: 15, maxInstances: 5 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        const db = admin.firestore();
        const snapshot = await db.collection("scoreboard").orderBy("weekStartDate", "desc").limit(12).get();
        const entries = [];
        snapshot.forEach(doc => entries.push({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, entries });
      } catch (error) {
        logger.error("Error in getScoreboard:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
);

exports.saveScoreboard = onRequest(
  { cors: true, timeoutSeconds: 15, maxInstances: 5 },
  (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
        const { weekStartDate, mercor, micro1, notes } = req.body || {};
        if (!weekStartDate) return res.status(400).json({ error: "weekStartDate is required" });

        const db = admin.firestore();
        const docRef = db.collection("scoreboard").doc(String(weekStartDate).substring(0, 20));
        await docRef.set({
          weekStartDate,
          mercor: mercor || {},
          micro1: micro1 || {},
          notes: notes || "",
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return res.json({ success: true, message: "Scoreboard saved successfully" });
      } catch (error) {
        logger.error("Error in saveScoreboard:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
);


