import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Change fetch('waves.json') to fetch('waves.json?v=2')
html = html.replace("fetch('waves.json')", "fetch('waves.json?v=' + new Date().getTime())")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
