import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_button = '<a href="javascript:void(0)" onclick="const el = document.getElementById(\'step1\'); window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: \'smooth\'});" class="btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:18px 32px; font-size:18px; text-decoration:none; box-shadow:var(--shadow-orange);">'
replace_button = '<a href="resume-ats-guide.html" class="btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:18px 32px; font-size:18px; text-decoration:none; box-shadow:0 8px 24px rgba(16, 185, 129, 0.3);">'

html = html.replace(find_button, replace_button)

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated hero button.")
