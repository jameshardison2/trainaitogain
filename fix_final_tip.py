import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Replace the current tip with the highly specific copy/paste and tab-checking instructions
old_regex = r'<span style="font-weight: 700; color: var\(--primary-dark\);">🔍 How to find this role:<\/span><br>\s*Click <strong>Filter<\/strong> -> <strong>Domain<\/strong> and select <strong>\$\{m\.domainFilter \|\| \'Software\'\}<\/strong>\.'

new_text = """<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      <ol style="margin: 8px 0 0 16px; padding: 0; font-size: 13px; line-height: 1.4;">
                        <li>Copy the role name above.</li>
                        <li>Click through the 3 tabs (Project-based, One-time, Talent Network) and <strong>paste it into the Search bar</strong>.</li>
                        <li><em>Optional:</em> Click <strong>Filter -> Domain</strong> and select <strong>${m.domainFilter || 'Software'}</strong> to narrow it down.</li>
                      </ol>"""

apply_html = re.sub(old_regex, new_text, apply_html, flags=re.DOTALL)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Final tip instructions injected.")
