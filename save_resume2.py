import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_scan = """        localStorage.setItem('atsMissing', missingKWs.join(', '));"""

replace_scan = """        localStorage.setItem('atsMissing', missingKWs.join(', '));
        
        const resumeRawText = document.getElementById('resume-text').value;
        if (resumeRawText) {
            localStorage.setItem('candidateResumeText', resumeRawText);
        }"""

if find_scan in html:
    html = html.replace(find_scan, replace_scan)
else:
    print("Warning: Could not find atsMissing in resume-ats-guide.html")

html = html.replace('<!-- CACHE BUST 2', '<!-- CACHE BUST 3')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated resume-ats-guide.html successfully")
