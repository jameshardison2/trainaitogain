import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_prompt = """ETHICS OVERRIDE: If my current experience does not directly support a specific keyword, DO NOT fabricate experience in my bullet points. Instead, elegantly integrate the remaining unsupported keywords into a new 'Core Competencies' or 'Target Skills' section at the top or bottom of the resume. This ensures the ATS scanner registers the exact keyword match without violating professional ethics."""

replace_prompt = """ETHICS OVERRIDE: If my current experience does not directly support a specific keyword, DO NOT fabricate experience in my bullet points. Instead, integrate the remaining unsupported keywords into a new 'Current Learning Goals' or '2025 Upskilling Targets' section at the bottom of the resume. It is 100% honest and accurate for me to state that I am currently actively studying these specific topics on my own time. This ensures the ATS scanner registers the exact keyword match without violating professional ethics."""

if find_prompt in html:
    html = html.replace(find_prompt, replace_prompt)
    print("Fixed prompt!")
else:
    print("Could not find prompt.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
