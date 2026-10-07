import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

fix_js = r"""      let firstName = c.name.split(' ')[0];
      const affiliateRef = localStorage.getItem('affiliate_ref') || '';
      const applyUrl = `https://trainaitogain.com/apply?prematch=${c.domain || 'MEDICAL'}${affiliateRef ? '&ref='+affiliateRef : ''}`;
      let msg = `Hi ${firstName},"""

content = re.sub(r"      let firstName = c\.name\.split\(' '\)\[0\];\n      let msg = `Hi \$\{firstName\},", fix_js, content)

with open('outreach-tool.html', 'w') as f:
    f.write(content)

print("Fixed openDrawer variables")
