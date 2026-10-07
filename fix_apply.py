with open('saved-roles.html', 'r') as f:
    content = f.read()

bad_logic = """window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    let targetUrl = linkTarget || 'https://t.mercor.com/wbPMF';"""

good_logic = """window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    let targetUrl = linkTarget;
    if (!targetUrl || targetUrl === 'undefined' || targetUrl === 'null' || targetUrl === '') {
        targetUrl = 'https://t.mercor.com/wbPMF';
    }"""

content = content.replace(bad_logic, good_logic)

with open('saved-roles.html', 'w') as f:
    f.write(content)
print("applied fix to saved-roles")
