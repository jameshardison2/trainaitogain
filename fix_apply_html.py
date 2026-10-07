with open('apply.html', 'r') as f:
    content = f.read()

# Add handleApplyClick to the top or bottom of the script
script_start = "<script>"
new_script = """<script>
window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    let targetUrl = linkTarget;
    if (!targetUrl || targetUrl === 'undefined' || targetUrl === 'null' || targetUrl === '') {
        targetUrl = 'https://t.mercor.com/wbPMF';
    }
    
    if (refCode && targetUrl.includes('mercor')) {
        if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode);
    } else if (refCode && targetUrl.includes('micro1')) {
        if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode);
    }

    const isGenericMercor = targetUrl.includes('wbPMF');
    if (isGenericMercor) {
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
            setTimeout(fallbackOpen, 600);
        }).catch(err => {
            fallbackOpen();
        });
    } else {
        window.open(targetUrl, '_blank');
    }
};
"""
content = content.replace(script_start, new_script, 1)

with open('apply.html', 'w') as f:
    f.write(content)
print("apply.html patched")
