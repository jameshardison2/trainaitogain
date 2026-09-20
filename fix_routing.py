import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Fix the routing inside the dynamically generated AI Job Cards
old_btn = """<button onclick="window.location.href='${m.roleUrl || 'javascript:void(0);'}'" style="background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; width:100%; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>"""

new_btn = """<button onclick="
  const currentRef = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
  let targetUrl = 'https://t.mercor.com/wbPMF';
  if (currentRef) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + currentRef;
  }
  window.location.href = targetUrl;
" style="background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; width:100%; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>"""

apply_html = apply_html.replace(old_btn, new_btn)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Dynamic routing fixed.")
