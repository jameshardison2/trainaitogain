    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7Z54KYTV6B');
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
      (function() {
        var ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) localStorage.setItem('affiliate_ref', ref);
      })();

function parsePayToNum(payStr) {
    if(!payStr) return 0;
    let matches = payStr.match(/\$(\d+)/);
    if(matches && matches[1]) return parseInt(matches[1]);
    return 0;
}

function updateAnalytics(saved) {
    document.getElementById('stat-count').innerText = saved.length;
    let totalPay = 0;
    let payCount = 0;
    let stats = { 'Saved': 0, 'ATS Scanned': 0, 'Applied': 0, 'Interviewing': 0 };
    
    saved.forEach(role => {
        let p = parsePayToNum(role.pay);
        if(p > 0) { totalPay += p; payCount++; }
        
        let s = role.status || 'Saved';
        if(stats[s] !== undefined) stats[s]++;
        else stats['Saved']++;
    });
    
    document.getElementById('stat-pay').innerText = payCount > 0 ? `$${Math.round(totalPay/payCount)}/hr` : 'N/A';
    
    let total = saved.length || 1; 
    let scannedCount = stats['ATS Scanned'] + stats['Applied'] + stats['Interviewing'];
    let appliedCount = stats['Applied'] + stats['Interviewing'];
    
    document.getElementById('bar-saved').style.width = '100%';
    document.getElementById('bar-scanned').style.width = (scannedCount / total * 100) + '%';
    document.getElementById('bar-applied').style.width = (appliedCount / total * 100) + '%';
}

function changeRoleStatus(id, newStatus) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    let role = saved.find(r => r.id === id);
    if(role) {
        role.status = newStatus;
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        updateAnalytics(saved);
        
        let card = document.getElementById('card-'+id);
        if(card) {
            if(newStatus === 'Applied' || newStatus === 'Interviewing') {
                card.style.border = '2px solid var(--accent)';
            } else {
                card.style.border = '1px solid var(--gray-200)';
            }
        }
    }
}

function runMatchScore(btn, id) {
    btn.innerHTML = '<span class="loader"></span> Scanning...';
    btn.disabled = true;
    setTimeout(() => {
        let score = Math.floor(Math.random() * 20) + 78; 
        btn.innerHTML = `🎯 Match: ${score}%`;
        btn.style.background = 'var(--primary-light)';
        btn.style.color = 'var(--primary-dark)';
        btn.style.borderColor = 'var(--primary)';
        
        let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
        let role = saved.find(r => r.id === id);
        if(role && (!role.status || role.status === 'Saved')) {
            role.status = 'ATS Scanned';
            localStorage.setItem('savedRoles', JSON.stringify(saved));
            
            let sel = document.getElementById('status-'+id);
            if(sel) sel.value = 'ATS Scanned';
            updateAnalytics(saved);
        }
    }, 1200);
}

function toggleReminder(btn) {
    let isOn = btn.getAttribute('data-on') === 'true';
    if(isOn) {
        btn.setAttribute('data-on', 'false');
        btn.style.color = 'var(--gray-400)';
        btn.innerHTML = '🔔 Set Reminder';
    } else {
        btn.setAttribute('data-on', 'true');
        btn.style.color = 'var(--accent)';
        btn.innerHTML = '⏰ Reminder Active';
    }
}

function getDaysActive(dateString) {
    if(!dateString) return 0;
    let savedDate = new Date(dateString);
    let today = new Date();
    let diff = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24));
    return diff;
}

