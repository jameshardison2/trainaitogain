const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching headless browser to bypass Cloudflare...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  let allJobs = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('jobs?page=') && url.includes('micro1.ai/')) {
      try {
        const json = await response.json();
        if (json && json.data) {
            console.log(`Intercepted Micro1 API Response: ${json.data.length} jobs found.`);
            allJobs.push(...json.data);
        }
      } catch (e) {
        // ignore
      }
    }
  });

  const url = 'https://refer.micro1.ai/referral/jobs/?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe';
  console.log("Navigating to dashboard to trigger API load...");
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log("Scrolling to load all pages...");
  let lastHeight = await page.evaluate('document.body.scrollHeight');
  for (let i = 0; i < 20; i++) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(r => setTimeout(r, 1000));
    let newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === lastHeight) {
        // Try waiting a bit more for network
        await new Promise(r => setTimeout(r, 2000));
        let newerHeight = await page.evaluate('document.body.scrollHeight');
        if (newerHeight === newHeight) break;
    }
    lastHeight = newHeight;
  }

  await browser.close();

  if (allJobs.length === 0) {
    console.error("Failed to fetch Micro1 jobs.");
    process.exit(1);
  }

  let formattedJobs = [];

  for (const apiJob of allJobs) {
    let title = apiJob.job_name;
    
    // Pay formatting
    let minPay = apiJob.ideal_hourly_rate ? apiJob.ideal_hourly_rate.min : 0;
    let maxPay = apiJob.ideal_hourly_rate ? apiJob.ideal_hourly_rate.max : 0;
    let payStr = maxPay ? `$${minPay} - $${maxPay} / hour` : "Competitive";

    let rawDesc = apiJob.skills ? "Skills required: " + apiJob.skills.join(", ") : "No description provided.";
    let cleanDesc = rawDesc;
    
    let tags = ["Remote"];
    if (apiJob.work_location === "1") tags.push("US Only");

    let defaultUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
    let linkTarget = apiJob.apply_url ? apiJob.apply_url : defaultUrl;
    linkTarget = linkTarget.replace("?ref=", "&ref=");
    
    formattedJobs.push({
        title: title,
        pay: payStr,
        description: cleanDesc.substring(0, 350) + "...",
        tags: tags,
        platform: 'Micro1',
        linkTarget: linkTarget
    });
  }

  // Deduplicate just in case
  const uniqueJobsMap = new Map();
  for (const j of formattedJobs) {
      uniqueJobsMap.set(j.title, j);
  }
  const uniqueJobs = Array.from(uniqueJobsMap.values());

  console.log(`Formatted ${uniqueJobs.length} unique Micro1 jobs. POSTing to Firebase Cloud Function...`);

  // Send to Cloud Function using dynamic import for node-fetch if needed, 
  // but Node 24 has native fetch.
  const res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: uniqueJobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
  });

  if (res.ok) {
      console.log("✅ Successfully synced Micro1 jobs to Firebase!");
  } else {
      console.error("❌ Failed to sync to Firebase:", await res.text());
  }
})();
