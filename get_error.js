const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('dialog', async dialog => {
    console.log("DIALOG OPENED:", dialog.message());
    await dialog.accept();
  });
  
  await page.goto('https://trainaitogain-50c19.web.app/dashboard.html?ref=admin_all', {waitUntil: 'networkidle2'});
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
