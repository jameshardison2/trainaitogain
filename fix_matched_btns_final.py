with open("apply.html", "r") as f:
    content_html = f.read()

# Using regex to find the button
import re
pattern = r'(<button type="button" onclick="markAsComplete.*?>✅</button>)'

replacement = r'\1\n                      <button type="button" onclick="document.getElementById(\'aws-file-input\').click();" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background=\'var(--primary-light)\'; this.style.color=\'var(--primary-dark)\';" onmouseout="this.style.background=\'var(--gray-100)\'; this.style.color=\'var(--gray-700)\';">🎯</button>'

if "🎯</button>" not in content_html.split("✅</button>")[1]:
    content_html = re.sub(pattern, replacement, content_html)

with open("apply.html", "w") as f:
    f.write(content_html)
