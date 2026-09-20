import re

# 1. ai-interview.html
with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_eric_ai = '<em>"When you want to succeed as bad as you want to breathe, then you\'ll be successful." - Eric Thomas.<br>Complete the simulation to unlock Step 3, or skip ahead if you must.</em>'
replace_eric_ai = 'Complete the simulation to unlock Step 3, or skip ahead if you must.'
html = html.replace(find_eric_ai, replace_eric_ai)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. resume-ats-guide.html
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<!-- Motivation -->.*?</div>', '', html, flags=re.DOTALL)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 3. hiring-pipeline.html
with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<div style="margin-bottom:40px; padding:16px; background:#F8FAFC; border-left:4px solid var\(--primary\); border-radius:4px; display:inline-block; text-align: left;">.*?</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div style="margin-top:20px; padding:16px; background:#F8FAFC; border-left:4px solid var\(--primary\); border-radius:4px; display:inline-block;">.*?</div>', '', html, flags=re.DOTALL)

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 4. dashboard.html
with open('dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()
    
html = re.sub(r'<div style="background:var\(--gray-100\); border-left:4px solid var\(--primary\); padding:24px; border-radius:0 var\(--radius-md\) var\(--radius-md\) 0; margin-bottom:48px;">.*?</div>', '', html, flags=re.DOTALL)

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Removed quotes!")
