import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Use regex to find everything from CRITICAL REQUIREMENT to the end of the prompt string
pattern = re.compile(r'CRITICAL REQUIREMENT:.*?\`\.replace', re.DOTALL)

replacement = """CRITICAL REQUIREMENT: You MUST include every single one of the missing keywords EXACTLY as they are written above. Real ATS scanners require exact matches.\\n\\nETHICS OVERRIDE: If my current experience does not directly support a specific keyword, DO NOT fabricate experience in my bullet points. Instead, elegantly integrate the remaining unsupported keywords into a new 'Core Competencies' or 'Target Skills' section at the top or bottom of the resume. This ensures the ATS scanner registers the exact keyword match without violating professional ethics.\\n\\nHere is my current resume text:\\n\"\"\"\\n${resumeBox.value}\\n\"\"\"`.replace"""

new_html, count = pattern.subn(replacement, html)

if count > 0:
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Updated prompt {count} times to bypass LLM ethical refusals!")
else:
    print("Could not find prompt string with regex.")

