const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    console.log("Navigating to https://trainaitogain.com/apply.html ...");
    await page.goto('https://trainaitogain.com/apply.html', { waitUntil: 'networkidle0' });
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });
    
    const content = await page.evaluate(() => {
        return {
            bodyHtml: document.body.innerHTML.substring(0, 500),
            visibleCards: document.querySelectorAll('.opp-card[style*="display: flex"]').length,
            totalCards: document.querySelectorAll('.opp-card').length,
            hasError: document.querySelector('#no-results-msg') ? true : false,
            awsDetails: !!document.querySelector('#aws-resume-matcher')
        };
    });
    
    console.log("Page Content Info:", content);
    
    await browser.close();
})();
