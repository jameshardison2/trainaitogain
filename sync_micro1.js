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
      try {
        const json = await response.json();
        console.log(`Intercepted Micro1 API Response: ${json.data.length} jobs found.`);
        jobsData = json.data;
      } catch (e) {
        console.error("Failed to parse intercepted JSON", e);
      }
    }
  });

  const url = 'https://refer.micro1.ai/referral/jobs/?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral';
  console.log("Navigating to dashboard to trigger API load...");
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  
  if (!jobsData) {
    console.log("Waiting a bit longer for API request...");
    await new Promise(r => setTimeout(r, 5000));
  }

  await browser.close();

  if (!jobsData || jobsData.length === 0) {
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
  const topJobs = jobsData;
  
  let newMicro1Jobs = topJobs.map(job => {
    let minPay = job.ideal_hourly_rate ? job.ideal_hourly_rate.min : 0;
    let maxPay = job.ideal_hourly_rate ? job.ideal_hourly_rate.max : 0;
    let payStr = maxPay ? `$${minPay}-$${maxPay}/hr` : "Competitive";
    
    let defaultUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
    let linkTarget = job.apply_url ? job.apply_url : defaultUrl;
    
    // Fix ?ref= bug for safe tracking
    linkTarget = linkTarget.replace("?ref=", "&ref=");

    return {
      "id": `micro1-${job.job_id}`,
      "title": job.job_name,
      "domain": job.job_name.toLowerCase().includes("software") ? "SOFTWARE" : "GENERAL",
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
