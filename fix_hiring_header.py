import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_h1 = '<h1 style="font-size:56px; font-weight:800; color:var(--black); letter-spacing:-0.03em; line-height:1.1; margin-bottom:24px;">\n        WE GET YOU HIRED.\n      </h1>'
replace_h1 = '<h1 style="font-size:42px; font-weight:800; color:var(--black); letter-spacing:-0.02em; line-height:1.2; margin-bottom:24px;">\n        The 3-Step Blueprint to Secure Your AI Job\n      </h1>'
html = html.replace(find_h1, replace_h1)

find_ats = 'bypass the ATS filters'
replace_ats = 'bypass the AI filters'
html = html.replace(find_ats, replace_ats)

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated header.")
