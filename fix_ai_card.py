import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the instructions div
instructions_regex = re.compile(r'<div style="background: var\(--gray-50\); border: 1px dashed var\(--gray-300\);.*?</div>', re.DOTALL)
content = instructions_regex.sub('', content)

# 2. Fix the Apply button
old_button = """<button type="button" onclick="window.open('${m.roleUrl}' + (localStorage.getItem('affiliate_ref') ? '&ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')\""""
new_button = """<button type="button" onclick="const refCode = localStorage.getItem('affiliate_ref'); let targetUrl = '${m.roleUrl}'; if (refCode && targetUrl.includes('mercor')) { if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode); } else if (refCode && targetUrl.includes('micro1')) { if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode); } window.open(targetUrl, '_blank')\""""
content = content.replace(old_button, new_button)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)

