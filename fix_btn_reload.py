import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Replace the bulky onclick that might be causing syntax errors and page reloads
old_btn_regex = r'<button onclick="\s*const currentRef.*?window\.location\.href = targetUrl;\s*"\s*style="background:var\(--gray-900\).*?Apply for this Role ➔</button>'

new_btn = """<button type="button" onclick="window.location.href='https://t.mercor.com/wbPMF' + (localStorage.getItem('affiliate_ref') ? '?ref=' + localStorage.getItem('affiliate_ref') : '')" style="background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; width:100%; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>"""

apply_html = re.sub(old_btn_regex, new_btn, apply_html, flags=re.DOTALL)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Button bug fixed.")
