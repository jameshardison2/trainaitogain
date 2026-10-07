with open("render_waves.ts", "r") as f:
    content = f.read()

# Add complete button to the HTML string
old_btn = """<button onclick="saveRole('${role.title.replace(/'/g, "\\'")}', '${role.domain}', '${role.pay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>"""
new_btn = """<button onclick="saveRole('${role.title.replace(/'/g, "\\'")}', '${role.domain}', '${role.pay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
            <button onclick="markAsComplete('${role.title.replace(/'/g, "\\'")}', '${role.domain}', '${role.pay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s; margin-left:8px;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>"""

if "markAsComplete" not in content:
    content = content.replace(old_btn, new_btn)

# Add COMPLETED to filter dropdown
old_select = """<option value="LEGAL">Legal & Compliance</option>"""
new_select = """<option value="LEGAL">Legal & Compliance</option>
            <option value="COMPLETED">Completed Roles</option>"""

if "COMPLETED" not in content:
    content = content.replace(old_select, new_select)

with open("render_waves.ts", "w") as f:
    f.write(content)