function renderSavedRoles() {
    const container = document.getElementById('saved-roles-container');
    const saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    
    if (saved.length === 0) {
        document.getElementById('analytics-bar').style.display = 'none';
        container.innerHTML = `
            <div style="text-align:center; padding:48px; background:var(--white); border:1px dashed var(--gray-300); border-radius:var(--radius-lg); color:var(--gray-500);">
                <div style="font-size:32px; margin-bottom:16px;">📂</div>
                <h3 style="font-size:20px; color:var(--black); margin-bottom:8px;">No pipelines saved yet.</h3>
                <p style="margin-bottom:24px;">Browse the opportunities index and bookmark roles to track them here.</p>
                <a href="apply.html" class="btn-primary" style="display:inline-block; padding:12px 24px;">Browse Roles ➔</a>
            </div>
        `;
        return;
    }
    
    document.getElementById('analytics-bar').style.display = 'flex';
    updateAnalytics(saved);
    
    container.innerHTML = saved.map(role => {
        let currentStatus = role.status || 'Saved';
        let borderStyle = (currentStatus === 'Applied' || currentStatus === 'Interviewing') ? '2px solid var(--accent)' : '1px solid var(--gray-200)';
        let days = getDaysActive(role.date);
        let safeTitle = role.title.replace(/'/g, "\\'");
        
        return `
        <div id="card-${role.id}" style="background:var(--white); border:${borderStyle}; padding:24px; border-radius:var(--radius-lg); display:flex; flex-direction:column; box-shadow:var(--shadow-sm); gap:16px;">
            
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
                <div>
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="padding:4px 8px; background:var(--black); color:var(--white); border-radius:4px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.domain}</div>
                        <div style="font-size:12px; color:var(--gray-500); font-weight:600;">🕒 Active ${days === 0 ? 'Today' : days + ' days ago'}</div>
                    </div>
                    <h3 style="font-size:22px; font-weight:800; color:var(--black); margin-bottom:4px;">${role.title}</h3>
                    <div style="color:var(--primary); font-weight:800; font-size:18px;">${role.pay || 'Market Rate'}</div>
                </div>
                
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:12px;">
                    <select id="status-${role.id}" onchange="changeRoleStatus('${role.id}', this.value)" style="padding:8px 12px; border-radius:8px; border:1px solid var(--gray-300); font-family:var(--font); font-weight:600; font-size:13px; background:var(--gray-50); cursor:pointer;">
                        <option value="Saved" ${currentStatus === 'Saved' ? 'selected' : ''}>📌 Status: Saved</option>
                        <option value="ATS Scanned" ${currentStatus === 'ATS Scanned' ? 'selected' : ''}>🎯 Status: Resume Scanned</option>
                        <option value="Applied" ${currentStatus === 'Applied' ? 'selected' : ''}>✅ Status: Applied</option>
                        <option value="Interviewing" ${currentStatus === 'Interviewing' ? 'selected' : ''}>🎙️ Status: Interviewing</option>
                    </select>
                    
                    <button onclick="toggleReminder(this)" data-on="false" style="background:transparent; border:none; font-size:12px; font-weight:600; color:var(--gray-400); cursor:pointer; padding:0; transition:color 0.2s;">🔔 Set Reminder</button>
                </div>
            </div>
            
            <div style="display:flex; gap:12px; flex-wrap:wrap; border-top:1px solid var(--gray-100); padding-top:16px;">
                <button onclick="runMatchScore(this, '${role.id}')" style="flex:1; background:var(--white); border:1px solid var(--gray-300); color:var(--gray-700); font-weight:600; padding:10px; border-radius:8px; cursor:pointer; font-size:14px; transition:all 0.2s; min-width:180px;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='var(--white)'">Check Match vs This Role</button>
                
                <a href="ai-interview.html?role=${encodeURIComponent(role.title)}" target="_blank" style="flex:1; background:var(--primary); color:white; font-weight:700; padding:10px; border-radius:8px; text-decoration:none; text-align:center; font-size:14px; transition:all 0.2s; min-width:180px;" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">Prep for This Role</a>
                
                <button class="btn-primary" style="flex:1; cursor:pointer; padding:10px; background:var(--accent); border-color:var(--accent); color:white; font-size:14px; min-width:180px; border-radius:8px;" onclick="window.handleApplyClick('${safeTitle}', '${role.linkTarget}', this)">Apply Now</button>
                
                <button onclick="removeRole('${role.id}')" style="background:transparent; border:none; padding:10px; color:var(--gray-400); cursor:pointer; font-size:14px; font-weight:600;" onmouseover="this.style.color='red'" onmouseout="this.style.color='var(--gray-400)'">✕</button>
            </div>
            
        </div>
        `;
    }).join('');
}

function clearSavedRoles() {
    if(confirm('Are you sure you want to clear your pipeline dashboard?')) {
        localStorage.removeItem('savedRoles');
        renderSavedRoles();
    }
}

function removeRole(id) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    saved = saved.filter(r => r.id !== id);
    localStorage.setItem('savedRoles', JSON.stringify(saved));
    renderSavedRoles();
}

// Run on load
document.addEventListener('DOMContentLoaded', renderSavedRoles);
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
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  
  btn.innerHTML = 'Sending...';
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
window.handleApplyClick = function(title, linkTarget, btn) {
    const refCode = localStorage.getItem('affiliate_ref');
    let targetUrl = linkTarget;
    if (!targetUrl || targetUrl === 'undefined' || targetUrl === 'null' || targetUrl === '') {
        targetUrl = 'https://t.mercor.com/wbPMF';
    }
    
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
