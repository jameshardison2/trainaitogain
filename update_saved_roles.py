import re

with open('saved-roles.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = r"onclick=\"const refCode = localStorage\.getItem\('affiliate_ref'\); let targetUrl = '\$\{role\.linkTarget \|\| 'https://t\.mercor\.com/wbPMF'\}'; if \(refCode && targetUrl\.includes\('mercor'\)\) \{ if\(\!targetUrl\.includes\('ref='\)\) targetUrl \+= \(targetUrl\.includes\('\?'\) \? '&' : '\?'\) \+ 'ref=' \+ encodeURIComponent\(refCode\); \} else if \(refCode && targetUrl\.includes\('micro1'\)\) \{ if \(\!targetUrl\.includes\('referralCode='\)\) targetUrl \+= \(targetUrl\.includes\('\?'\) \? '&' : '\?'\) \+ 'referralCode=' \+ encodeURIComponent\(refCode\); \} window\.open\(targetUrl, '_blank'\)\""

new_str = "onclick=\"window.handleApplyClick('${role.title.replace(`'`, `\\\\'`)}', '${role.linkTarget}', this)\""

content = re.sub(old_str, new_str, content)

with open('saved-roles.html', 'w', encoding='utf-8') as f:
    f.write(content)
