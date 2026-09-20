import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

old_tip = """<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      When the portal opens, paste <strong>"${m.roleName}"</strong> into the search bar, or build your profile to be auto-matched."""

new_tip = """<span style="font-weight: 700; color: var(--primary-dark);">🤖 Auto-Routing Enabled:</span><br>
                      Mercor uses a <strong>Universal Talent Network</strong>. You do not need to search for this specific role! Just create your account and their AI will automatically route your profile to the <strong>${m.roleName}</strong> pipeline."""

apply_html = apply_html.replace(old_tip, new_tip)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Updated tip to explain universal application.")
