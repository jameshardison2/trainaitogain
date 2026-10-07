const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    console.log("Navigating to https://trainaitogain.com/apply.html ...");
    await page.goto('https://trainaitogain.com/apply.html', { waitUntil: 'networkidle0' });
    
    console.log("Waiting for job cards to render...");
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Evaluate the page content to find the links in the "Apply Now" buttons
    const jobs = await page.evaluate(() => {
        let buttons = Array.from(document.querySelectorAll('button'));
        let applyButtons = buttons.filter(b => b.innerText.includes('Apply Now') || (b.getAttribute('onclick') || '').includes('handleApplyClick'));
        
        return applyButtons.slice(0, 10).map(btn => {
            let container = btn.closest('.card, [style*="border-radius:12px"], [style*="border-radius: 12px"]') || btn.parentElement.parentElement;
            let titleEl = container.querySelector('h3');
            let title = titleEl ? titleEl.innerText : 'Unknown Title';
            let onclick = btn.getAttribute('onclick') || '';
            
            // Extract the URL from window.handleApplyClick('Title', 'URL', this)
            let match = onclick.match(/handleApplyClick\([^,]+,\s*'([^']+)'/);
            let link = match ? match[1] : 'Not Found';
            
            return { title, link };
        });
    });
    
    console.log("--- FRONTEND VERIFICATION ---");
    if (jobs.length === 0) {
        console.log("No apply buttons found!");
    } else {
        jobs.forEach((j, i) => {
            console.log(`Card ${i+1}: ${j.title}`);
            console.log(`Apply Link: ${j.link}`);
            console.log(j.link.includes('wbPMF') ? '⚠️ FALLBACK LINK' : '✅ UNIQUE REFERRAL LINK');
            console.log('---');
        });
    }
    
    await browser.close();
})();
