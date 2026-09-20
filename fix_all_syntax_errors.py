import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace literal backslash-n with actual newline
html = html.replace('\\n', '\n')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced all literal \\n with actual newlines")
