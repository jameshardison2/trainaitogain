with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('?v=3', '?v=4')
with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()
import re
content = re.sub(r'render_waves\.js\?v=\d+', 'render_waves.js?v=4', content)
with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
