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
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7Z54KYTV6B');
      window.currentApplySource = 'unknown';
      function openApplyModal(source, link) {
        window.currentApplySource = source;
        window.currentApplyLink = link || "https://t.mercor.com/wbPMF";
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            window.open(window.currentApplyLink, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }
      function closeApplyModal() {
        var modal = document.getElementById('applyModal');
        modal.style.display = 'none';
        document.getElementById('modalApplyBtn').innerHTML = 'Join Newsletter & Continue to Application ➔';
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
            
            // UC-14: Network Drop Webhook Sync
            if (!navigator.onLine) {
                let cache = JSON.parse(localStorage.getItem('offline_webhook_sync') || '[]');
                cache.push({ firstName: nameInput || 'Applicant', email: emailInput, source: window.location.href + ' (Apply Modal Offline)', referred_by: refCode, status: 'Application Started' });
                localStorage.setItem('offline_webhook_sync', JSON.stringify(cache));
                alert('Connection dropped. Your application has been cached locally and will automatically sync when network is restored.');
            } else {
                await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started' // They are applying right now
            });
            } // Close navigator.onLine else block
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');
            
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':window.currentApplySource});
            
            var targetUrl = window.currentApplyLink || "https://t.mercor.com/wbPMF";
            window.open(targetUrl, '_blank');
            closeApplyModal();
            
        } catch (err) {
            console.error(err);
            localStorage.setItem('hasEnteredEmailForApply', 'true'); // Even if db fails, don't ask again
            var targetUrl = window.currentApplyLink || "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
            window.open(targetUrl, '_blank');
            closeApplyModal();
        }
      }
      const uploadZone = document.getElementById('aws-upload-zone');
      const fileInput = document.getElementById('aws-file-input');
      const statusDiv = document.getElementById('aws-upload-status');
      const statusText = document.getElementById('aws-status-text');
      const matchedSection = document.getElementById('matched-roles-section');
      const matchedTrack = document.getElementById('matched-waves-track');
      
      
      // uploadZone click removed for mobile

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // UC-11: Resume Upload Size Limit (Prevent 25MB Serverless Timeouts)
        if (file.size > 20 * 1024 * 1024) {
            alert("Upload Error: File payload exceeds maximum size limit (20MB). This causes serverless function timeouts. Please compress your PDF and try again.");
            e.target.value = '';
            return;
        }

        uploadZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusDiv.style.animation = 'pulse-bg 2s infinite';
        statusDiv.style.borderColor = 'var(--primary)';
        statusDiv.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; gap:16px;">
          <div class="loading-spinner"></div>
          <span id="aws-status-text">📄 Securely reading your resume...</span>
        </div>`;
        const statusText = document.getElementById('aws-status-text');

        try {
          // 1. Extract Text
          const arrayBuffer = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = e => resolve(e.target.result);
              reader.onerror = e => reject(new Error("File read failed"));
              reader.readAsArrayBuffer(file);
          });
          let resumeText = "";
          if (file.name.toLowerCase().endsWith('.docx')) {
              const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
              resumeText = result.value;
          } else {
              const pdf = await pdfjsLib.getDocument({data: new Uint8Array(arrayBuffer)}).promise;
              for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  resumeText += textContent.items.map(item => item.str).join(" ") + "\n";
              }
          }
          
          statusText.innerHTML = '🔄 Scanning active network pipelines...';
          
          // 2. Fetch active roles
          const response = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=12');
          const waves = await response.json();
          window.wavesData = waves.roles || waves; // Save for mapping later
          const roleList = (window.wavesData).map(w => ({ name: w.title, rate: w.hourlyRate || w.pay, url: w.applyUrl || w.linkTarget }));
          
          statusText.innerHTML = '⚡ TrainAIToGain matching engine is analyzing your experience...';
          
          // 3. Prompt Gemini OR Check Cache
          let matches = null;
          const cachedMatchesStr = sessionStorage.getItem('ai_matches');
          const cachedResume = sessionStorage.getItem('ai_matches_resume');
          
          if (cachedMatchesStr && cachedResume === resumeText) {
              try {
                  const parsedCache = JSON.parse(cachedMatchesStr);
                  // Ensure format is correct for apply.html
                  if (parsedCache && parsedCache.length > 0 && parsedCache[0].explanation) {
                      matches = parsedCache;
                  }
              } catch(e) { console.error("Cache parse error", e); }
          }
          
          if (!matches) {
              const prompt = `You are an expert technical recruiter for Mercor. I will provide a candidate's resume and a JSON list of open job roles.
              Analyze the candidate's experience and find the top 3 best matching roles for them. 
              Return ONLY a raw JSON array of objects (no markdown, no backticks), where each object has:
              'roleName' (exact match from the list), 'matchScore' (integer 0-100), and 'explanation' (1-2 sentences highly personalized explaining why their specific past experience is a fit).
              
              ROLES:
              ${JSON.stringify(roleList)}
              
              RESUME:
              ${resumeText.substring(0, 10000)}`;

              const aiResponse = await fetch('/api/generateAiResponse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.1 }
                })
              });
              
              const aiData = await aiResponse.json();
              if (!aiData.candidates || aiData.candidates.length === 0) {
                  console.error("AI Error:", aiData);
                  statusDiv.style.animation = 'none';
                  statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Scanner Offline: Our AI provider is currently experiencing high load. Please browse and apply to the roles manually below.</span>';
                  return;
              }
              let aiText = aiData.candidates[0].content.parts[0].text;
              aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
              matches = JSON.parse(aiText);
          }
          
          // Merge with rate/url
          matches.forEach(m => {
             const matchedRole = roleList.find(r => r.name === m.roleName);
             if (matchedRole) {
                 m.hourlyRate = matchedRole.rate;
                 m.roleUrl = matchedRole.url;
             }
          });
          
          statusDiv.style.animation = 'none';
          statusDiv.innerHTML = '<span style="color:var(--primary); font-weight:700;">✅ AI Analysis Complete! Found your best matches.</span>';
          
          
          // Save to session storage so it persists if they reload
          sessionStorage.setItem('ai_matches_resume', resumeText);
          sessionStorage.setItem('ai_matches', JSON.stringify(matches));
          
          // 4. Render!

          matchedSection.style.display = 'block';
          // Find the actual role objects in wavesData to ensure real URLs
          let realMatches = matches.map(m => {
              let realRole = (window.wavesData || []).find(w => w.title.toLowerCase().includes(m.roleName.toLowerCase()) || m.roleName.toLowerCase().includes(w.title.toLowerCase()));
              if (realRole) {
                  m.roleUrl = realRole.linkTarget || m.roleUrl;
                  m.hourlyRate = realRole.pay || m.hourlyRate;
                  m.domainFilter = realRole.domain || m.domainFilter;
              }
              return m;
          });

          matchedTrack.innerHTML = realMatches.map(m => {
            const safeTitle = m.roleName.replace(/'/g, "\'");
            const safeDomain = (m.domainFilter || 'ALL').replace(/'/g, "\'");
            const safePay = (m.hourlyRate || 'Market Rate').replace(/'/g, "\'");
            const safeUrl = (m.roleUrl || 'https://t.mercor.com/wbPMF').replace(/'/g, "\'");
            
            return `
            <div class="feature-card opp-card" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--accent); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-orange); text-align: left;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; gap:8px;">
                 <div style="display:flex; gap:8px; flex-wrap:wrap; flex:1;">
                   <div style="padding:6px 10px; background:var(--primary-light); color:var(--primary-dark); border-radius:6px; font-size:11px; font-weight:800; letter-spacing:0.05em; white-space:nowrap;">${m.matchScore}% Match</div>
                 </div>
                 <div style="color:var(--accent); font-weight:900; font-size:18px; text-align:right; white-space:nowrap; flex-shrink:0;">${m.hourlyRate || 'Market Rate'}</div>
              </div>
              <h3 style="font-size:18px; margin-bottom:20px; color:var(--black); line-height:1.2; font-weight:800; flex-grow:0;">${m.roleName}</h3>
              <p style="font-size:14px; color:var(--gray-600); line-height:1.6; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
              
              <div style="display:flex; gap:8px;">
                <button type="button" onclick="window.handleApplyClick('${safeTitle}', '${safeUrl}', this)" style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';">Apply Now</button>
                
                <button type="button" title="Save role to dashboard" onclick="if(window.saveRole) window.saveRole('${safeTitle}', '${safeDomain}', '${safePay}', '${safeUrl}'); else alert('Saved!');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg></button>
                
                <button type="button" title="Mark as Applied / Completed" onclick="if(window.markAsComplete) window.markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this); else alert('Marked Complete!');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></button>
                
                <button type="button" title="Scan my resume to see if it matches this job" onclick="window.open('resume-ats-guide.html?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></button>
              </div>
            </div>
            `;
          }).join('');
          
          // Save persistence
          localStorage.setItem('saved_ai_matches_html', matchedTrack.innerHTML);
          
          // Scroll to results
          setTimeout(() => matchedSection.scrollIntoView({behavior: 'smooth', block: 'start'}), 100);

        } catch (error) {
          console.error("Analysis Error:", error);
          statusDiv.style.animation = 'none';
          statusDiv.style.borderColor = '#ef4444';
          statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please screenshot this exact text and send it to your developer.</span>';
          setTimeout(() => {
              statusDiv.style.display = 'none';
              uploadZone.style.display = 'flex';
          }, 3000);
        }
      });
      (function() {
        var ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) localStorage.setItem('affiliate_ref', ref);
      })();

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
  document.addEventListener('DOMContentLoaded', () => {
    let exitIntentTriggered = false;
    
    function triggerPopup() {
      if (!exitIntentTriggered && !localStorage.getItem('exitIntentShown')) {
        document.getElementById('exit-intent-modal').style.display = 'flex';
        exitIntentTriggered = true;
        localStorage.setItem('exitIntentShown', 'true');
      }
    }

    // Desktop: Mouse leaves top of screen
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0) triggerPopup();
    });

    // Mobile: Rapid scroll up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      let scrollSpeed = lastScrollY - window.scrollY;
      lastScrollY = window.scrollY;
      // If they scroll up more than 80px instantly, trigger popup
      if (scrollSpeed > 80 && window.scrollY < 200) {
        triggerPopup();
      }
    }, {passive: true});
  });
      // Automatically restore AI matches if they navigate away and come back
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
function markAsComplete(title, domain, pay, btn) {
    let completed = JSON.parse(localStorage.getItem('completedRoles')) || [];
    const roleId = title + domain;
    if (!completed.some(r => r.id === roleId)) {
        completed.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
        localStorage.setItem('completedRoles', JSON.stringify(completed));
    }
    if (btn) {
        const card = btn.closest('div[style*="min-width: 320px"]');
        if (card) {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.98)';
        }
        btn.innerHTML = '✓';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
        btn.style.borderColor = '#10b981';
    }
}
function saveRole(title, domain, pay, linkTarget) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, linkTarget: linkTarget, date: new Date().toISOString() });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        alert('Role saved! You can view it in the Dashboard in the top menu.');
    } else {
        alert('Role is already in your Pipeline Dashboard.');
    }
}
  document.addEventListener('DOMContentLoaded', () => {
    const staticCards = document.querySelectorAll('.opp-card');
    staticCards.forEach(card => {
      // Don't add to dynamically generated waves, they have their own save buttons now
      if (card.closest('#carousel-software') || card.closest('.container > div > div > .opp-card')) {
        // dynamic cards handled differently
      }
      
      const applyBtn = card.querySelector('button[onclick*="Apply Now"], button[onclick*="window.open"]');
      if (applyBtn && !card.querySelector('button[onclick*="saveRole"]')) {
        const titleEl = card.querySelector('h3');
        const payEl = card.querySelector('div[style*="font-size:18px"]');
        const domainEl = card.querySelector('div[style*="letter-spacing:0.05em"]');
        
        if (titleEl && payEl && domainEl) {
          let title = Array.from(titleEl.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent)
            .join('').trim();
          let pay = payEl.textContent.trim();
          let domain = domainEl.textContent.trim().toLowerCase();
          
          const saveBtn = document.createElement('button');
          saveBtn.innerHTML = '💾';
          saveBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;';
          saveBtn.onmouseover = () => { saveBtn.style.background = 'var(--primary-light)'; saveBtn.style.color = 'var(--primary-dark)'; };
          saveBtn.onmouseout = () => { saveBtn.style.background = 'var(--gray-100)'; saveBtn.style.color = 'var(--gray-700)'; };
          saveBtn.onclick = () => saveRole(title, domain, pay, null);
          
          applyBtn.parentNode.insertBefore(saveBtn, applyBtn.nextSibling);

          const compBtn = document.createElement('button');
          compBtn.innerHTML = '✅';
          compBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s; margin-left:8px;';
          compBtn.onmouseover = () => { compBtn.style.background = 'var(--primary-light)'; compBtn.style.color = 'var(--primary-dark)'; };
          compBtn.onmouseout = () => { compBtn.style.background = 'var(--gray-100)'; compBtn.style.color = 'var(--gray-700)'; };
          compBtn.onclick = () => markAsComplete(title, domain, pay);
          
          const matchBtn = document.createElement('button');
          matchBtn.innerHTML = '🎯';
          matchBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s; margin-left:8px;';
          matchBtn.onmouseover = () => { matchBtn.style.background = 'var(--primary-light)'; matchBtn.style.color = 'var(--primary-dark)'; };
          matchBtn.onmouseout = () => { matchBtn.style.background = 'var(--gray-100)'; matchBtn.style.color = 'var(--gray-700)'; };
          matchBtn.onclick = () => window.open('resume-ats-guide?role=' + encodeURIComponent(title), '_blank');

          saveBtn.parentNode.insertBefore(compBtn, saveBtn.nextSibling);
          compBtn.parentNode.insertBefore(matchBtn, compBtn.nextSibling);

        }
      }
    });
  });
