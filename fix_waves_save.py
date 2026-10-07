with open("render_waves.ts", "r") as f:
    content = f.read()

# Inside render_waves.ts, where the button is generated:
old_button = """<button style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';" onclick="window.open('\${role.linkTarget}' + (localStorage.getItem('affiliate_ref') ? (role.linkTarget.includes('?') ? '&' : '?') + 'ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')">Apply Now</button>"""

new_button = """<button style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';" onclick="window.open('\${role.linkTarget}' + (localStorage.getItem('affiliate_ref') ? (role.linkTarget.includes('?') ? '&' : '?') + 'ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')">Apply Now</button>
            <button onclick="saveRole('\${role.title.replace(/'/g, "\\'")}', '\${role.domain}', '\${role.pay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>"""

if "💾" not in content:
    content = content.replace(old_button, new_button)

with open("render_waves.ts", "w") as f:
    f.write(content)

