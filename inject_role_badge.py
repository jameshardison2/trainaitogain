import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_html = """            <div style="color:var(--gray-500); font-size:12px; font-family:monospace; margin-bottom:8px;">${masked}</div>
            <div style="color:var(--gray-400); font-size:12px; margin-bottom:12px;">Captured: ${dateStr}</div>"""

replace_html = """            <div style="color:var(--gray-500); font-size:12px; font-family:monospace; margin-bottom:8px;">${masked}</div>
            ${lead.target_role ? `<div style="background:rgba(16,185,129,0.1); color:var(--primary); font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; display:inline-block; margin-bottom:8px; border:1px solid rgba(16,185,129,0.2);">${lead.target_role}</div>` : ''}
            <div style="color:var(--gray-400); font-size:12px; margin-bottom:12px;">Captured: ${dateStr}</div>"""

if find_html in html:
    html = html.replace(find_html, replace_html)
else:
    print("Warning: Could not find card HTML")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected role badge into Kanban cards")
