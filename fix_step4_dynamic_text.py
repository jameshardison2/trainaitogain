import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_text = "Then upload the new resume below!</p>"
replace_text = 'Then upload the new resume below!<br><br><span style="font-size:12px; color:var(--primary); font-weight:600;">💡 Tip: This prompt dynamically updates after every scan to only target your remaining missing keywords!</span></p>'

if find_text in html:
    html = html.replace(find_text, replace_text)
    print("Step 4 dynamic text added!")
else:
    print("Could not find Step 4 text.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
