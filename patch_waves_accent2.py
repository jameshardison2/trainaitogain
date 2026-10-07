import re

with open('render_waves.ts', 'r') as f:
    content = f.read()

# Change pay rate text callout
content = content.replace(
    'color:var(--primary); font-weight:800; font-size:16px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}',
    'color:var(--accent); font-weight:900; font-size:18px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}'
)

# Change job card borders
content = content.replace(
    'border:2px solid var(--primary); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">',
    'border:2px solid var(--accent); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-orange);">'
)

# Fix carousel arrows (they used to be orange, I changed to primary, I'll change back to accent)
content = content.replace(
    'color:var(--primary); border:1px solid var(--primary); width:40px;',
    'color:var(--accent); border:1px solid var(--accent); width:40px;'
)
content = content.replace(
    'this.style.background=\'var(--primary)\'; this.style.color=\'white\';',
    'this.style.background=\'var(--accent)\'; this.style.color=\'white\';'
)
content = content.replace(
    'this.style.background=\'white\'; this.style.color=\'var(--primary)\';',
    'this.style.background=\'white\'; this.style.color=\'var(--accent)\';'
)

with open('render_waves.ts', 'w') as f:
    f.write(content)
print("Updated TS with accent colors")
