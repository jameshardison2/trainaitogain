const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    console.log("Navigating to https://trainaitogain.com/apply.html ...");
    await page.goto('https://trainaitogain.com/apply.html', { waitUntil: 'networkidle0' });
    
    console.log("Waiting for filter UI to render...");
    await page.waitForSelector('#jobSearchInput', { timeout: 10000 });
    
    console.log("Typing 'Software' in search...");
    await page.type('#jobSearchInput', 'Software');
    
    // Check if the DOM updated
    const visibleCards = await page.evaluate(() => {
        let cards = document.querySelectorAll('.opp-card[style*="display: flex"]');
        return cards.length;
    });
    
    console.log("Visible cards after search:", visibleCards);
    
    console.log("Testing location filter 'US'...");
    await page.select('#locationFilter', 'US');
    const usCards = await page.evaluate(() => {
        return document.querySelectorAll('.opp-card[style*="display: flex"]').length;
    });
    console.log("Visible cards after US filter:", usCards);
    
    console.log("Testing location filter 'INTL' (Global)...");
    await page.select('#locationFilter', 'INTL');
    const intlCards = await page.evaluate(() => {
        return document.querySelectorAll('.opp-card[style*="display: flex"]').length;
    });
    console.log("Visible cards after INTL filter:", intlCards);
    
    // Clear search and test category
    await page.evaluate(() => {
        document.getElementById('jobSearchInput').value = '';
        window.applyJobFilters();
    });
    
    console.log("Testing Category 'MEDICAL'...");
    await page.select('#categoryFilter', 'MEDICAL');
    const medCards = await page.evaluate(() => {
        return document.querySelectorAll('.opp-card[style*="display: flex"]').length;
    });
    console.log("Visible cards after MEDICAL filter:", medCards);
    
    await browser.close();
})();
