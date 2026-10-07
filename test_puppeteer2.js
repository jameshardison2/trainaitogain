const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://work.mercor.com/jobs', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 5000));
  
  // Dump all text content of all divs on the page that might look like cards
  const cards = await page.$$eval('div', divs => {
    return divs
      .filter(d => d.innerText && d.innerText.includes('$') && d.innerText.includes('hour'))
      .map(d => ({ className: d.className, html: d.innerHTML, text: d.innerText }));
  });
  
  console.log("Cards found:", cards.length);
  if(cards.length > 0) {
      console.log("Sample card class:", cards[cards.length-1].className);
      console.log("Sample card html:", cards[cards.length-1].html.substring(0, 500));
  }
  await browser.close();
})();
