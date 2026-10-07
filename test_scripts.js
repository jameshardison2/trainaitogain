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
            var targetUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
            if (ref) targetUrl += "&ref=" + encodeURIComponent(ref);
            window.open(targetUrl, '_blank');
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
            var targetUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
            var refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            if (refCode) targetUrl += "?ref=" + encodeURIComponent(refCode);
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
          const response = await fetch('waves.json');
          const waves = await response.json();
          const roleList = (waves.roles || waves).map(w => ({ name: w.title, rate: w.hourlyRate || w.pay, url: w.applyUrl || w.linkTarget }));
          
          statusText.innerHTML = '⚡ TrainAIToGain matching engine is analyzing your experience...';
          
          // 3. Prompt Gemini
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
          let aiText = aiData.candidates[0].content.parts[0].text;
          
          // Clean markdown backticks if present
          aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          const matches = JSON.parse(aiText);
          
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
          sessionStorage.setItem('ai_matches', JSON.stringify(matches));
          
          // 4. Render!

          matchedSection.style.display = 'block';
          matchedTrack.innerHTML = matches.map(m => `
            <div class="wave-card" style="width: 100%; max-width: 600px; text-align: left; background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; align-items:flex-start;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; width:100%;">
                 <span style="background:var(--primary-light); color:var(--primary-dark); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px;">${m.matchScore}% Match</span>
                 <span style="color:var(--gray-500); font-weight:700; font-size:14px;">${m.hourlyRate || 'Market Rate'}</span>
              </div>
              <h3 style="font-size:18px; font-weight:800; color:var(--black); margin-bottom:12px; line-height:1.3;">${m.roleName}</h3>
              <p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
              
                    
                    <div style="display:flex; gap:8px; width:100%;">
                      <button type="button" onclick="const refCode = localStorage.getItem('affiliate_ref'); let targetUrl = '${m.roleUrl}'; if (refCode && targetUrl.includes('mercor')) { if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode); } else if (refCode && targetUrl.includes('micro1')) { if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode); } window.open(targetUrl, '_blank')" style="flex:1; background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>
                      <button type="button" onclick="saveRole('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
                      <button type="button" onclick="markAsComplete('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>
                      <button type="button" onclick="window.open('resume-ats-guide?role=' + encodeURIComponent('${m.roleName.replace(/'/g, "\\'")}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>
                    </div>
            </div>
          `).join('');
          
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
    document.getElementById('navbarLeadModalContent').innerHTML = `
      <div style="text-align:center;">
        <div style="width:64px; height:64px; background:#10b981; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 16px;">✓</div>
        <h3 style="font-size:22px; font-weight:800; color:#111827; margin-bottom:8px;">Success!</h3>
        <p style="color:#4b5563; font-size:14px; margin-bottom:24px;">Your guide has been unlocked.</p>
        <a href="hiring-blueprint.html" style="display:block; background:#10b981; color:white; text-decoration:none; padding:16px; font-size:16px; font-weight:700; border-radius:8px; width:100%; box-sizing:border-box;">View Blueprint Now ➔</a>
      </div>
    `;
  }, 1000);
}
function markAsComplete(title, domain, pay) {
    let completed = JSON.parse(localStorage.getItem('completedRoles')) || [];
    const roleId = title + domain;
    if (!completed.some(r => r.id === roleId)) {
        completed.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
        localStorage.setItem('completedRoles', JSON.stringify(completed));
        alert('Role marked as Complete!');
    } else {
        alert('Role is already marked as Complete.');
    }
}
function saveRole(title, domain, pay) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
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
          saveBtn.onclick = () => saveRole(title, domain, pay);
          
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
