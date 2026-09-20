import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# I need to sync the sessionStorage render script with the main render script
old_session_render = """<p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
                    <button type="button" onclick="window.open"""

new_session_render = """<p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      Click <strong>Filter</strong> -> <strong>Domain</strong> and select <strong>${m.domainFilter || 'Software'}</strong>.
                    </div>
                    <button type="button" onclick="window.open"""

# I will just replace the old Auto-Routing message if it exists in the persistence script
if "Auto-Routing Enabled" in apply_html[apply_html.rfind('<script>'):]:
    # It seems the persistence script was not updated. Let's fix it manually.
    pass

# Actually, let's just do a blanket regex replacement in the persistence script portion
parts = apply_html.split("document.addEventListener('DOMContentLoaded', () => {")
if len(parts) > 1:
    script_part = parts[1]
    
    # Remove old Auto routing if it's there
    script_part = re.sub(r'<span style="font-weight: 700; color: var\(--primary-dark\);">.*?pipeline\.', 
                         r"""<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      Click <strong>Filter</strong> -> <strong>Domain</strong> and select <strong>${m.domainFilter || 'Software'}</strong>.
                    </div>""", script_part, flags=re.DOTALL)
    
    # What if it didn't have Auto-Routing? (because I injected persistence BEFORE Auto-Routing)
    # Then it's just the old button.
    
    # Let's just find the p tag and the button tag
    script_part = re.sub(
        r'(<p[^>]*><strong>Why you\'re a fit:.*?<\/p>).*?(<button)',
        r'\1\n<div style="background: var(--gray-50); border: 1px dashed var(--gray-300); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 13px; color: var(--gray-700); width: 100%; box-sizing: border-box;">\n<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>\nClick <strong>Filter</strong> -> <strong>Domain</strong> and select <strong>${m.domainFilter || \'Software\'}</strong>.\n</div>\n\2',
        script_part, flags=re.DOTALL
    )
    apply_html = parts[0] + "document.addEventListener('DOMContentLoaded', () => {" + script_part

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Session storage synced.")
