import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_str = "AI Recruiter Score"
replace_str = "Get Hired Score"

if find_str in html:
    html = html.replace(find_str, replace_str)
    print("Score rebranded to Get Hired Score!")
else:
    print("Could not find AI Recruiter Score.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
