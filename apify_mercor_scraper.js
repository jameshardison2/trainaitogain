// Apify PlaywrightCrawler Script for Mercor Jobs
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 50,
    headless: true,
    async requestHandler({ page, request, log }) {
        log.info(`Processing ${request.url}...`);
        
        // Wait for the jobs container to render
        await page.waitForSelector('.job-card, .MuiCard-root', { timeout: 15000 }).catch(() => log.warning('Timeout waiting for cards'));
        
        // Scroll to the bottom to trigger infinite scroll/lazy loading
        let previousHeight = 0;
        for (let i = 0; i < 20; i++) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForTimeout(1500);
            let newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === previousHeight) break; // Reached bottom
        }

        // Extract job data
        const jobs = await page.evaluate(() => {
            const results = [];
            // Generic fallback selectors since Mercor obfuscates class names
            const cards = document.querySelectorAll('a[href*="/offer/"], a[href*="/jobs/"]');
            
            cards.forEach(card => {
                const titleEl = card.querySelector('h3, h2, .title');
                if (!titleEl) return;
                
                const title = titleEl.innerText.trim();
                const applicationUrl = card.href;
                
                // Extract pay if visible (often contains '$' or 'USD')
                const text = card.innerText;
                let rateMin = 0, rateMax = 0;
                const payMatch = text.match(/\$(\d+)\s*-\s*\$(\d+)/);
                if (payMatch) {
                    rateMin = parseInt(payMatch[1]);
                    rateMax = parseInt(payMatch[2]);
                } else {
                    const singlePay = text.match(/\$(\d+)\/hr/);
                    if (singlePay) {
                        rateMin = parseInt(singlePay[1]);
                        rateMax = parseInt(singlePay[1]);
                    }
                }

                results.push({
                    title,
                    applicationUrl,
                    rateMin,
                    rateMax,
                    descriptionText: `Mercor is currently hiring for ${title}.`,
                    status: 'ACTIVE'
                });
            });
            return results;
        });

        log.info(`Found ${jobs.length} jobs!`);
        await Dataset.pushData(jobs);
    },
});

await crawler.run(['https://work.mercor.com/jobs', 'https://mercor.com/jobs']);
