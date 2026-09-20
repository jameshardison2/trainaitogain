import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add `let previousScore = null;` at the top with the globals
js_globals_find = """  let jobDescriptions = {};
  let keywordSets = {};
  let resumePlaceholders = {};"""

js_globals_replace = """  let jobDescriptions = {};
  let keywordSets = {};
  let resumePlaceholders = {};
  let previousScore = null;"""

if js_globals_find in html:
    html = html.replace(js_globals_find, js_globals_replace)

# 2. Modify the score rendering logic inside scanBtn setTimeout
# We want to find:
#        scoreText.innerText = score + '%';
#        
#        let meterColor = '#ef4444';

js_score_find = """        scoreText.innerText = score + '%';
        
        let meterColor = '#ef4444';"""

js_score_replace = """        
        let diffHtml = '';
        if (previousScore !== null) {
            let diff = score - previousScore;
            if (diff > 0) {
                diffHtml = `<span style="font-size:16px; color:#10b981; margin-left:12px; font-weight:700;">+${diff}% Improvement 📈</span>`;
            } else if (diff < 0) {
                diffHtml = `<span style="font-size:16px; color:#ef4444; margin-left:12px; font-weight:700;">${diff}% 📉</span>`;
            } else {
                diffHtml = `<span style="font-size:16px; color:#6b7280; margin-left:12px; font-weight:700;">No change</span>`;
            }
        }
        
        scoreText.innerHTML = score + '%' + diffHtml;
        previousScore = score;
        
        let meterColor = '#ef4444';"""

if js_score_find in html:
    html = html.replace(js_score_find, js_score_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added score tracking!")
else:
    print("Could not find score block.")
