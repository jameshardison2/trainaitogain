import re

with open('apply.html', 'r') as f:
    html = f.read()

def brute_replace(text, emoji, svg_path, title):
    # Find all instances of button with the emoji
    pattern = r'<button type="button" onclick="([^"]*)" style="background:var\(--gray-100\); border:1px solid var\(--gray-200\); color:var\(--gray-700\); padding:0 14px; border-radius:var\(--radius-sm\); font-size:16px; cursor:pointer; transition:all 0\.2s;" onmouseover="this\.style\.background=\'var\(--primary-light\)\'; this\.style\.color=\'var\(--primary-dark\)\';" onmouseout="this\.style\.background=\'var\(--gray-100\)\'; this\.style\.color=\'var\(--gray-700\)\';">' + emoji + r'</button>'
    
    def repl(m):
        onclick_val = m.group(1)
        return f'<button title="{title}" type="button" onclick="{onclick_val}" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background=\'var(--primary-light)\'; this.style.color=\'var(--primary-dark)\';" onmouseout="this.style.background=\'var(--gray-100)\'; this.style.color=\'var(--gray-700)\';"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{svg_path}</svg></button>'

    return re.sub(pattern, repl, text)

html = brute_replace(html, '💾', '<path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/>', 'Save role to dashboard')
html = brute_replace(html, '✅', '<path d="M20 6L9 17l-5-5"/>', 'Mark as Applied / Completed')
html = brute_replace(html, '🎯', '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', 'Scan my resume to see if it matches this job')

with open('apply.html', 'w') as f:
    f.write(html)

print("Patched python apply.html 2")
