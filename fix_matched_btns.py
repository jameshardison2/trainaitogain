import re

with open("apply.html", "r") as f:
    content = f.read()

old_btn = """                    <button type="button" onclick="window.open('${m.roleUrl}' + (localStorage.getItem('affiliate_ref') ? '&ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')" data-ignore=" + (localStorage.getItem('affiliate_ref') ? '?ref=' + localStorage.getItem('affiliate_ref') : '')" style="background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; width:100%; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>"""

new_btns = """                    <div style="display:flex; gap:8px; width:100%;">
                      <button type="button" onclick="window.open('${m.roleUrl}' + (localStorage.getItem('affiliate_ref') ? '&ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')" style="flex:1; background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>
                      <button type="button" onclick="saveRole('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
                      <button type="button" onclick="markAsComplete('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>
                    </div>"""

if old_btn in content:
    content = content.replace(old_btn, new_btns)

with open("apply.html", "w") as f:
    f.write(content)
