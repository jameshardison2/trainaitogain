import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the broken string concatenation
broken_str = 'extractedText += pageText + "\n";'
fixed_str = 'extractedText += pageText + "\\n";'
html = html.replace(broken_str, fixed_str)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed extractedText newline")
