const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('jobs?page=') && url.includes('micro1.ai/')) {
      try {
        const json = await response.json();
        if (json && json.data && json.data.length > 0) {
            console.log(JSON.stringify(json.data[0], null, 2));
            process.exit(0);
        }
      } catch (e) { }
    }
  });
  await page.goto('https://refer.micro1.ai/referral/jobs/?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe');
})();
