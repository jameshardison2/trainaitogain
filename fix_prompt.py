import re

with open('apply.html', 'r') as f:
    content = f.read()

old_prompt = """OUTPUT ONLY VALID JSON EXACTLY LIKE THIS:
[{"role": "Exact Job Title from List", "reason": "1-sentence why they fit", "matchScore": 95}, ...]`;"""

new_prompt = """OUTPUT ONLY VALID JSON EXACTLY LIKE THIS:
[{"roleName": "Exact Job Title from List", "explanation": "1-sentence why they fit", "matchScore": 95}, ...]`;"""

content = content.replace(old_prompt, new_prompt)

with open('apply.html', 'w') as f:
    f.write(content)
print("Prompt fixed")
