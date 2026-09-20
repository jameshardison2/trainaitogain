import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Clean up the CSS class
html = html.replace('.sim-text { font-size: 22px; font-weight: 500; line-height: 1.5; margin-bottom: 32px; min-height: 100px; color: var(--white); }', '.sim-text { font-size: 22px; font-weight: 600; line-height: 1.4; color: var(--white); }')

# 2. Clean up the inline style
find_inline = """<div class="sim-text" id="sim-text" style="display:inline-block; font-size:22px; font-weight:600; line-height:1.4; color:white; margin:0; text-shadow: 0px 2px 8px rgba(0,0,0,0.8), 0px 4px 16px rgba(0,0,0,0.8); background:rgba(0,0,0,0.4); padding:8px 16px; border-radius:8px; backdrop-filter:blur(4px);">Initializing AI...</div>"""
replace_inline = """<div class="sim-text" id="sim-text" style="display:inline-block; font-size:24px; font-weight:700; line-height:1.3; color:white; margin:0; text-shadow: 0px 2px 4px rgba(0,0,0,1), 0px 4px 12px rgba(0,0,0,0.8), 0px 0px 24px rgba(0,0,0,1); padding:0;">Initializing AI...</div>"""
html = html.replace(find_inline, replace_inline)

# 3. Add a cache bust
html = html.replace('<!-- CACHE BUST', '<!-- CACHE BUST 2 ')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed cinematic subtitles")
