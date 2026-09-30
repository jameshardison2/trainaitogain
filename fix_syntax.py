import re
with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

bad_html = """
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
      </div>
"""

good_html = """
    html += `
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
      </div>
    `;
"""

content = content.replace(bad_html, good_html)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
