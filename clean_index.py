import re
import os

with open("index.html", "r") as f:
    content = f.read()

# 1. Strip out the entire <nav> block
content = re.sub(r'<!-- ─── Nav ─────────────────────────────────────────── -->\s*<nav.*?</nav>', '', content, flags=re.DOTALL)

# 2. Strip out the LinkedIn icon div from the footer
linkedin_pattern = r'<div style="margin-bottom: 24px; display: flex; justify-content: center;">\s*<a href="https://www.linkedin.com/company/trainaitogain/".*?</a>\s*</div>'
content = re.sub(linkedin_pattern, '', content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)
print("Cleaned index.html")
