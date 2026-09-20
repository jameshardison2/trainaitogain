import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_scan = """        localStorage.setItem('atsScore', score);
        localStorage.setItem('atsRole', selectedRole);
        localStorage.setItem('atsDomain', selectedDomain);
        localStorage.setItem('atsMissing', missingKWs.join(', '));"""

replace_scan = """        localStorage.setItem('atsScore', score);
        localStorage.setItem('atsRole', selectedRole);
        localStorage.setItem('atsDomain', selectedDomain);
        localStorage.setItem('atsMissing', missingKWs.join(', '));
        // Save the raw text for the AI interview simulator
        const resumeRawText = document.getElementById('resume-text').value;
        if (resumeRawText) {
            localStorage.setItem('candidateResumeText', resumeRawText);
        }"""

if find_scan in html:
    html = html.replace(find_scan, replace_scan)
else:
    print("Warning: Could not find localStorage setItem block in resume-ats-guide.html")

html = html.replace('<!-- CACHE BUST 1', '<!-- CACHE BUST 2')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated resume-ats-guide.html to save candidateResumeText")
