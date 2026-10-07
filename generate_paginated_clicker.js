const fs = require('fs');

const rawJs = `
(async function() {
    alert('TrainAIToGain Deep Sync + Pagination Started! Please DO NOT touch your mouse. We are going to scan every page and click every job...');
    
    let allJobs = [];
    let pageNum = 1;
    
    while (true) {
        console.log("Scanning Page " + pageNum + "...");
        
        // Wait for page to be fully loaded
        await new Promise(r => setTimeout(r, 1500));
        
        // Scroll slightly to ensure cards are rendered if lazy loaded
        window.scrollBy(0, 500);
        await new Promise(r => setTimeout(r, 500));
        window.scrollTo(0, 0);
        
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
        
        console.log("Found " + cards.length + " jobs on Page " + pageNum);
        
        for (let i = 0; i < cards.length; i++) {
            let currentCard = cards[i];
            currentCard.element.scrollIntoView({behavior: "smooth", block: "center"});
            await new Promise(r => setTimeout(r, 500));
            
            currentCard.element.click();
            await new Promise(r => setTimeout(r, 1500)); // wait for modal
            
            let linkEls = Array.from(document.querySelectorAll('a, button, div, span, p')).filter(el => el.innerText && el.innerText.includes('https://t.mercor.com/'));
            let linkTarget = 'https://t.mercor.com/wbPMF';
            if (linkEls.length > 0) {
                let match = linkEls[0].innerText.match(/(https:\\/\\/t\\.mercor\\.com\\/[a-zA-Z0-9]+)/);
                if (match) linkTarget = match[1];
            } else {
                let hrefs = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('t.mercor.com/'));
                if (hrefs.length > 0) linkTarget = hrefs[hrefs.length - 1].href;
            }
            
            let description = currentCard.element.innerText || '';
            let modal = document.querySelector('[role="dialog"]') || document.querySelector('[class*="modal"]') || document.querySelector('[class*="drawer"]');
            if (modal) description = modal.innerText;
            let tagsMatch = description.match(/(Remote|Onsite|Hybrid|US Only|India|LatAm)/ig) || ['Remote'];
            
            allJobs.push({
                title: currentCard.title,
                pay: currentCard.pay,
                description: description.substring(0, 350).replace(/\\n/g, ' ') + '...',
                tags: [...new Set(tagsMatch)],
                linkTarget: linkTarget,
                platform: 'Mercor'
            });
            
            console.log("Grabbed: " + currentCard.title + " -> " + linkTarget);
            
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape', 'keyCode': 27, 'which': 27, 'bubbles': true}));
            await new Promise(r => setTimeout(r, 300));
            let closeBtn = document.querySelector('[aria-label="Close"], .close, [class*="close"]');
            if (closeBtn) closeBtn.click();
            document.body.click();
            await new Promise(r => setTimeout(r, 500));
        }
        
        // Find Next Button
        let nextBtn = Array.from(document.querySelectorAll('button, a')).find(el => {
            let t = (el.innerText || '').trim();
            return (t === 'Next' || t === 'Next >' || t === 'Next>') && !el.disabled && el.getAttribute('aria-disabled') !== 'true';
        });
        
        if (!nextBtn) {
            nextBtn = Array.from(document.querySelectorAll('div, span, li')).find(el => {
                let t = (el.innerText || '').trim();
                return (t === 'Next' || t === 'Next >' || t === 'Next>') && window.getComputedStyle(el).cursor === 'pointer';
            });
        }
        
        if (!nextBtn) {
            console.log("No Next button found. Finished all pages!");
            break;
        }
        
        console.log("Clicking Next...");
        nextBtn.scrollIntoView({behavior: "smooth", block: "center"});
        await new Promise(r => setTimeout(r, 300));
        nextBtn.click();
        pageNum++;
    }
    
    // Deduplicate
    let uniqueMap = new Map();
    for (let j of allJobs) {
        uniqueMap.set(j.title, j);
    }
    let uniqueJobs = Array.from(uniqueMap.values());
    
    if(uniqueJobs.length === 0) {
        alert('Could not find any jobs to sync!');
        return;
    }
    
    // Send to server
    try {
        let res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobs: uniqueJobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
        });
        if(res.ok) {
            alert(\`✅ Deep Sync Complete! Synced \${uniqueJobs.length} jobs with exact referral links across \${pageNum} pages!\`);
        } else {
            alert('❌ Error syncing jobs. Check your console.');
        }
    } catch(e) {
        alert('❌ Network error syncing jobs.');
    }
})();
`;

const bookmarklet = 'javascript:' + encodeURIComponent(rawJs.replace(/\\n\\s*/g, ''));
fs.writeFileSync('bookmarklet_v4.txt', bookmarklet);
console.log("Created bookmarklet_v4.txt");
