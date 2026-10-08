import re

with open('apply.html', 'r') as f:
    html = f.read()

new_logic = """window.handleApplyClick = function(title, linkTarget, btn) {
    if (!linkTarget || linkTarget === '#' || linkTarget === 'undefined' || linkTarget.includes('apply.html')) {
        linkTarget = 'https://t.mercor.com/wbPMF';
    }
    
    try {
        var activeRef = localStorage.getItem('affiliate_ref');
        if (activeRef && linkTarget.startsWith('https://t.mercor.com')) {
            var url = new URL(linkTarget);
            url.searchParams.set('ref', activeRef);
            linkTarget = url.toString();
        }
    } catch(e) {
        console.error("Error appending ref:", e);
    }
    
    if(typeof gtag === 'function') {
        gtag('event', 'apply_click', { link_name: title, destination: linkTarget });
    }
    
    window.open(linkTarget, '_blank');
};"""

html = re.sub(r'window\.handleApplyClick = function.*?window\.open\(linkTarget, \'_blank\'\);\n};', new_logic, html, flags=re.DOTALL)

with open('apply.html', 'w') as f:
    f.write(html)
