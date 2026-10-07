with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

import time
ts = str(int(time.time()))

import re
content = re.sub(r'render_waves\.js\?v=\d+', f'render_waves.js?v={ts}', content)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
