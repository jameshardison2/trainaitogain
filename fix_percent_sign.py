import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the HTML. Find: `<span class="score-text" id="score-text">0</span>%`
html_find = '<span class="score-text" id="score-text">0</span>%'
html_replace = '<span class="score-text" id="score-text">0%</span>'
if html_find in html:
    html = html.replace(html_find, html_replace)

# 2. Fix the JS. 
js_find = "scoreText.innerHTML = score + diffHtml;"
js_replace = "scoreText.innerHTML = score + '%' + diffHtml;"
if js_find in html:
    html = html.replace(js_find, js_replace)

# 3. Also fix the JS reset block which resets it to '0' instead of '0%'
js_reset_find = "document.getElementById('score-text').innerHTML = '0';"
js_reset_replace = "document.getElementById('score-text').innerHTML = '0%';"
if js_reset_find in html:
    html = html.replace(js_reset_find, js_reset_replace)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed the stray percent sign!")
