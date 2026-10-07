const puppeteer = require('puppeteer');
// const fetch = require('node-fetch'); // we can use native fetch on node 20, but this is run locally so let's check node version.
// The user is on Mac. Node is available. 

(async () => {
  console.log("Launching headless browser to bypass Cloudflare...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  let jobsData = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('jobs?page=') && url.includes('micro1.ai/api/v1/job/portal/referral/')) {
      try {
        const json = await response.json();
        console.log(`Intercepted Micro1 API Response: ${json.data.length} jobs found.`);
        jobsData = json.data;
      } catch (e) {
        // ignore
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
    console.error("Failed to fetch Micro1 jobs.");
    process.exit(1);
  }

  let formattedJobs = [];

  for (const apiJob of jobsData) {
    let title = apiJob.title;
    
    // Pay formatting
    let payStr = "Competitive";
    if (apiJob.min_compensation && apiJob.max_compensation) {
        if (apiJob.min_compensation < 200) {
            payStr = `$${apiJob.min_compensation} - $${apiJob.max_compensation} / hour`;
        } else {
            payStr = `$${(apiJob.min_compensation/1000).toFixed(0)}k - $${(apiJob.max_compensation/1000).toFixed(0)}k / year`;
        }
    } else if (apiJob.min_compensation) {
        payStr = apiJob.min_compensation < 200 ? `$${apiJob.min_compensation} / hour` : `$${(apiJob.min_compensation/1000).toFixed(0)}k / year`;
    }

    let rawDesc = apiJob.description || "";
    let cleanDesc = rawDesc.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    
    let tags = ["Remote"];
    if (apiJob.work_location === "1") tags.push("US Only");

    formattedJobs.push({
        title: title,
        pay: payStr,
        description: cleanDesc.substring(0, 350) + "...",
        tags: tags,
        // The Cloud Function will automatically map the domain
    });
  }

  console.log(`Formatted ${formattedJobs.length} Micro1 jobs. POSTing to Firebase Cloud Function...`);

  // Send to Cloud Function
  const res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: formattedJobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
  });

  if (res.ok) {
      console.log("✅ Successfully synced Micro1 jobs to Firebase!");
  } else {
      console.error("❌ Failed to sync to Firebase:", await res.text());
  }
})();
