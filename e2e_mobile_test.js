const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Emulate iPhone 13
  await page.emulate(puppeteer.KnownDevices['iPhone 13']);
  
  // Intercept network requests to mock the getJobsData API since the DB is empty
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('getJobsData')) {
      request.respond({
        content: 'application/json',
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify({
          lastUpdated: new Date().toISOString(),
          roles: [
            {
              id: "mercor-test",
              title: "Senior AI Engineer (Mock Test)",
              domain: "SOFTWARE",
              pay: "$120/hr",
              status: "ACTIVE",
              description: "Test description",
              tags: ["Remote"],
              linkTarget: "https://t.mercor.com/wbPMF"
            }
          ]
        })
      });
    } else {
      request.continue();
    }
  });

  // Since we are running locally, we need a local server.
  // We can just load the file directly if cors allows, but fetch to relative or absolute?
  // render_waves.ts fetches 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData'
  // So opening the local file file://.../apply.html will work!
  
  await page.goto('file://' + __dirname + '/apply.html', { waitUntil: 'networkidle0' });
  
  // Wait for cards to render
  await page.waitForSelector('.opp-card');
  
  // Check the footer buttons
  const buttons = await page.$$eval('.opp-card button', btns => btns.map(b => b.innerText));
  console.log("Buttons found in card:", buttons);
  
  // Click the Apply Now button
  const applyBtn = await page.$('.opp-card button');
  if (applyBtn) {
      const box = await applyBtn.boundingBox();
      console.log("Apply Now Button Box:", box);
      if (box.width > 200 && box.height > 40) {
          console.log("✅ Touch target is expanded and mobile-friendly!");
      } else {
          console.log("❌ Touch target is too small:", box);
      }
      await applyBtn.click();
      console.log("✅ Apply Now clicked successfully.");
  }

  // Check telemetry (gtag)
  // We can evaluate if gtag was called
  const gtagCalls = await page.evaluate(() => {
      // It's pushed to dataLayer
      return window.dataLayer || [];
  });
  const applyEvents = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'apply_click');
  console.log("Telemetry events fired:", applyEvents.length);
  if (applyEvents.length > 0) {
      console.log("✅ Telemetry tracking confirmed.");
  }

  await browser.close();
})();
