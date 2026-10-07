const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://trainaitogain.com/apply.html', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'grid_screenshot.png', fullPage: true });
    
    // Check if grid is implemented
    const isGrid = await page.evaluate(() => {
        const softwareContainer = document.getElementById('carousel-software');
        return softwareContainer ? window.getComputedStyle(softwareContainer).display : 'Not Found';
    });
    console.log("Container Display:", isGrid);
    await browser.close();
})();
