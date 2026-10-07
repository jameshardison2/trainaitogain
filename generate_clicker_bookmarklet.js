const fs = require('fs');

const rawJs = `
(async function() {
    alert('TrainAIToGain Deep Sync Started! Please do not touch your mouse. We are going to click through every job to harvest the exact referral links...');
    
    // 1. Scroll to load all jobs
    let lastHeight = 0;
    while(true) {
        window.scrollBy(0, 1500);
        await new Promise(r => setTimeout(r, 800));
        let newHeight = document.body.scrollHeight;
        if(newHeight === lastHeight) break;
        lastHeight = newHeight;
    }
    window.scrollTo(0,0);
    await new Promise(r => setTimeout(r, 1000));
    
    // 2. Find all job cards by looking for the pay string
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const payRegex = /\\$(\\d+)\\s*(?:-\\s*\\$(\\d+))?\\s*\\/\\s*(hour|hr|month|mo|year|yr)/i;
    let processedNodes = new Set();
    let cards = [];
    
    while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text.match(payRegex)) {
            let container = node.parentElement;
            let card = container.closest('div');
            for(let i=0; i<3; i++) {
                if(card && card.parentElement) card = card.parentElement;
            }
            if(!card || processedNodes.has(card)) continue;
            processedNodes.add(card);
            
            let titleNode = card.querySelector('h1, h2, h3, h4, strong') || card;
            let title = titleNode.innerText ? titleNode.innerText.split('\\n')[0] : 'Unknown Title';
            if(title.includes('$')) {
                title = card.innerText.split('\\n')[0];
            }
            
            cards.push({ element: card, title: title.trim(), pay: text });
        }
    }
    
    if(cards.length === 0) {
        alert('Could not find any jobs. Make sure you are on the Jobs tab.');
        return;
    }
    
    console.log("Found " + cards.length + " jobs to process.");
    let jobs = [];
    
    // 3. Click through each card
    for (let i = 0; i < cards.length; i++) {
        let currentCard = cards[i];
        
        // Ensure it's in view
        currentCard.element.scrollIntoView({behavior: "smooth", block: "center"});
        await new Promise(r => setTimeout(r, 500));
        
        // Click it!
        currentCard.element.click();
        
        // Wait for modal to render
        await new Promise(r => setTimeout(r, 1200));
        
        // Scrape modal
        // Find the referral link
        let linkEls = Array.from(document.querySelectorAll('a, button, div')).filter(el => el.innerText && el.innerText.includes('https://t.mercor.com/'));
        let linkTarget = 'https://t.mercor.com/wbPMF'; // fallback
        
        if (linkEls.length > 0) {
            let text = linkEls[0].innerText;
            let match = text.match(/(https:\\/\\/t\\.mercor\\.com\\/[a-zA-Z0-9]+)/);
            if (match) {
                linkTarget = match[1];
            }
        } else {
            // Check hrefs directly just in case
            let hrefs = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('t.mercor.com/'));
            if (hrefs.length > 0) {
                linkTarget = hrefs[hrefs.length - 1].href;
            }
        }
        
        // Fallback description from card if modal description is hard to isolate
        let description = currentCard.element.innerText || '';
        // Try to get modal text
        let modal = document.querySelector('[role="dialog"]') || document.querySelector('[class*="modal"]') || document.querySelector('[class*="drawer"]');
        if (modal) {
            description = modal.innerText;
        }
        
        let tagsMatch = description.match(/(Remote|Onsite|Hybrid|US Only|India|LatAm)/ig) || ['Remote'];
        
        jobs.push({
            title: currentCard.title,
            pay: currentCard.pay,
            description: description.substring(0, 350).replace(/\\n/g, ' ') + '...',
            tags: [...new Set(tagsMatch)],
            linkTarget: linkTarget,
            platform: 'Mercor'
        });
        
        console.log("Processed " + (i+1) + "/" + cards.length + ": " + currentCard.title + " -> " + linkTarget);
        
        // Close modal
        // Press Escape
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape', 'keyCode': 27, 'which': 27, 'bubbles': true}));
        await new Promise(r => setTimeout(r, 300));
        
        // If Escape didn't work, look for a close button or click backdrop
        let closeBtn = document.querySelector('[aria-label="Close"], .close, [class*="close"]');
        if (closeBtn) closeBtn.click();
        
        // Click outside the modal just in case
        document.body.click();
        
        await new Promise(r => setTimeout(r, 500));
    }
    
    // 4. Send to server
    try {
        let res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobs: jobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
        });
        if(res.ok) {
            alert(\`✅ Deep Sync Complete! Synced \${jobs.length} jobs with exact referral links to TrainAIToGain.\`);
        } else {
            alert('❌ Error syncing jobs. Check your console.');
        }
    } catch(e) {
        alert('❌ Network error syncing jobs.');
    }
})();
`;

// URI encode the script
const bookmarklet = 'javascript:' + encodeURIComponent(rawJs.replace(/\\n\\s*/g, ''));
fs.writeFileSync('bookmarklet_v3.txt', bookmarklet);
console.log("Created bookmarklet_v3.txt");
