import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Update the highlight rate in the hero
content = content.replace(
    '<span style="color: var(--primary);">$70&ndash;120/hr</span>',
    '<span style="color: var(--accent);">$70&ndash;120/hr</span>'
)

# 2. Update the secondary CTA
old_cta = r'<a href="apply.html" style="background: #fff; color: #0f172a; text-decoration: none; font-weight: 700; font-size: 18px; padding: 18px 40px; border-radius: 8px; border: 1px solid #cbd5e1; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 6px rgba\(0,0,0,0.02\);">'
new_cta = r'<a href="apply.html" style="background: #fff; color: var(--accent); text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 40px; border-radius: 8px; border: 2px solid var(--accent); display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02);" onmouseover="this.style.background=\'var(--accent)\'; this.style.color=\'#fff\';" onmouseout="this.style.background=\'#fff\'; this.style.color=\'var(--accent)\';">'
content = re.sub(old_cta, new_cta, content)

# 3. Update the 3rd stat item ($95/hr)
old_stat = r'<div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:4px;">\$95/hr</div>'
new_stat = r'<div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:var(--accent); margin-bottom:4px;">$95/hr</div>'
content = re.sub(old_stat, new_stat, content)

with open('index.html', 'w') as f:
    f.write(content)
print("Updated index.html accents")
