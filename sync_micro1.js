const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Launching headless browser to bypass Cloudflare...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  let jobsData = null;

  // Intercept network requests to snag the hidden API response
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('jobs?page=') && url.includes('micro1.ai/api/v1/job/portal/referral/')) {
      console.log("Intercepted URL:", url);
      try {
        const json = await response.json();
        console.log(`Intercepted Micro1 API Response: ${json.data ? json.data.length : 'unknown'} jobs found. Keys: ${Object.keys(json).join(', ')}`);
        if (json.meta) console.log("Meta:", JSON.stringify(json.meta));
        if (json.pagination) console.log("Pagination:", JSON.stringify(json.pagination));
        if (json.total) console.log("Total:", json.total);
        jobsData = json.data || json;
      } catch (e) {
        console.error("Failed to parse intercepted JSON", e);
      }
    }
  });

  const url = 'https://refer.micro1.ai/referral/jobs/?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral';
  console.log("Navigating to dashboard to trigger API load...");
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  let finalJobs = [];
  try {
    const allJobs = await page.evaluate(async () => {
      let combined = [];
      for (let p = 1; p <= 20; p++) {
        try {
          const res = await fetch(`https://prod-api.micro1.ai/api/v1/job/portal/referral/05216c9f-87cc-49af-b448-f9f8a18d2efe/jobs?page=${p}&limit=12`);
          const json = await res.json();
          if (json && json.data && json.data.length > 0) {
            combined.push(...json.data);
          } else {
            break;
          }
        } catch (e) {
          break;
        }
      }
      return combined;
    });
    if (allJobs && allJobs.length > 0) {
      finalJobs = allJobs;
      console.log(`Fetched total ${finalJobs.length} Micro1 jobs across pages.`);
    }
  } catch (err) {
    console.error("Multi-page fetch error:", err);
  }

  if (finalJobs.length === 0 && jobsData) {
    finalJobs = jobsData;
  }

  await browser.close();

  if (!finalJobs || finalJobs.length === 0) {
    console.error("Failed to fetch jobs via Puppeteer.");
    process.exit(1);
  }

  console.log("Reading existing waves.json...");
  let wavesPath = path.join(__dirname, "waves.json");
  let wavesRaw = fs.readFileSync(wavesPath, 'utf-8');
  let waves = JSON.parse(wavesRaw);

  // Filter out existing Micro1 jobs
  waves.roles = waves.roles.filter(r => !r.id.startsWith("micro1-") && r.platform !== "Micro1");

  // Take all jobs to inject
  const topJobs = finalJobs;
  
  let newMicro1Jobs = topJobs.map(job => {
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

    const titleLower = job.job_name.toLowerCase();
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
      "title": job.job_name.trim(),
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

  fs.writeFileSync(wavesPath, JSON.stringify(waves, null, 2));
  console.log(`Successfully merged ${newMicro1Jobs.length} live Micro1 jobs into waves.json!`);

})();
