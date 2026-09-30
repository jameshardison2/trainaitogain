import re

with open("apply.html", "r") as f:
    content = f.read()

# Remove the specific div blocks
pattern = r'<div style="background:#10b981[^>]*>.*?</div>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open("apply.html", "w") as f:
    f.write(content)

print("Removed How to apply blocks from apply.html")
