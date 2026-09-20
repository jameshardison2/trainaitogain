import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_badge = """${lead.target_role ? `<div style="background:rgba(16,185,129,0.1); color:var(--primary); font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; display:inline-block; margin-bottom:8px; border:1px solid rgba(16,185,129,0.2);">${lead.target_role}</div>` : ''}"""

replace_badge = """<div style="background:rgba(16,185,129,0.1); color:var(--primary); font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; display:inline-block; margin-bottom:8px; border:1px solid rgba(16,185,129,0.2);">${lead.target_role || 'General Application'}</div>"""

if find_badge in html:
    html = html.replace(find_badge, replace_badge)
else:
    print("Warning: Could not find badge HTML to replace")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Forced badges on all cards")
