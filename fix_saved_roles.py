import re

with open('saved-roles.html', 'r') as f:
    html = f.read()

new_logic = """window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    
    // Fix linkTarget if it accidentally points to apply.html
    if (linkTarget && linkTarget.includes('apply.html')) {
        linkTarget = 'https://t.mercor.com/wbPMF';
    }
    
    let targetUrl = linkTarget || 'https://t.mercor.com/wbPMF';
    
    // Append tracking
    if (refCode && targetUrl.includes('mercor')) {
        if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode);
    } else if (refCode && targetUrl.includes('micro1')) {
        if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode);
    }"""

# We just replace the start of the function up to the tracking logic
html = re.sub(
    r'window\.handleApplyClick = function\(title, linkTarget, btn\) \{\n\s*const refCode.*?referralCode=\' \+ encodeURIComponent\(refCode\);\n\s*\}', 
    new_logic, 
    html, 
    flags=re.DOTALL
)

with open('saved-roles.html', 'w') as f:
    f.write(html)
