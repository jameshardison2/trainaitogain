import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_label = "5. Paste AI-Updated Resume:"
replace_label = "5. Provide AI-Updated Resume:"

html = html.replace(find_label, replace_label)

find_placeholder = "Paste the new resume you got from Claude/ChatGPT here..."
replace_placeholder = 'Paste the raw text here, or click "Upload PDF or DOCX" above...'

html = html.replace(find_placeholder, replace_placeholder)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
