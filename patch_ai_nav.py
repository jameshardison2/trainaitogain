import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# Fix the bottom navigation link
content = content.replace('href="resume-ats-guide"', 'href="resume-ats-guide.html"')
content = content.replace('⬅ Back to ATS Scanner', '⬅ Step 1: Resume Optimizer')

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("Updated ai-interview.html navigation")
