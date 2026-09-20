import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

old_button_section = """<button type="button" onclick="window.open('https://t.mercor.com/wbPMF'"""

new_button_section = """
                    <div style="background: var(--gray-50); border: 1px dashed var(--gray-300); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13px; color: var(--gray-700); width: 100%; box-sizing: border-box;">
                      <span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      When the portal opens, paste <strong>"${m.roleName}"</strong> into the search bar, or build your profile to be auto-matched.
                    </div>
                    <button type="button" onclick="window.open('https://t.mercor.com/wbPMF'"""

apply_html = apply_html.replace(old_button_section, new_button_section)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Added search tip.")
