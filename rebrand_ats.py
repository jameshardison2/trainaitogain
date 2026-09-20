import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    'Interactive ATS Resume Scanner': 'Interactive AI Resume Scanner',
    'ATS Match Score': 'AI Recruiter Score',
    'pass the ATS screening': 'pass the automated AI recruiter screening',
    'ATS scanner registers': 'AI scanner registers',
    'automated ATS screening': 'automated AI recruiter screening'
}

for find_str, replace_str in replacements.items():
    if find_str in html:
        html = html.replace(find_str, replace_str)
        print(f"Replaced: {find_str}")
    else:
        print(f"Could not find: {find_str}")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
