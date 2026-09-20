import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace("  }\n  }\n\n  function speakText", "  }\n\n  function speakText")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed extra brace")
