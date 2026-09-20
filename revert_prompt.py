import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_prompt = """Real ATS scanners require exact matches.\n\nCRITICAL REQUIREMENT 2: DO NOT output a .docx or PDF file. You MUST output the final updated resume as raw text within a single markdown code block so I can easily copy and paste it."""
replace_prompt = """Real ATS scanners require exact matches."""

if find_prompt in html:
    html = html.replace(find_prompt, replace_prompt)
    print("Reverted prompt!")
else:
    print("Could not find prompt.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
