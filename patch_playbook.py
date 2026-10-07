with open('hiring-pipeline.html', 'r') as f:
    content = f.read()

# 1. Reduce header padding
# <header style="padding: 40px 0 40px; background-color: var(--white); border-bottom:1px solid var(--gray-200); text-align:center;">
old_header = '<header style="padding: 40px 0 40px; background-color: var(--white); border-bottom:1px solid var(--gray-200); text-align:center;">'
new_header = '<header style="padding: 32px 0 24px; background-color: var(--white); border-bottom:1px solid var(--gray-200); text-align:center;">'
content = content.replace(old_header, new_header)

# Reduce section padding above cards
old_section = '<section class="section" style="padding: 64px 0;">'
new_section = '<section class="section" style="padding: 32px 0 64px;">'
content = content.replace(old_section, new_section)

# 2. Add padding to bottom to prevent floating widget overlap
old_final = '  <!-- ─── Final CTA ─────────────────────────────────────────── -->\n  <section class="section">'
new_final = '  <!-- ─── Final CTA ─────────────────────────────────────────── -->\n  <section class="section" style="padding-bottom: 120px;">'
content = content.replace(old_final, new_final)

with open('hiring-pipeline.html', 'w') as f:
    f.write(content)
print("Applied playbook fixes")
