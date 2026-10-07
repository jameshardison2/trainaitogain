    function loadGA() {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-7Z54KYTV6B";
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7Z54KYTV6B');
    }
      window.currentApplySource = 'unknown';
      function openApplyModal(source) {
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
      }
      function closeApplyModal() {
        var modal = document.getElementById('applyModal');
        modal.style.display = 'none';
        document.getElementById('modalApplyBtn').innerHTML = 'Proceed to Application Portal ➔';
        document.getElementById('modalApplyBtn').disabled = false;
      }
      async function handleModalSubmit(e) {
        e.preventDefault();
        var emailInput = document.getElementById('applyModalEmail').value.trim();
        var nameInput = document.getElementById('applyModalName').value.trim();
        if (!emailInput) {
            alert('Please enter your email to proceed.');
            return;
        }
        
        var btn = document.getElementById('modalApplyBtn');
        btn.innerHTML = 'Routing...';
        localStorage.setItem('hasEnteredEmailForApply', 'true');
        btn.disabled = true;
        
        try {
            const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const { getApp, getApps, initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
            
            let app;
            if (!getApps().length) {
                app = initializeApp({ projectId: "trainaitogain-50c19" });
            } else {
                app = getApp();
            }
            const db = getFirestore(app);
            
            const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            
            await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started' // They are applying right now
            });
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');
            
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':window.currentApplySource});
            
            var targetUrl = "https://t.mercor.com/wbPMF";
            if (refCode) {
                targetUrl += "?ref=" + encodeURIComponent(refCode);
            }
            window.open(targetUrl, '_blank');
            closeApplyModal();
            
        } catch (err) {
            console.error(err);
            localStorage.setItem('hasEnteredEmailForApply', 'true'); // Even if db fails, don't ask again
            var targetUrl = "https://t.mercor.com/wbPMF";
            var refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            if (refCode) targetUrl += "?ref=" + encodeURIComponent(refCode);
            window.open(targetUrl, '_blank');
            closeApplyModal();
        }
      }
            document.getElementById('video-overlay').addEventListener('click', function() {
                this.style.opacity = '0';
                setTimeout(() => this.style.display = 'none', 300);
                document.getElementById('crash-course-video').play();
            });
      (function() {
        var ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) localStorage.setItem('affiliate_ref', ref);
      })();
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const myForm = e.target;
        const formData = new FormData(myForm);
        const submitBtn = myForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Submitting...';
      localStorage.setItem('hasEnteredEmailForApply', 'true');
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        let actionUrl = '';
        const payload = new URLSearchParams();

        if (myForm.name === 'lead-magnet') {
          // Instantly webhook
          actionUrl = 'https://script.google.com/macros/s/AKfycbymXTe1ePaiA33w_q1DnCrixUi_ZiFbWxFXL7bBCKP-Z-hvyI_EyKPyajSaB1oqPltS2Q/exec';
          payload.append('firstName', formData.get('firstName'));
          payload.append('email', formData.get('email'));

          // Fire Google Analytics Conversion Event if GA is loaded
          if(typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              'event_category': 'lead_magnet',
              'event_label': 'Companion_Guide'
            });
          }

          // Trigger confetti if available
          if(typeof confetti === 'function') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

          // Submit to webhook
          fetch(actionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: formData.get('firstName') || '',
              email: formData.get('email') || '',
              source: 'Application Companion Guide'
            })
          }).catch(e => console.log('Webhook error', e));

          // Replace form with permanent success message and clickable links
          setTimeout(() => {
            if (myForm.parentElement) {
              myForm.parentElement.innerHTML = `
                <div style="text-align:center; padding: 20px 0;">
                  <div style="width:64px; height:64px; background:#10b981; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; margin: 0 auto 24px;">✓</div>
                  <h3 style="font-size:24px; font-weight:800; color:#111827; margin-bottom:12px;">Success!</h3>
                  <p style="color:#4b5563; font-size:16px; margin-bottom:32px; line-height:1.6;">We've also emailed you a backup copy.</p>
                  <a href="/hiring-blueprint.html" target="_blank" class="btn-primary" style="display:inline-block; width:100%; padding:16px; font-size:18px; text-decoration:none; margin-bottom:16px;">Access Blueprint Now ➔</a>
                </div>
              `;
            }
          }, 800);
          return;
        }
      });
    });

    // Consent Logic
    document.addEventListener("DOMContentLoaded", () => {
      if(!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
          document.getElementById('consent-banner').classList.add('show');
        }, 1000);
      } else if(localStorage.getItem('cookieConsent') === 'accepted') {
        loadGA();
      }
    });

    function acceptConsent() {
      localStorage.setItem('cookieConsent', 'accepted');
      document.getElementById('consent-banner').classList.remove('show');
      loadGA();
    }

    function declineConsent() {
      localStorage.setItem('cookieConsent', 'declined');
      document.getElementById('consent-banner').classList.remove('show');
    }
  // Global Affiliate Tracker
  (function() {
    var ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('affiliate_ref', ref);
    var activeRef = localStorage.getItem('affiliate_ref');
    if (activeRef) {
      document.addEventListener('DOMContentLoaded', function() {
        var links = document.querySelectorAll('a[href^="https://t.mercor.com"]');
        links.forEach(function(link) {
          try {
            var url = new URL(link.href);
            url.searchParams.set('ref', activeRef);
            link.href = url.toString();
          } catch(e) {}
        });
      });
    }
  })();
function openNavbarLeadModal(e) {
  e.preventDefault();
  document.getElementById('navbarLeadModal').style.display = 'flex';
}
function closeNavbarLeadModal() {
  document.getElementById('navbarLeadModal').style.display = 'none';
}
function submitNavbarLead(e) {
  e.preventDefault();
  var btn = document.getElementById('navbarLeadBtn');
  var name = document.getElementById('navbarLeadName').value;
  var email = document.getElementById('navbarLeadEmail').value.trim();
  
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  
  btn.innerHTML = 'Sending...';
  localStorage.setItem('hasEnteredEmailForBlueprint', 'true');
  btn.style.opacity = '0.7';
  btn.disabled = true;

  fetch('https://script.google.com/macros/s/AKfycbymXTe1ePaiA33w_q1DnCrixUi_ZiFbWxFXL7bBCKP-Z-hvyI_EyKPyajSaB1oqPltS2Q/exec', {
    method: 'POST',
    body: JSON.stringify({ firstName: name, email: email, source: 'Navbar Popup Form' })
  }).catch(e => console.error(e));

  setTimeout(function() {
    window.location.href = 'hiring-blueprint.html';
  }, 1000);
}
