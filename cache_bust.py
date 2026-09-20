import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Cache bust the chat widget
html = re.sub(r'chat\.js\?v=\d+', 'chat.js?v=10', html)
if 'chat.js"></script>' in html:
    html = html.replace('chat.js"></script>', 'chat.js?v=10"></script>')

# 2. Remove the Note text
note_text = '<p style="font-size: 13px; color: #888;">\n            Note: You will need to create a free partner account before starting the application.\n          </p>'
if note_text in html:
    html = html.replace(note_text, '')
else:
    # Try generic removal if formatting differs
    html = re.sub(r'<p[^>]*>\s*Note: You will need to create a free partner account before starting the application.\s*</p>', '', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Cache busted and Note removed.")
