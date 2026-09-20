import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = re.compile(r'\.replace\(\/\'\/g, "\\\'"\)\.replace\(\/\"\/g, \'&quot;\'\);')
replacement = r".replace(/'/g, '&#39;').replace(/\"/g, '&quot;');"

new_html, count = pattern.subn(replacement, html)

if count > 0:
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Fixed escape {count} times!")
else:
    print("Could not find escape pattern.")

