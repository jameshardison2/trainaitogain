const fs = require('fs');

const rawJs = `
(async function() {
    alert('TrainAIToGain Deep Sync V9 (Link Harvest & Recovery) Started! Please DO NOT touch your mouse.');
    
    let totalSynced = 0;
    let pageNum = 1;
    let maxPages = 40;
    
    while (pageNum <= maxPages) {
        console.log("Scanning Page " + pageNum + "...");
        await new Promise(r => setTimeout(r, 2500));
        
        window.getSelection().removeAllRanges();
        
        let getCards = () => {
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
            return cards.filter(c => !cards.some(other => other !== c && other.contains(c)));
        };
        
        let initialCards = getCards();
        let numCards = initialCards.length;
        console.log("Found " + numCards + " jobs on Page " + pageNum);
        
        let pageJobs = [];
        let firstCardTitle = null;
        
        for (let i = 0; i < numCards; i++) {
            let currentCards = getCards();
            
            if (currentCards.length <= i) {
                let backBtns = Array.from(document.querySelectorAll('a, button')).filter(el => {
                    let text = el.innerText || '';
                    return text.includes('View all opportunities') && text.length < 50;
                });
                if (backBtns.length > 0) {
                    console.log("Recovering from full screen mode...");
                    backBtns[0].click();
                    await new Promise(r => setTimeout(r, 2500));
                    currentCards = getCards();
                }
            }
            
            if (currentCards.length <= i) {
                 console.log("Failed to recover cards. Skipping remaining on this page.");
                 break;
            }
            
            let cardElement = currentCards[i];
            
            let titleNode = cardElement.querySelector('h1, h2, h3, h4, strong') || cardElement;
            let title = (titleNode.innerText || '').split('\\n')[0].trim();
            if (title.includes('$')) title = (cardElement.innerText || '').split('\\n')[0].trim();
            if (!title) continue;
            if (i === 0) firstCardTitle = title;
            
            let payMatch = (cardElement.innerText || '').match(/\\$(\\d+)\\s*(?:-\\s*\\$(\\d+))?\\s*(?:\\/|per)\\s*(hour|hr|month|mo|year|yr|task)/i);
            let pay = payMatch ? payMatch[0] : 'Competitive';
            
            cardElement.scrollIntoView({behavior: "smooth", block: "center"});
            await new Promise(r => setTimeout(r, 600));
            
            let clickTarget = cardElement.querySelector('a') || cardElement;
            clickTarget.click();
            
            // DYNAMICALLY WAIT FOR REFERRAL LINK
            let linkTarget = 'https://t.mercor.com/wbPMF';
            let waitLink = 0;
            let foundSpecificLink = false;
            while (waitLink < 4500) {
                let linkEls = Array.from(document.querySelectorAll('a, button, div, span, p')).filter(el => el.innerText && el.innerText.includes('https://t.mercor.com/'));
                if (linkEls.length > 0) {
                    linkEls.sort((a,b) => a.innerText.length - b.innerText.length);
                    let match = linkEls[0].innerText.match(/(https:\\/\\/t\\.mercor\\.com\\/[a-zA-Z0-9]+)/);
                    if (match && match[1] !== 'https://t.mercor.com/wbPMF') {
                        linkTarget = match[1];
                        foundSpecificLink = true;
                        break;
                    }
                }
                
                let hrefs = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes('t.mercor.com/') && !a.href.includes('wbPMF'));
                if (hrefs.length > 0) {
                    linkTarget = hrefs[hrefs.length - 1].href;
                    foundSpecificLink = true;
                    break;
                }
                
                await new Promise(r => setTimeout(r, 500));
                waitLink += 500;
            }
            
            let description = '';
            let rightPanes = Array.from(document.querySelectorAll('div')).filter(el => {
                let r = el.getBoundingClientRect();
                return r.width > 300 && r.height > 300 && el.innerText.includes('Application');
            });
            if (rightPanes.length > 0) {
                rightPanes.sort((a,b) => a.innerText.length - b.innerText.length);
                description = rightPanes[0].innerText;
            } else {
                let anyModal = document.querySelector('[role="dialog"]') || document.querySelector('[class*="drawer"]');
                if (anyModal) description = anyModal.innerText;
            }
            if(!description) description = cardElement.innerText || '';
            
            let tagsMatch = description.match(/(Remote|Onsite|Hybrid|US Only|India|LatAm)/ig) || ['Remote'];
            
            pageJobs.push({
                title: title,
                pay: pay,
                description: description.substring(0, 350).replace(/\\n/g, ' ') + '...',
                tags: [...new Set(tagsMatch)],
                linkTarget: linkTarget,
                platform: 'Mercor'
            });
            
            console.log("Grabbed: " + title + " -> " + linkTarget + (foundSpecificLink ? " (UNIQUE)" : " (FALLBACK)"));
            
            // RETURN FROM FULL SCREEN
            let backBtns = Array.from(document.querySelectorAll('a, button')).filter(el => {
                let text = el.innerText || '';
                return text.includes('View all opportunities') && text.length < 50;
            });
            if (backBtns.length > 0) {
                backBtns[0].click();
                await new Promise(r => setTimeout(r, 1500));
            }
        }
        
        if (pageJobs.length > 0) {
            let uniqueMap = new Map();
            for (let j of pageJobs) uniqueMap.set(j.title, j);
            let uniqueJobs = Array.from(uniqueMap.values());
            
            console.log("Saving " + uniqueJobs.length + " jobs from Page " + pageNum + " to database...");
            try {
                let res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobs: uniqueJobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
                });
                if(res.ok) totalSynced += uniqueJobs.length;
            } catch(e) { console.error("Save failed for page", pageNum); }
        }
        
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
        
        let waited = 0;
        let pageFlipped = false;
        while(waited < 10000) {
            await new Promise(r => setTimeout(r, 1000));
            waited += 1000;
            let checkNode = document.querySelector('h1, h2, h3, h4, strong');
            if (firstCardTitle && checkNode && !document.body.innerText.includes(firstCardTitle)) {
                pageFlipped = true; break;
            }
            let activePill = document.querySelector('button[aria-current="page"], [class*="active"]');
            if (activePill && activePill.innerText == (pageNum + 1)) {
                 pageFlipped = true; break;
            }
        }
        
        pageNum++;
    }
    
    alert(\`✅ Deep Sync Complete! Synced \${totalSynced} total jobs across \${pageNum-1} pages!\`);
})();
`;

const bookmarklet = 'javascript:' + encodeURIComponent(rawJs.replace(/\\n\\s*/g, ''));
fs.writeFileSync('bookmarklet_v9.txt', bookmarklet);
console.log("Created bookmarklet_v9.txt");
