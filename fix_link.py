import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_link = """<a href="post-hire.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">Skip to Post-Hire Guide ➔</a>"""
replace_link = """<a href="post-hire.html" style="color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 800; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Final Step: Apply Now ➔</a>"""

if find_link in html:
    html = html.replace(find_link, replace_link)
else:
    print("Warning: Could not find link to replace")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
