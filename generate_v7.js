const fs = require('fs');

const rawJs = `
(async function() {
    alert('TrainAIToGain Deep Sync V7 (Advanced Pagination) Started! Please DO NOT touch your mouse.');
    
    let allJobs = [];
    let pageNum = 1;
    let maxPages = 40;
    
    while (pageNum <= maxPages) {
        console.log("Scanning Page " + pageNum + "...");
        await new Promise(r => setTimeout(r, 3000)); // wait for page load
        
        window.getSelection().removeAllRanges();
        
        let cards = Array.from(document.querySelectorAll('div, a, li')).filter(el => {
            let style = window.getComputedStyle(el);
            if (style.cursor !== 'pointer') return false;
            let rect = el.getBoundingClientRect();
            if (rect.width < 200 || rect.width > 600) return false;
            if (rect.height < 50 || rect.height > 400) return false;
            
            let text = el.innerText || '';
            if (!text.match(/\\$|\\d+ hired|New opportunity|1-click apply/i)) return false;
            return true;
        });
        
        cards = cards.filter(c => !cards.some(other => other !== c && other.contains(c)));
        
        let actualCards = [];
        for (let c of cards) {
            let titleNode = c.querySelector('h1, h2, h3, h4, strong') || c;
            let title = (titleNode.innerText || '').split('\\n')[0].trim();
            if (title.includes('$')) title = (c.innerText || '').split('\\n')[0].trim();
            if (!title) continue;
            
            let payMatch = (c.innerText || '').match(/\\$(\\d+)\\s*(?:-\\s*\\$(\\d+))?\\s*(?:\\/|per)\\s*(hour|hr|month|mo|year|yr|task)/i);
            let pay = payMatch ? payMatch[0] : 'Competitive';
            
            actualCards.push({ element: c, title: title, pay: pay });
        }
        
        console.log("Found " + actualCards.length + " jobs on Page " + pageNum);
        let firstCardTitle = actualCards.length > 0 ? actualCards[0].title : null;
        
        for (let i = 0; i < actualCards.length; i++) {
            let currentCard = actualCards[i];
            currentCard.element.scrollIntoView({behavior: "smooth", block: "center"});
            await new Promise(r => setTimeout(r, 600));
            
            let clickTarget = currentCard.element.querySelector('a') || currentCard.element;
            clickTarget.click();
            
            await new Promise(r => setTimeout(r, 2000));
            
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
            
            let description = currentCard.element.innerText || '';
            let rightPanes = Array.from(document.querySelectorAll('div')).filter(el => {
                let r = el.getBoundingClientRect();
                return r.width > 300 && r.height > 300 && r.left > 200 && el.innerText.includes('Application');
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
        
        // NEXT BUTTON LOGIC (Bulletproof)
        let nextBtn = document.querySelector('[aria-label="Next page"], [aria-label*="next"], button[title*="Next"]');
        if (!nextBtn) {
            let els = Array.from(document.querySelectorAll('*'));
            nextBtn = els.find(el => {
                if (el.children.length > 2) return false;
                let t = (el.textContent || '').trim();
                if (t === 'Next' || t === 'Next >' || t === 'Next>') {
                    let rect = el.getBoundingClientRect();
                    return rect.width > 0 && window.getComputedStyle(el).opacity !== '0.5' && el.getAttribute('aria-disabled') !== 'true';
                }
                return false;
            });
        }
        
        if (!nextBtn) {
            console.log("No Next button found. Finished all pages!");
            break;
        }
        
        console.log("Clicking Next...");
        nextBtn.scrollIntoView({behavior: "smooth", block: "center"});
        await new Promise(r => setTimeout(r, 600));
        
        let rect = nextBtn.getBoundingClientRect();
        let ev = new MouseEvent('click', { view: window, bubbles: true, cancelable: true, clientX: rect.left + rect.width/2, clientY: rect.top + rect.height/2 });
        nextBtn.dispatchEvent(ev);
        try { nextBtn.click(); } catch(e){}
        
        // Wait intelligently for page flip
        let waited = 0;
        let pageFlipped = false;
        while(waited < 10000) {
            await new Promise(r => setTimeout(r, 1000));
            waited += 1000;
            
            let checkNode = document.querySelector('h1, h2, h3, h4, strong');
            if (firstCardTitle && checkNode && !document.body.innerText.includes(firstCardTitle)) {
                console.log("Page successfully flipped!");
                pageFlipped = true;
                break;
            }
            // Or if active pagination pill changed
            let activePill = document.querySelector('button[aria-current="page"], [class*="active"]');
            if (activePill && activePill.innerText == (pageNum + 1)) {
                 console.log("Pagination pill updated!");
                 pageFlipped = true;
                 break;
            }
        }
        
        if (!pageFlipped) {
             console.log("Warning: Could not verify page flip after 10s, assuming it worked or hit the end.");
        }
        
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
fs.writeFileSync('bookmarklet_v7.txt', bookmarklet);
console.log("Created bookmarklet_v7.txt");
