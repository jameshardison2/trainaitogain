import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We want to move <div id="ai-fix-container"></div> BELOW the <button ... id="apply-btn" ...>
pattern = re.compile(r'(<div id="ai-fix-container"></div>)\s*(<button[^>]*id="apply-btn"[^>]*>.*?</button>)', re.DOTALL)
replacement = r'\2\n    \1'

new_html, count = pattern.subn(replacement, html)

if count > 0:
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Swapped container order {count} times!")
else:
    print("Could not swap container order with regex.")

