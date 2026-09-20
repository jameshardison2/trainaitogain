import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_find = """CRITICAL REQUIREMENT: You MUST include every single one of the missing keywords EXACTLY as they are written above. Do not change the tense, do not use synonyms, and do not abbreviate them. Real ATS scanners require exact matches.`;"""

js_replace = """CRITICAL REQUIREMENT: You MUST include every single one of the missing keywords EXACTLY as they are written above. Do not change the tense, do not use synonyms, and do not abbreviate them. Real ATS scanners require exact matches.

Here is my current resume text:
"""
${resumeBox.value}
"""`;"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Appended resume text to prompt!")
else:
    print("Could not find prompt string.")

