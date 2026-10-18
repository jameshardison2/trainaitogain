const fs = require('fs');
const path = require('path');

async function fetchAllMicro1Jobs() {
  console.log("Fetching live Micro1 jobs from direct API...");
  let combined = [];
  const referralCode = "05216c9f-87cc-49af-b448-f9f8a18d2efe";
  
  for (let page = 1; page <= 30; page++) {
    try {
      const url = `https://prod-api.micro1.ai/api/v1/job/portal/referral/${referralCode}/jobs?page=${page}&limit=50`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        console.warn(`Page ${page} responded with HTTP ${res.status}`);
        break;
      }
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        combined.push(...json.data);
        console.log(`Fetched page ${page}: ${json.data.length} jobs (total: ${combined.length} / ${json.total || 'unknown'})`);
        if (json.total && combined.length >= json.total) break;
      } else {
        break;
      }
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err.message);
      break;
    }
  }
  return combined;
}

(async () => {
  const finalJobs = await fetchAllMicro1Jobs();

  if (!finalJobs || finalJobs.length === 0) {
    console.error("Failed to fetch jobs from Micro1 API.");
    process.exit(1);
  }

  console.log(`Total live Micro1 jobs retrieved: ${finalJobs.length}`);
  console.log("Reading existing waves.json...");
  let wavesPath = path.join(__dirname, "waves.json");
  let wavesRaw = fs.readFileSync(wavesPath, 'utf-8');
  let waves = JSON.parse(wavesRaw);

  // Filter out existing Micro1 jobs
  waves.roles = waves.roles.filter(r => !r.id.startsWith("micro1-") && r.platform !== "Micro1");

  let newMicro1Jobs = finalJobs.map(job => {
    let minPay = job.ideal_hourly_rate ? job.ideal_hourly_rate.min : 0;
    let maxPay = job.ideal_hourly_rate ? job.ideal_hourly_rate.max : 0;
    let payStr = "Competitive";
    if (maxPay > 0) {
      if (maxPay <= 300) {
        payStr = minPay ? `$${minPay}-$${maxPay}/hr` : `$${maxPay}/hr`;
      } else if (maxPay >= 15000 && maxPay <= 600000) {
        // Annual compensation (e.g. 250,000 -> $250k)
        let minK = minPay ? Math.round(minPay / 1000) : 0;
        let maxK = Math.round(maxPay / 1000);
        payStr = minK ? `$${minK}k–$${maxK}k/yr` : `$${maxK}k/yr`;
      } else {
        payStr = "Competitive";
      }
    }
    
    let defaultUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
    let linkTarget = job.apply_url ? job.apply_url : defaultUrl;
    
    // Fix ?ref= bug for safe tracking
    linkTarget = linkTarget.replace("?ref=", "&ref=");

    const titleLower = (job.job_name || '').toLowerCase();
    let domain = "GENERAL";
    if (titleLower.includes("software") || titleLower.includes("engineer") || titleLower.includes("developer") || titleLower.includes("data") || titleLower.includes("security") || titleLower.includes("tech") || titleLower.includes("cloud") || titleLower.includes("ai agent") || titleLower.includes("tester")) {
      domain = "SOFTWARE";
    } else if (titleLower.includes("medical") || titleLower.includes("medicine") || titleLower.includes("hospitalist") || titleLower.includes("physician") || titleLower.includes("clinician") || titleLower.includes("epidemiologist") || titleLower.includes("health") || titleLower.includes("pharma") || titleLower.includes("psychiatrist") || titleLower.includes("dermatologist") || titleLower.includes("clinical")) {
      domain = "MEDICAL";
    } else if (titleLower.includes("legal") || titleLower.includes("lawyer") || titleLower.includes("counsel") || titleLower.includes("paralegal")) {
      domain = "LEGAL";
    } else if (titleLower.includes("finance") || titleLower.includes("financial") || titleLower.includes("equity") || titleLower.includes("investment") || titleLower.includes("revenue") || titleLower.includes("trader") || titleLower.includes("quant") || titleLower.includes("accounting") || titleLower.includes("rates")) {
      domain = "FINANCE";
    }

    return {
      "id": `micro1-${job.job_id}`,
      "title": (job.job_name || '').trim(),
      "domain": domain,
      "pay": payStr,
      "status": "ACTIVE",
      "badgeClass": "blue",
      "description": `Micro1 is aggressively hiring ${job.no_of_openings || '1'}+ candidates for this role. Top-tier candidates will pass the AI interview to proceed.`,
      "atsKeywords": job.skills ? job.skills.slice(0, 8) : [],
      "tags": ["Remote", "Micro1"],
      "platform": "Micro1",
      "linkTarget": linkTarget
    };
  });

  waves.roles.push(...newMicro1Jobs);

  // Update meta sync timestamp
  if (!waves.meta) waves.meta = {};
  waves.meta.syncedAt = new Date().toISOString();
  waves.meta.totalRoles = waves.roles.length;

  fs.writeFileSync(wavesPath, JSON.stringify(waves, null, 2));
  console.log(`Successfully merged ${newMicro1Jobs.length} live Micro1 jobs into waves.json!`);
})();
