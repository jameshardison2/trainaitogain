import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

html_find = "const score = Math.round((matches / total) * 100);"
html_replace = """const score = Math.round((matches / total) * 100);
        
        // Save to localStorage for the Guide Assistant to use
        localStorage.setItem('atsScore', score);
        localStorage.setItem('atsRole', selectedRole);
        localStorage.setItem('atsMissing', missingKWs.join(', '));"""

if html_find in html:
    html = html.replace(html_find, html_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated resume-ats-guide.html to save context.")
else:
    print("Could not find HTML block.")
