import urllib.parse

js_code = """
(async function(){
    alert('TrainAIToGain Sync Started! Please wait while we scan the jobs...');
    let lastHeight = 0;
    while(true) {
        window.scrollBy(0, 1500);
        await new Promise(r => setTimeout(r, 800));
        let newHeight = document.body.scrollHeight;
        if(newHeight === lastHeight) break;
        lastHeight = newHeight;
    }
    let jobs = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const payRegex = /\$(\d+)\s*(?:-\s*\$(\d+))?\s*\/\s*(hour|hr|month|mo|year|yr)/i;
    let processedNodes = new Set();
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
            let description = card.innerText || '';
            let tagsMatch = description.match(/(Remote|Onsite|Hybrid|US Only|India|LatAm)/ig) || ['Remote'];
            jobs.push({
                title: title.trim(),
                pay: text,
                description: description.substring(0, 350).replace(/\\n/g, ' ') + '...',
                tags: [...new Set(tagsMatch)]
            });
        }
    }
    if(jobs.length === 0) {
        alert('Could not find any jobs. Make sure you are on the Jobs tab.');
        return;
    }
    try {
        let res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ jobs: jobs, token: 'TRAINAITOGAIN_SYNC_SECURE_2026' })
        });
        if(res.ok) {
            alert(`✅ Success! Synced ${jobs.length} jobs to TrainAIToGain.`);
        } else {
            alert('❌ Error syncing jobs. Check your console.');
        }
    } catch(e) {
        alert('❌ Network error syncing jobs.');
    }
})();
"""

# Minify by removing newlines and redundant spaces
minified = js_code.replace('\n', '').replace('    ', '')

# URL encode so it works flawlessly in a bookmark
final_bookmarklet = "javascript:" + urllib.parse.quote(minified)

with open('bookmarklet.txt', 'w', encoding='utf-8') as f:
    f.write(final_bookmarklet)
