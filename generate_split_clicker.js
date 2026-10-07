const fs = require('fs');

const rawJs = `
(async function() {
    alert('TrainAIToGain Deep Sync V5 Started! Please DO NOT touch your mouse. Scanning all pages...');
    
    let allJobs = [];
    let pageNum = 1;
    let maxPages = 40;
    
    while (pageNum <= maxPages) {
        console.log("Scanning Page " + pageNum + "...");
        await new Promise(r => setTimeout(r, 2000));
        
        // Find all cards on this page
        let cards = Array.from(document.querySelectorAll('div, a, li')).filter(el => {
            let style = window.getComputedStyle(el);
            if (style.cursor !== 'pointer') return false;
            let rect = el.getBoundingClientRect();
            if (rect.width < 200 || rect.width > 600) return false;
            if (rect.height < 50 || rect.height > 400) return false;
            
            let titleEl = el.querySelector('h1, h2, h3, h4, strong');
            if (!titleEl) {
                let text = el.innerText || '';
                if (!text.match(/\\$|\\d+ hired|New opportunity/i)) return false;
            }
            return true;
        });
        
        // Deduplicate nesting (keep outermost)
        cards = cards.filter(c => !cards.some(other => other !== c && other.contains(c)));
        
        let actualCards = [];
        for (let c of cards) {
            let titleNode = c.querySelector('h1, h2, h3, h4, strong') || c;
            let title = (titleNode.innerText || '').split('\\n')[0].trim();
            if (title.includes('$')) title = (c.innerText || '').split('\\n')[0].trim();
            if (!title) continue;
            
            let payMatch = (c.innerText || '').match(/\\$(\\d+)\\s*(?:-\\s*\\$(\\d+))?\\s*\\/\\s*(hour|hr|month|mo|year|yr)/i);
            let pay = payMatch ? payMatch[0] : 'Competitive';
            
            actualCards.push({ element: c, title: title, pay: pay });
        }
        
        console.log("Found " + actualCards.length + " jobs on Page " + pageNum);
        
        for (let i = 0; i < actualCards.length; i++) {
            let currentCard = actualCards[i];
            
            currentCard.element.scrollIntoView({behavior: "smooth", block: "center"});
            await new Promise(r => setTimeout(r, 500));
            
            // Safe click top-left to avoid "1-click apply" buttons
            let rect = currentCard.element.getBoundingClientRect();
            currentCard.element.dispatchEvent(new MouseEvent('click', {
                view: window, bubbles: true, cancelable: true, 
                clientX: rect.left + 15, clientY: rect.top + 15
            }));
            
            // Fallback click if dispatch doesn't trigger React Router
            try { currentCard.element.click(); } catch(e){}
            
            await new Promise(r => setTimeout(r, 1800)); // wait for right pane
            
            // Extract link
            let linkEls = Array.from(document.querySelectorAll('a, button, div, span, p')).filter(el => el.innerText && el.innerText.includes('https://t.mercor.com/'));
            let linkTarget = 'https://t.mercor.com/wbPMF';
            if (linkEls.length > 0) {
                linkEls.sort((a,b) => a.innerText.length - b.innerText.length);
                let match = linkEls[0].innerText.match(/(https:\\/\\/t\\.mercor\\.com\\/[a-zA-Z0-9]+)/);
                if (match) linkTarget = match[1];
            } else {
                let hrefs = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('t.mercor.com/'));
                if (hrefs.length > 0) linkTarget = hrefs[hrefs.length - 1].href;
            }
            
            // Extract description
            let description = currentCard.element.innerText || '';
            let rightPanes = Array.from(document.querySelectorAll('div')).filter(el => {
                let r = el.getBoundingClientRect();
                return r.width > 400 && r.left > window.innerWidth / 2 && el.innerText.includes('About the work');
            });
            if (rightPanes.length > 0) {
                rightPanes.sort((a,b) => a.innerText.length - b.innerText.length);
                description = rightPanes[0].innerText;
            } else {
                let anyModal = document.querySelector('[role="dialog"]') || document.querySelector('[class*="drawer"]');
                if (anyModal) description = anyModal.innerText;
            }
            
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
        }
        
        let nextBtn = Array.from(document.querySelectorAll('button, a, div, li')).find(el => {
            let t = (el.innerText || '').trim();
            if (t !== 'Next' && t !== 'Next >' && t !== 'Next>') return false;
            let style = window.getComputedStyle(el);
            if (el.disabled || el.getAttribute('aria-disabled') === 'true' || style.cursor === 'not-allowed' || style.opacity === '0.5') return false;
            return true;
        });
        
        if (!nextBtn) {
            console.log("No Next button found. Finished all pages!");
            break;
        }
        
        console.log("Clicking Next...");
        nextBtn.scrollIntoView({behavior: "smooth", block: "center"});
        await new Promise(r => setTimeout(r, 500));
        nextBtn.click();
        pageNum++;
    }
    
    let uniqueMap = new Map();
    for (let j of allJobs) {
        uniqueMap.set(j.title, j);
    }
    let uniqueJobs = Array.from(uniqueMap.values());
    
    if(uniqueJobs.length === 0) {
        alert('Could not find any jobs to sync!');
        return;
    }
    
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
fs.writeFileSync('bookmarklet_v5.txt', bookmarklet);
console.log("Created bookmarklet_v5.txt");
