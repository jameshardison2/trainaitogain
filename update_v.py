import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'render_waves\.js\?v=\d+', 'render_waves.js?v=7', content)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
