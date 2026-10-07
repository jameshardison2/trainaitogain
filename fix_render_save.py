import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = "onclick=\"saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this)\""
new_str = "onclick=\"saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${role.linkTarget || 'https://t.mercor.com/wbPMF'}')\""

content = content.replace(old_str, new_str)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
