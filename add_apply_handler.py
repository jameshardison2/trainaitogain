import re

handler_script = """
<script>
window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    let targetUrl = linkTarget || 'https://t.mercor.com/wbPMF';
    
    // Append tracking
    if (refCode && targetUrl.includes('mercor')) {
        if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode);
    } else if (refCode && targetUrl.includes('micro1')) {
        if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode);
    }

    // Check if it's a generic link
    const isGenericMercor = targetUrl.includes('wbPMF');
    
    if (isGenericMercor) {
        // Fallback for clipboard api failing (e.g. not over HTTPS in some browsers)
        const fallbackOpen = () => window.open(targetUrl, '_blank');
        
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            fallbackOpen();
            return;
        }

        navigator.clipboard.writeText(title).then(() => {
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '24px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = '#10b981';
            toast.style.color = 'white';
            toast.style.padding = '16px 24px';
            toast.style.borderRadius = '12px';
            toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            toast.style.zIndex = '9999999';
            toast.style.fontWeight = '700';
            toast.style.textAlign = 'center';
            toast.innerHTML = '📋 Job Title copied to clipboard!<br><span style="font-size:14px; font-weight:400; opacity:0.9; margin-top:6px; display:block;">Paste it into the search bar when the portal opens.</span>';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.transition = 'opacity 0.5s';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, 5000);
            
            // Open window slightly after
            setTimeout(fallbackOpen, 600);
        }).catch(err => {
            fallbackOpen();
        });
    } else {
        window.open(targetUrl, '_blank');
    }
};
</script>
</body>
"""

for filename in ['apply.html', 'saved-roles.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "window.handleApplyClick" not in content:
        content = content.replace('</body>', handler_script)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

