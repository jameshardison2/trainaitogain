const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://work.mercor.com/jobs', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 5000));
  const html = await page.content();
  console.log("HTML snippet:", html.substring(0, 1000));
  const links = await page.$$eval('a', as => as.map(a => a.href));
  console.log("Links found:", links.length);
  console.log("Link samples:", links.slice(0, 5));
  await page.screenshot({ path: 'mercor_screenshot.png' });
  await browser.close();
})();
