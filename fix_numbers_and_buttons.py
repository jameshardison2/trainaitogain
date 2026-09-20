import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the conflicting numbers: Change $110/hr to $160/hr
html = html.replace('$110/hr', '$160/hr')

# 2. Put back the "Apply Now" button in place of the PDF guide
old_button = """<a href="guide-download.html" style="background: #fff; color: #111; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-flex; align-items: center; transition: all 0.2s;">
              Download Guide PDF
            </a>"""

new_button = """<a href="https://t.mercor.com/wbPMF" style="background: #fff; color: #111; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-flex; align-items: center; transition: all 0.2s;">
              Apply Now
            </a>"""

if old_button in html:
    html = html.replace(old_button, new_button)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed numbers and added Apply Now button back.")
else:
    print("Could not find the old PDF button.")
