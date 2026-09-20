import re

with open('apply.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Title
html = html.replace('<title>Global Opportunities Index - TrainAIToGain</title>', '<title>Active Open Roles - TrainAIToGain</title>')

# 2. Update H1
html = html.replace('Global Opportunities Index</h1>', 'Active Open Roles</h1>')

# 3. Update P
old_p = 'Browse all 50 active pipelines. Select a domain below to see granular, niche-specific job postings and bypass the generic applicant pool.'
new_p = 'Select your area of expertise below to browse active hiring waves and start your application.'
html = html.replace(old_p, new_p)

# 4. Remove Notice Block
notice_pattern = r'<!-- Unified Notice Block -->.*?</div>\s*</div>'
html = re.sub(notice_pattern, '', html, flags=re.DOTALL)

# 5. Simplify Resume Uploader text
html = html.replace('Fast-Track: AI Resume Analysis', 'Fast-Track: Match My Resume')
html = html.replace('Securely upload your resume (PDF). Our local AI pipeline will instantly match you to the highest paying active hiring waves.', 'Upload your resume (PDF) to instantly see which open roles match your expertise.')

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Simplified apply.html header.")
