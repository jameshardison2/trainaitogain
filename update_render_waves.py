import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the giant onclick with the new function call
old_str = r"onclick=\"const refCode = localStorage\.getItem\('affiliate_ref'\); let targetUrl = '\${role\.linkTarget \|\| 'https://t\.mercor\.com/wbPMF'}'; if \(refCode && targetUrl\.includes\('mercor'\)\) \{ if\(\!targetUrl\.includes\('ref='\)\) targetUrl \+= \(targetUrl\.includes\('\?'\) \? '&' : '\?'\) \+ 'ref=' \+ encodeURIComponent\(refCode\); \} else if \(refCode && targetUrl\.includes\('micro1'\)\) \{ if \(\!targetUrl\.includes\('referralCode='\)\) targetUrl \+= \(targetUrl\.includes\('\?'\) \? '&' : '\?'\) \+ 'referralCode=' \+ encodeURIComponent\(refCode\); \} window\.open\(targetUrl, '_blank'\)\""

new_str = "onclick=\"window.handleApplyClick('${safeTitle}', '${role.linkTarget || 'https://t.mercor.com/wbPMF'}', this)\""

content = re.sub(old_str, new_str, content)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
