const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://work.mercor.com/jobs');
  await page.waitForTimeout(5000); // Wait for hydration
  const html = await page.content();
  console.log(html.substring(0, 2000));
  const links = await page.$$eval('a', as => as.map(a => a.href));
  console.log("Found links:", links.filter(l => l.includes('offer') || l.includes('jobs')).length);
  await browser.close();
})();
