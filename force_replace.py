import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Replace any instance of Auto-Routing with the Filter Tip
old_regex = r'<span style="font-weight: 700; color: var\(--primary-dark\);">🤖 Auto-Routing Enabled:<\/span><br>\s*Mercor uses a <strong>Universal Talent Network<\/strong>\. You do not need to search for this specific role! Just create your account and their AI will automatically route your profile to the <strong>\$\{m\.roleName\}<\/strong> pipeline\.'

new_text = """<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      Click <strong>Filter</strong> -> <strong>Domain</strong> and select <strong>${m.domainFilter || 'Software'}</strong>."""

apply_html = re.sub(old_regex, new_text, apply_html, flags=re.DOTALL)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Forced replacement.")
