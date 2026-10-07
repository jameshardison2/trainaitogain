import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Replace loadFunnelTemplate's applyUrl
old_funnel_url = r"const applyUrl = `https://trainaitogain.com/apply\$\{affiliateRef \? '\?ref='\+affiliateRef : ''\}`;"
new_funnel_url = r"const applyUrl = `https://trainaitogain.com/apply?prematch=${c ? c.domain : 'MEDICAL'}${affiliateRef ? '&ref='+affiliateRef : ''}`;"
content = re.sub(old_funnel_url, new_funnel_url, content)

# Replace generateDeepAIPitch's applyUrl
# Wait, let's see how it's defined:
# const applyUrl = affiliateRef ? `https://trainaitogain.com/apply?ref=${affiliateRef}` : `https://trainaitogain.com/apply`;
old_pitch_url = r"const applyUrl = affiliateRef \? `https://trainaitogain.com/apply\?ref=\$\{affiliateRef\}` : `https://trainaitogain.com/apply`;"
new_pitch_url = r"const applyUrl = `https://trainaitogain.com/apply?prematch=${c ? c.domain : 'MEDICAL'}${affiliateRef ? '&ref='+affiliateRef : ''}`;"
content = re.sub(old_pitch_url, new_pitch_url, content)

# Update the template default as well
# 1. Direct Role Match: View your matched active positions at https://trainaitogain.com/apply
old_msg = r"1\. Direct Role Match: View your matched active positions at https://trainaitogain\.com/apply"
new_msg = r"1. Direct Role Match: View your matched active positions at ${applyUrl}"
content = re.sub(old_msg, new_msg, content)

with open('outreach-tool.html', 'w') as f:
    f.write(content)

print("Updated outreach URLs")
