with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

old_modal_func = """      function openApplyModal(source) {
        window.currentApplySource = source;
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            var targetUrl = "https://t.mercor.com/wbPMF";
            if (ref) targetUrl += "?ref=" + encodeURIComponent(ref);
            window.open(targetUrl, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }"""

new_modal_func = """      function openApplyModal(source) {
        window.currentApplySource = source;
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            var targetUrl = localStorage.getItem('atsLinkTarget') || "https://t.mercor.com/wbPMF";
            if (ref && targetUrl === "https://t.mercor.com/wbPMF") targetUrl += "?ref=" + encodeURIComponent(ref);
            window.open(targetUrl, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }"""

content = content.replace(old_modal_func, new_modal_func)

old_submit = """            localStorage.setItem('hasEnteredEmailForApply', 'true');
            if(typeof gtag === 'function') gtag('event', 'apply_lead_captured', {'event_category':'lead', 'event_label':window.currentApplySource});
            
            var targetUrl = "https://t.mercor.com/wbPMF";
            if (refCode) targetUrl += "?ref=" + encodeURIComponent(refCode);
            window.open(targetUrl, '_blank');
            closeApplyModal();"""

new_submit = """            localStorage.setItem('hasEnteredEmailForApply', 'true');
            if(typeof gtag === 'function') gtag('event', 'apply_lead_captured', {'event_category':'lead', 'event_label':window.currentApplySource});
            
            var targetUrl = localStorage.getItem('atsLinkTarget') || "https://t.mercor.com/wbPMF";
            if (refCode && targetUrl === "https://t.mercor.com/wbPMF") targetUrl += "?ref=" + encodeURIComponent(refCode);
            window.open(targetUrl, '_blank');
            closeApplyModal();"""

content = content.replace(old_submit, new_submit)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("modal patched")
