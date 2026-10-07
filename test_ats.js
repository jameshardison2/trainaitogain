
  <!-- Google tag (gtag.js) -->
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
            var targetUrl = localStorage.getItem('atsLinkTarget') || "https://t.mercor.com/wbPMF";
            if (ref && targetUrl === "https://t.mercor.com/wbPMF") targetUrl += "?ref=" + encodeURIComponent(ref);
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
            
            
            const targetRole = localStorage.getItem('atsRole') || 'Unspecified Role';
            
            await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started', // They are applying right now
              target_role: targetRole
            });
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');
            
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':window.currentApplySource});
            
            var baseTargetUrl = localStorage.getItem('atsLinkTarget') || "https://t.mercor.com/wbPMF";
            var targetUrl = baseTargetUrl;
            
            if (refCode && targetUrl.includes('mercor')) {
                if(!targetUrl.includes('ref=')) {
                    targetUrl += (targetUrl.includes('?') ? '&' : '?') + "ref=" + encodeURIComponent(refCode);
                }
            } else if (refCode && targetUrl.includes('micro1')) {
                if (!targetUrl.includes('referralCode=')) {
                    targetUrl += (targetUrl.includes('?') ? '&' : '?') + "referralCode=" + encodeURIComponent(refCode);
                }
            }
            window.open(targetUrl, '_blank');
            closeApplyModal();
            
        } catch (err) {
            console.error(err);
            localStorage.setItem('hasEnteredEmailForApply', 'true'); // Even if db fails, don't ask again
            var refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            var baseTargetUrl = localStorage.getItem('atsLinkTarget') || "https://t.mercor.com/wbPMF";
            var targetUrl = baseTargetUrl;
            
            if (refCode && targetUrl.includes('mercor')) {
                if(!targetUrl.includes('ref=')) {
                    targetUrl += (targetUrl.includes('?') ? '&' : '?') + "ref=" + encodeURIComponent(refCode);
                }
            } else if (refCode && targetUrl.includes('micro1')) {
                if (!targetUrl.includes('referralCode=')) {
                    targetUrl += (targetUrl.includes('?') ? '&' : '?') + "referralCode=" + encodeURIComponent(refCode);
                }
            }
            window.open(targetUrl, '_blank');
            closeApplyModal();
        }
      }
      (function() {
        var ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) localStorage.setItem('affiliate_ref', ref);
      })();

  let jobDescriptions = {};
  let keywordSets = {}; window.keywordSets = keywordSets;
  let resumePlaceholders = {};
  let previousScore = null;

  document.addEventListener('DOMContentLoaded', async function() {
    const roleSelect = document.getElementById('role-select');

    // AUTO-LOAD SAVED RESUME
    const savedResume = localStorage.getItem('candidateResumeText');
    if (savedResume && savedResume.length > 50) {
        const resumeBox = document.getElementById('resume-text');
        resumeBox.value = savedResume;
        
        const uploadZone = document.getElementById('ats-upload-zone');
        if (uploadZone) uploadZone.style.display = 'none';
        const divider = document.getElementById('paste-text-divider');
        if(divider) divider.style.display = 'none';
        
        const labelEl = document.getElementById('resume-label');
        if (labelEl) {
            labelEl.innerHTML = '1. ✅ Resume Loaded from Memory';
        }
        
        // Hide the ugly textarea
        resumeBox.style.display = 'none';
        
        // Create the sleek File Card
        const fileCard = document.createElement('div');
        fileCard.className = 'ats-file-card';
        fileCard.style.padding = '16px';
        fileCard.style.border = '1px solid var(--gray-200)';
        fileCard.style.borderRadius = 'var(--radius-sm)';
        fileCard.style.background = 'var(--white)';
        fileCard.style.display = 'flex';
        fileCard.style.alignItems = 'center';
        fileCard.style.justifyContent = 'space-between';
        fileCard.style.marginBottom = '8px';
        fileCard.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> 
            <span style="font-weight:600; color:var(--black);">saved_resume_profile.txt</span>
          </div>
        `;
        
        const secondaryActions = document.createElement('div');
        secondaryActions.className = 'ats-secondary-actions';
        secondaryActions.style.display = 'flex';
        secondaryActions.style.justifyContent = 'center';
        secondaryActions.style.marginBottom = '24px';
        secondaryActions.style.marginTop = '12px';
        secondaryActions.innerHTML = `
           <button type="button" id="btn-replace-file" style="background:none; border:none; color:var(--gray-500); font-size:12px; font-weight:700; cursor:pointer; font-family:var(--font); display:flex; align-items:center; gap:4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload New Document
           </button>
        `;
        
        const injectContainer = document.getElementById('injected-file-container');
        if (injectContainer) {
            injectContainer.appendChild(fileCard);
            injectContainer.appendChild(secondaryActions);
        }
        
        // Reattach the replace logic for the newly created button
        setTimeout(() => {
            const replaceBtn = document.getElementById('btn-replace-file');
            if(replaceBtn) {
                replaceBtn.onclick = function() {
                  localStorage.removeItem('candidateResumeText');
                  if (injectContainer) injectContainer.innerHTML = '';
                  if (uploadZone) uploadZone.style.display = 'flex';
                  resumeBox.value = '';
                  if (divider) divider.style.display = 'block';
                  if(labelEl) labelEl.innerHTML = '1. Provide Your Resume:';
                  
                  // Also clear ATS stats
                  document.getElementById('meter-fill').style.width = '0%';
                  document.getElementById('score-text').innerHTML = '0%';
                  const scanBtn = document.getElementById('scan-btn');
                  if (scanBtn) {
                      scanBtn.innerText = 'Upload Resume to Scan';
                      scanBtn.disabled = true;
                      scanBtn.style.opacity = '0.5';
                  }
                };
            }
        }, 100);
        
        // Ensure scan button text is correct
        const scanBtn = document.getElementById('scan-btn');
        if (scanBtn) scanBtn.innerText = 'Scan Saved Resume';
        
        // AUTOMATICALLY TRIGGER AUTO-MATCH IN BACKGROUND!
        setTimeout(() => {
            const autoBtn = document.getElementById('btn-auto-match');
            if (autoBtn) autoBtn.click();
        }, 500);
    }

    const jobDescBox = document.getElementById('job-desc');
    const badge = document.getElementById('import-badge');
    
    // Fetch live data from waves.json
    try {
      const response = await fetch('waves.json?v=' + new Date().getTime());
      const data = await response.json();
      window.allRoles = data.roles;
      
      // Clear existing hardcoded options
      
      const customOptionsDiv = document.getElementById('custom-role-options');
      const customDisplayText = document.getElementById('custom-role-text');
      const customDisplay = document.getElementById('custom-role-display');
      const hiddenInput = document.getElementById('role-select');
      
      customOptionsDiv.innerHTML = '';
      
      // Add a search input
      const searchContainer = document.createElement('div');
      searchContainer.style.padding = '8px 14px';
      searchContainer.style.background = 'var(--white)';
      searchContainer.style.borderBottom = '1px solid var(--gray-200)';
      searchContainer.style.position = 'sticky';
      searchContainer.style.top = '0';
      searchContainer.style.zIndex = '10';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search 34+ live roles...';
      searchInput.style.width = '100%';
      searchInput.style.padding = '10px';
      searchInput.style.borderRadius = 'var(--radius-sm)';
      searchInput.style.border = '1px solid var(--gray-300)';
      searchInput.style.boxSizing = 'border-box';
      searchInput.style.fontSize = '14px';
      searchInput.style.fontFamily = 'var(--font)';
      
      searchContainer.appendChild(searchInput);
      customOptionsDiv.appendChild(searchContainer);
      
      const optionElements = [];
      
      // Group roles by domain
      const domains = {};
      data.roles.forEach(role => {
          if (!domains[role.domain]) domains[role.domain] = [];
          domains[role.domain].push(role);
      });
      
      for (const [domain, roles] of Object.entries(domains)) {
          const groupHeader = document.createElement('div');
          groupHeader.style.padding = '8px 14px';
          groupHeader.style.background = 'var(--gray-100)';
          groupHeader.style.fontSize = '11px';
          groupHeader.style.fontWeight = '800';
          groupHeader.style.color = 'var(--gray-500)';
          groupHeader.style.textTransform = 'uppercase';
          groupHeader.style.letterSpacing = '0.05em';
          groupHeader.textContent = domain + ' PIPELINE';
          customOptionsDiv.appendChild(groupHeader);
          
          roles.forEach(role => {
            const opt = document.createElement('div');
            opt.style.padding = '12px 14px';
            opt.style.cursor = 'pointer';
            opt.style.borderBottom = '1px solid var(--gray-100)';
            opt.style.display = 'flex';
            opt.style.justifyContent = 'space-between';
            opt.style.alignItems = 'center';
            opt.style.transition = 'background 0.2s';
            
            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = '600';
            titleSpan.style.color = 'var(--black)';
            titleSpan.style.fontSize = '14px';
            titleSpan.textContent = role.title;
            
            const badgeSpan = document.createElement('span');
            badgeSpan.style.fontSize = '12px';
            badgeSpan.textContent = role.status === 'ACTIVE' ? '🟢' : '🔴';
            
            opt.appendChild(titleSpan);
            opt.appendChild(badgeSpan);
            
            opt.onmouseover = () => opt.style.background = 'var(--gray-50)';
            opt.onmouseout = () => opt.style.background = 'var(--white)';
            
            opt.onclick = () => {
                hiddenInput.value = role.title;
                hiddenInput.setAttribute('data-domain', domain);
                customDisplayText.textContent = role.title;
                customDisplayText.style.color = 'var(--black)';
                customDisplayText.style.fontWeight = '700';
                customOptionsDiv.style.display = 'none';
                searchInput.value = ''; // Reset search
                optionElements.forEach(el => {
                    el.opt.style.display = 'flex';
                    if(el.header) el.header.style.display = 'block';
                });
                
                // Trigger change event for existing logic
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
            };
            
            customOptionsDiv.appendChild(opt);
            optionElements.push({ opt: opt, title: role.title.toLowerCase(), domain: domain.toLowerCase(), header: groupHeader });
          });
      }
      

      searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const visibleHeaders = new Set();
          
          optionElements.forEach(el => {
              if (el.title.includes(query) || el.domain.includes(query)) {
                  el.opt.style.display = 'flex';
                  visibleHeaders.add(el.header);
              } else {
                  el.opt.style.display = 'none';
              }
          });
          
          // Hide headers that have no visible children
          optionElements.forEach(el => {
              if (visibleHeaders.has(el.header)) {
                  el.header.style.display = 'block';
              } else {
                  el.header.style.display = 'none';
              }
          });
      });
      
      customDisplay.onclick = () => {
          if (customOptionsDiv.style.display === 'none') {
              customOptionsDiv.style.display = 'block';
              searchInput.focus();
          } else {
              customOptionsDiv.style.display = 'none';
          }
      };
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
          const selectComponent = document.getElementById('custom-role-select');
          if (selectComponent && !selectComponent.contains(e.target)) {
              customOptionsDiv.style.display = 'none';
          }
      });

        
      // Populate keywords and placeholders for ATS scanning
      data.roles.forEach(role => {
        // Fallback to tags if atsKeywords isn't ready, otherwise use the rich AI keywords
        let kws = new Set(role.atsKeywords || role.tags || []);
        if (kws.size < 12) {
           kws.add("Evaluation");
           kws.add("Accuracy");
           kws.add("Quality");
           kws.add("Analysis");
           kws.add("Metrics");
           kws.add("Testing");
           kws.add("Review");
        }
        keywordSets[role.title] = Array.from(kws);
        
        let tags_str = role.tags ? role.tags.join(', ') : 'Evaluation';
        resumePlaceholders[role.title] = `John Doe
${role.title}

Experience
- Evaluated AI outputs and enforced strict domain criteria...
- Applied extensive background in ${tags_str}...`;
        
        // We also need jobDescriptions to be populated!
        jobDescriptions[role.title] = role.description || '';
      });

    } catch(err) {
      console.error("Failed to load waves.json", err);
    }
    
    const kwListEl = document.getElementById('keyword-list');
    const scanBtn = document.getElementById('scan-btn');
    const resumeBox = document.getElementById('resume-text');
    const meterFill = document.getElementById('meter-fill');
    const scoreText = document.getElementById('score-text');
    const feedbackBox = document.getElementById('feedback-box');
    const applyBtn = document.getElementById('apply-btn');
    
    function renderKeywords(role) {
      kwListEl.innerHTML = '';
      if(!keywordSets[role]) return;
      keywordSets[role].forEach(kw => {
        const chip = document.createElement('div');
        chip.className = 'kw-chip pending';
        chip.innerText = kw;
        kwListEl.appendChild(chip);
      });
    }

    roleSelect.addEventListener('change', async function() {
      const selectedRole = this.value;
      if (window.allRoles) {
          const roleObj = window.allRoles.find(r => r.title === selectedRole);
          if (roleObj && roleObj.linkTarget) {
              localStorage.setItem('atsLinkTarget', roleObj.linkTarget);
          } else {
              localStorage.setItem('atsLinkTarget', 'https://t.mercor.com/wbPMF');
          }
      }
        // Reset the ATS scanner UI
        document.getElementById('meter-fill').style.width = '0%';
        document.getElementById('score-text').innerHTML = '0%';
        document.getElementById('score-text').style.color = '#ef4444';
        
        const successMsg = document.getElementById('success-container');
        if(successMsg) successMsg.style.display = 'none';
        
        
        const impBadge = document.getElementById('improvement-badge');
        if(impBadge) impBadge.style.display = 'none';
        previousScore = null;
        
        const feedbackBox = document.getElementById('feedback-box');
        if(feedbackBox) {
            feedbackBox.innerHTML = '<h4>Awaiting Scan...</h4><p>Upload your resume on the left and we will automatically scan it for you.</p>';
        }
        
        if(applyBtn) {
            applyBtn.className = 'btn-apply';
            applyBtn.innerText = 'You must score 80%+ to Apply';
            applyBtn.onclick = null;
        }
        
        scanBtn.innerText = 'Scan My Resume';
      if (jobDescriptions[selectedRole]) {
        
        
        if (keywordSets[selectedRole] && keywordSets[selectedRole].includes("Evaluation")) {
            kwListEl.innerHTML = '<div style="font-size:12px; color:var(--primary); font-weight:700;">🤖 AI is generating precise industry keywords for this role...</div>';
            try {
                                const prompt = `You are an expert technical recruiter. Based ONLY on the job title '${selectedRole}', provide a comma-separated list of exactly 8 core industry keywords (hard skills, software, methodologies) required for this role. Only output the keywords separated by commas, nothing else.`;
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                const response = await fetch('/api/generateAiResponse', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({contents: [{parts: [{text: prompt}]}]}),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                const result = await response.json();
                const text = result.candidates[0].content.parts[0].text;
                const kws = text.split(',').map(s => s.trim()).filter(s => s);
                keywordSets[selectedRole] = kws;
            } catch (err) {
                console.error("Gemini failed", err);
            }
        }
        
        renderKeywords(selectedRole);
        
        // Reset the ATS scanner UI
        document.getElementById('meter-fill').style.width = '0%';
        document.getElementById('score-text').innerHTML = '0%';
        document.getElementById('score-text').style.color = '#ef4444';
        
        const successMsg = document.getElementById('success-container');
        if(successMsg) successMsg.style.display = 'none';
        
        
        const impBadge = document.getElementById('improvement-badge');
        if(impBadge) impBadge.style.display = 'none';
        previousScore = null;
        
        const feedbackBox = document.getElementById('feedback-box');
        if(feedbackBox) {
            feedbackBox.innerHTML = '<h4>Awaiting Scan...</h4><p>Upload your resume on the left and we will automatically scan it for you.</p>';
        }
        
        if(applyBtn) {
            applyBtn.className = 'btn-apply';
            applyBtn.innerText = 'You must score 80%+ to Apply';
            applyBtn.onclick = null;
        }
        

        
        
        
        // Auto-trigger the scan if a resume is already loaded!
        const rBox = document.getElementById('resume-text');
        if (rBox && rBox.value.length >= 50) {
            scanBtn.click();
        } else {
            scanBtn.innerText = 'Upload Resume to Scan';
        }
      }
    });

    // Auto-fill template button
    
    // File Upload Logic
    const uploadZone = document.getElementById('ats-upload-zone');
    const fileInput = document.getElementById('ats-file-input');
    
    if(uploadZone && fileInput) {
      // Programmatic click removed
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        document.querySelectorAll('.ats-secondary-actions').forEach(el => el.remove());
        document.querySelectorAll('.ats-file-card').forEach(el => el.remove());

        const selectedRole = roleSelect.value;


        document.getElementById('upload-content-wrapper').innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Processing...</div>';
        uploadZone.style.pointerEvents = 'none';

        try {
            const arrayBuffer = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = e => resolve(e.target.result);
              reader.onerror = e => reject(new Error("File read failed"));
              reader.readAsArrayBuffer(file);
          });
            let extractedText = "";
            
            if (file.name.toLowerCase().endsWith(".docx")) {
                const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                extractedText = result.value;
            } else {
                const pdf = await pdfjsLib.getDocument({data: new Uint8Array(arrayBuffer)}).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    extractedText += pageText + "\n";
                }
            }
            
            // Set the REAL extracted text instead of John Doe
            resumeBox.value = extractedText;
            
        } catch (error) {
            console.error("PDF Parsing Error:", error);
            alert("Error parsing PDF: " + (error.message || error));
            document.getElementById('upload-content-wrapper').innerHTML = '<div class="upload-icon-wrapper"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:800; font-size:16px; color:var(--black); margin-bottom:6px;">Upload your Resume</div><div style="font-weight:500; font-size:13px; color:var(--gray-500);">PDF or DOCX (Max 5MB)</div>';
            uploadZone.style.pointerEvents = 'auto';
            return;
        }

        // Delay slightly for UI smoothness
        setTimeout(() => {
          uploadZone.style.display = 'none';
          
          // Show a success message
          const labelEl = document.querySelector('label[for="resume-text"]');
          if (labelEl) {
              labelEl.innerHTML = '1. ✅ PDF Uploaded Successfully!<br><span style="font-size:13px; color:var(--gray-500); font-weight:400; display:block; margin-top:4px;">Your resume has been securely processed and is ready for ATS scoring.</span>';
          }
          
          // Keep the resumeBox hidden to keep the UI clean
          resumeBox.style.display = 'none';
          const divider = document.getElementById('paste-text-divider');
          if(divider) divider.style.display = 'none';
          
          // We already filled resumeBox.value with the real PDF text above!
          
          // We can also create a sleek "File Loaded" visual representation
          const fileCard = document.createElement('div');
          fileCard.className = 'ats-file-card';
          fileCard.style.padding = '16px';
          fileCard.style.border = '1px solid var(--gray-200)';
          fileCard.style.borderRadius = 'var(--radius-sm)';
          fileCard.style.background = 'var(--white)';
          fileCard.style.display = 'flex';
          fileCard.style.alignItems = 'center';
          fileCard.style.justifyContent = 'space-between';
          fileCard.style.marginBottom = '12px';
          
          fileCard.style.marginBottom = '8px'; // reduce margin since we have actions below it
          
          window.atsUploadCount = (window.atsUploadCount || 0) + 1;
          const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '.pdf';
          let displayFileName = `My_Resume${ext}`;
          if (window.atsUploadCount > 1) {
              const versionNumber = window.atsUploadCount - 1;
              displayFileName = `My_Resume_Optimized_v${versionNumber}${ext}`;
          }

          fileCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> 
              <span style="font-weight:600; color:var(--black);">${displayFileName}</span>
            </div>
          `;
          
          const secondaryActions = document.createElement('div');
          secondaryActions.className = 'ats-secondary-actions';
          secondaryActions.style.display = 'flex';
          secondaryActions.style.justifyContent = 'center';
          secondaryActions.style.marginBottom = '24px';
          secondaryActions.style.marginTop = '12px';
          
          secondaryActions.innerHTML = `
             <button id="btn-replace-file" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--gray-500); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               Upload New Document
             </button>
          `;
          
          const injectContainer = document.getElementById('injected-file-container');
          if (injectContainer) {
              injectContainer.appendChild(fileCard);
              injectContainer.appendChild(secondaryActions);
          }
          
          document.getElementById('btn-replace-file').onclick = function() {
              if (injectContainer) injectContainer.innerHTML = '';
              uploadZone.style.display = 'flex';
              document.getElementById('item-4-container').style.display = 'none';
              resumeBox.value = '';
              const labelEl = document.querySelector('label[for="resume-text"]');
              if(labelEl) labelEl.innerHTML = '1. Provide Your Resume:';
              uploadZone.style.pointerEvents = 'auto';
              document.getElementById('upload-content-wrapper').innerHTML = '<div class="upload-icon-wrapper"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:800; font-size:16px; color:var(--black); margin-bottom:6px;">Upload your Resume</div><div style="font-weight:500; font-size:13px; color:var(--gray-500);">PDF or DOCX (Max 5MB)</div>';
              
              // Reset ATS stats
              document.getElementById('meter-fill').style.width = '0%';
              document.getElementById('score-text').innerHTML = '0%';
              const sBtn = document.getElementById('scan-btn');
              if (sBtn) {
                  sBtn.innerText = 'Upload Resume to Scan';
                  sBtn.disabled = true;
                  sBtn.style.opacity = '0.5';
              }
          };
          
          // AUTOMATICALLY TRIGGER AUTO-MATCH IN BACKGROUND!
          const autoBtn = document.getElementById('btn-auto-match');
          if (autoBtn) autoBtn.click();
          
        }, 1500);
      });
    }

          
          
    // AUTO-MATCH LOGIC
    const autoMatchBtn = document.getElementById('btn-auto-match');
    if (autoMatchBtn) {
        autoMatchBtn.addEventListener('click', async function() {
            const resumeText = document.getElementById('resume-text').value;
            if (!resumeText || resumeText.length < 50) {
                alert('Please upload or paste your resume below first!');
                return;
            }
            
            autoMatchBtn.innerText = 'Analyzing...';
            autoMatchBtn.disabled = true;
            
            const customDisplayToUpdate = document.getElementById('custom-role-text');
            if(customDisplayToUpdate) {
                customDisplayToUpdate.innerHTML = '⚙️ <span class="loading-pulse">TrainAIToGain is Auto-Matching your best role...</span>';
                customDisplayToUpdate.style.color = 'var(--primary)';
                customDisplayToUpdate.style.fontWeight = '700';
            }
            const scanBtnToDisable = document.getElementById('scan-btn');
            if(scanBtnToDisable) {
                scanBtnToDisable.disabled = true;
                scanBtnToDisable.innerText = 'Waiting for TrainAIToGain...';
                scanBtnToDisable.style.opacity = '0.5';
            }
            
            // Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }
            try {
                let matches = [];
                const cachedMatchesStr = sessionStorage.getItem('ai_matches');
                const cachedResume = sessionStorage.getItem('ai_matches_resume');
                
                // Only reuse cache if the resume text is identical!
                if (cachedMatchesStr && cachedResume === resumeText) {
                    try {
                        const parsedCache = JSON.parse(cachedMatchesStr);
                        if (parsedCache && parsedCache.length > 0 && parsedCache[0].roleName) {
                            matches = parsedCache.map(m => ({
                                role: m.roleName,
                                match: m.matchScore + "%"
                            }));
                        }
                    } catch(e) { console.error("Cache parse error", e); }
                }
                
                if (matches.length === 0) {
                    const roles = Object.keys(jobDescriptions).join(', ');
                    const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles. 
                    Resume: ${resumeText}
                    Active Roles: ${roles}
                    
                    Return a JSON array of the top 3 best matching roles from the list above, along with a percentage match for each. Do not include markdown formatting or backticks. Format exactly like this:
                    [
                      {"role": "Exact Role Title 1", "match": "95%"},
                      {"role": "Exact Role Title 2", "match": "88%"},
                      {"role": "Exact Role Title 3", "match": "75%"}
                    ]`;
                    
                    const response = await fetch('/api/generateAiResponse', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });
                    
                    const data = await response.json();
                    if (data.error) throw new Error(data.error.message);
                    let responseText = data.candidates[0].content.parts[0].text.trim();
                    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                    matches = JSON.parse(responseText);
                    
                    // Save to shared cache for apply.html
                    sessionStorage.setItem('ai_matches_resume', resumeText);
                    sessionStorage.setItem('ai_matches', JSON.stringify(matches.map(m => ({
                        roleName: m.role,
                        matchScore: parseInt(m.match.replace('%', '')),
                        explanation: "Automatically matched based on your resume profile and background."
                    }))));
                }
                function getValidRole(roleStr) {
                    const keys = Object.keys(jobDescriptions);
                    if (keys.includes(roleStr)) return roleStr;
                    let lower = roleStr.toLowerCase();
                    for(let k of keys) { if(k.toLowerCase() === lower) return k; }
                    let words = lower.split(' ').filter(w => w.length > 3);
                    for(let k of keys) { 
                        let kLower = k.toLowerCase();
                        if(kLower.includes(lower) || lower.includes(kLower)) return k;
                        for(let w of words) {
                            if(kLower.includes(w) && (kLower.includes('engineer') || lower.includes('engineer'))) return k;
                        }
                    }
                    return null;
                }
                
                let bestRole = getValidRole(matches[0].role);
                if (!bestRole && Object.keys(jobDescriptions).length > 0) {
                    bestRole = Object.keys(jobDescriptions)[0]; // ultimate fallback
                }
                window.topMatches = matches;
                
                // Set the role
                const hiddenSelect = document.getElementById('role-select');
                const customDisplay = document.getElementById('custom-role-text');
                
                if (bestRole && jobDescriptions[bestRole] !== undefined) {
                    hiddenSelect.value = bestRole;
                    customDisplay.innerText = `${bestRole} (${matches[0].match} AI Fit)`;
                    customDisplay.style.color = 'var(--black)';
                    
                    // Inject top matches into the custom dropdown visually
                    const customOptionsDiv = document.getElementById('custom-role-options');
                    
                    // Clean up old matches if they exist
                    document.querySelectorAll('.ai-match-item').forEach(el => el.remove());
                    
                    const aiMatchesContainer = document.createElement('div');
                    aiMatchesContainer.className = 'ai-match-item';
                    
                    const title = document.createElement('div');
                    title.style.padding = '8px 14px';
                    title.style.background = '#ecfdf5';
                    title.style.color = '#065f46';
                    title.style.fontSize = '11px';
                    title.style.fontWeight = '800';
                    title.innerText = '🌟 YOUR TOP AI MATCHES';
                    aiMatchesContainer.appendChild(title);
                    
                    matches.forEach(match => {
                        let validMatchRole = getValidRole(match.role) || Object.keys(jobDescriptions)[0];
                        if (validMatchRole && jobDescriptions[validMatchRole] !== undefined) {
                            match.role = validMatchRole; // overwrite with safe key
                            const opt = document.createElement('div');
                            opt.style.padding = '12px 14px';
                            opt.style.cursor = 'pointer';
                            opt.style.borderBottom = '1px solid var(--gray-200)';
                            opt.style.display = 'flex';
                            opt.style.justifyContent = 'space-between';
                            opt.style.alignItems = 'center';
                            opt.style.background = '#f8fafc';
                            
                            opt.innerHTML = `<div style="font-weight:700;">${match.role}</div><div style="background:var(--primary); color:white; padding:2px 8px; border-radius:12px; font-size:12px; font-weight:800; white-space:nowrap; flex-shrink:0;">${match.match} AI Fit</div>`;
                            
                            opt.onclick = () => {
                              hiddenSelect.value = match.role;
                              customDisplay.innerText = `${match.role} (${match.match} AI Fit)`;
                              customDisplay.style.color = 'var(--black)';
                              customOptionsDiv.style.display = 'none';
                              hiddenSelect.dispatchEvent(new Event('change'));
                            };
                            opt.onmouseover = () => opt.style.background = '#f1f5f9';
                            opt.onmouseout = () => opt.style.background = '#f8fafc';
                            aiMatchesContainer.appendChild(opt);
                        }
                    });
                    
                    const divider = document.createElement('div');
                    divider.style.padding = '8px 14px';
                    divider.style.background = 'var(--gray-100)';
                    divider.style.color = 'var(--gray-500)';
                    divider.style.fontSize = '11px';
                    divider.style.fontWeight = '800';
                    divider.innerText = 'OTHER ACTIVE ROLES';
                    aiMatchesContainer.appendChild(divider);
                    
                    // Insert right after the search container (first child)
                    const searchContainer = customOptionsDiv.firstChild;
                    if (searchContainer) {
                        customOptionsDiv.insertBefore(aiMatchesContainer, searchContainer.nextSibling);
                    } else {
                        customOptionsDiv.appendChild(aiMatchesContainer);
                    }
                    
                    // Automatically select the very best match (the first one)
                    if (matches && matches.length > 0) {
                        if(typeof gtag === 'function') gtag('event', 'auto_matched_role', {'event_category': 'funnel', 'event_label': matches[0].role, 'value': parseInt(matches[0].match)});
                        const bestMatch = matches[0];
                        const finalRole = getValidRole(bestMatch.role) || bestMatch.role;
                        hiddenSelect.value = finalRole;
                        customDisplay.innerText = `${finalRole} (${bestMatch.match} AI Fit)`;
                        customDisplay.style.color = 'var(--black)';
                        
                        // Now it is safe to trigger the change event, which will trigger the scan
                        const sBtn = document.getElementById('scan-btn');
                        if (sBtn) {
                            sBtn.disabled = false;
                            sBtn.style.opacity = '1';
                            sBtn.innerText = 'Scan My Resume';
                        }
                        const event = new Event('change');
                        hiddenSelect.dispatchEvent(event);
                    }
                    
                    autoMatchBtn.innerText = 'Top Matches Found! ✅';
                    autoMatchBtn.style.background = '#111827';
                    

                } else {
                    alert('Could not find a perfect match. Please select manually.');
                    autoMatchBtn.innerText = 'Auto-Match Me';
                }
            } catch (err) {
                console.error(err);
                alert('Match failed. Try again or select manually.');
                autoMatchBtn.innerText = 'Auto-Match Me';
            }
            autoMatchBtn.disabled = false;
        });
    }

          
    // Prevent clicking Scan if no resume is loaded
    setInterval(() => {
        const scanBtn = document.getElementById('scan-btn');
        const rBox = document.getElementById('resume-text');
        if (scanBtn && rBox) {
            // Only modify if it's not actively scanning
            if (scanBtn.innerText !== 'Scanning...') {
                if (rBox.value.length < 50) {
                    scanBtn.disabled = true;
                    scanBtn.style.opacity = '0.5';
                    scanBtn.innerText = 'Upload Resume to Scan';
                    scanBtn.style.cursor = 'not-allowed';
                } else {
                    scanBtn.disabled = false;
                    scanBtn.style.opacity = '1';
                    if (scanBtn.innerText === 'Upload Resume to Scan') {
                        scanBtn.innerText = 'Scan My Resume';
                    }
                    scanBtn.style.cursor = 'pointer';
                }
            }
        }
    }, 500);



          




    scanBtn.addEventListener('click', function() {
      const selectedRole = roleSelect.value;
      if (!selectedRole || selectedRole === "") {
        const autoBtn = document.getElementById('btn-auto-match');
        if (autoBtn) {
            autoBtn.click();
        } else {
            alert("Please select a target role first!");
        }
        return;
      }
      
      const text = resumeBox.value.toLowerCase();
      if (text.length < 50) {
        alert("Please paste a full resume before scanning.");
        return;
      }

      if(typeof gtag === 'function') gtag('event', 'clicked_scan_button', {'event_category': 'funnel', 'event_label': selectedRole});
      scanBtn.innerText = 'Scanning...';
      scanBtn.disabled = true;
      meterFill.style.width = '0%';
      scoreText.innerText = '...';
      
      const chips = kwListEl.querySelectorAll('.kw-chip');
      chips.forEach(c => c.className = 'kw-chip pending');

      setTimeout(() => {
        let matches = 0;
        let total = keywordSets[selectedRole].length;
        let missingKWs = [];
        
        chips.forEach(chip => {
          const kw = chip.innerText.toLowerCase();
          if (text.includes(kw)) {
            chip.className = 'kw-chip found';
            matches++;
          } else {
            chip.className = 'kw-chip missing';
            missingKWs.push(chip.innerText);
          }
        });
        
        const score = Math.round((matches / total) * 100);
        
        // Save to localStorage for the Guide Assistant to use
        localStorage.setItem('atsScore', score);
        localStorage.setItem('atsRole', selectedRole);
        const selectedDomain = document.getElementById('role-select').getAttribute('data-domain') || 'Software Engineering';
        localStorage.setItem('atsDomain', selectedDomain);
        localStorage.setItem('atsMissing', missingKWs.join(', '));
        
        const resumeRawText = document.getElementById('resume-text').value;
        if (resumeRawText) {
            localStorage.setItem('candidateResumeText', resumeRawText);
        }
        meterFill.style.width = score + '%';
        
        if (previousScore !== null) {
            let diff = score - previousScore;
            const badge = document.getElementById('improvement-badge');
            if (badge) {
                badge.style.display = 'inline-flex';
                if (diff > 0) {
                    badge.style.background = '#ecfdf5';
                    badge.style.color = '#059669';
                    badge.style.border = '1px solid #a7f3d0';
                    badge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg> +${diff}%`;
                } else if (diff < 0) {
                    badge.style.background = '#fef2f2';
                    badge.style.color = '#dc2626';
                    badge.style.border = '1px solid #fecaca';
                    badge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg> ${diff}%`;
                } else {
                    badge.style.background = '#f9fafb';
                    badge.style.color = '#6b7280';
                    badge.style.border = '1px solid #e5e7eb';
                    badge.innerHTML = `No change`;
                }
            }
        }
        
        scoreText.innerHTML = score + '%';
        previousScore = score;
        
        let meterColor = '#ef4444';
        if (score >= 50) meterColor = '#eab308';
        if (score >= 80) meterColor = '#10b981';
        meterFill.style.background = meterColor;
        scoreText.style.color = meterColor;
        
        if (applyBtn) {
            if (score >= 100) {
                const s5 = document.getElementById('step-5-container');
                const successMsg = document.getElementById('success-container');
                if(s5) s5.style.display = 'none';
                if(successMsg) successMsg.style.display = 'block';
            } else {
                const s5 = document.getElementById('step-5-container');
                const successMsg = document.getElementById('success-container');
                if(s5) s5.style.display = 'block';
                if(successMsg) successMsg.style.display = 'none';
            }
            if (score >= 80) {
                applyBtn.disabled = false;
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
                applyBtn.style.background = 'var(--primary)';
                applyBtn.style.color = 'white';
                applyBtn.innerHTML = 'Apply Now ➔';
                // Trigger celebratory animation
                applyBtn.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
                setTimeout(() => applyBtn.style.boxShadow = 'none', 1500);
                
                applyBtn.onclick = () => openApplyModal('content_button');
            } else {
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.6';
                applyBtn.style.cursor = 'not-allowed';
                applyBtn.style.background = 'var(--gray-400)';
                applyBtn.innerHTML = 'You must score 80%+ to Apply';
            }
        }
        
        const escapedPrompt = `Persona: Act as an expert executive resume writer specializing in AI industry hiring and ATS optimization. 

Task: Rewrite my current resume bullet points so they organically and professionally include the specific missing keywords required to pass the automated AI recruiter screening for this role. 

Missing Keywords to Add:
${missingKWs.join(', ')}

CRITICAL REQUIREMENT: You MUST include every single one of the missing keywords EXACTLY as they are written above. Real ATS scanners require exact matches.

CRITICAL FORMATTING INSTRUCTION: Do NOT rewrite my entire resume. If you output a full resume, I will lose all my PDF/Word formatting! ONLY output the specific bullet points you have modified, and clearly label which section they belong in. I want to seamlessly copy and paste just the new bullets directly into my existing document.

ETHICS OVERRIDE: If my current experience does not directly support a specific keyword, DO NOT fabricate experience in my bullet points. Instead, integrate the remaining unsupported keywords into a new 'Current Learning Goals' or '2025 Upskilling Targets' section at the bottom of the resume. It is 100% honest and accurate for me to state that I am currently actively studying these specific topics on my own time. This ensures the AI scanner registers the exact keyword match without violating professional ethics.

Here is my current resume text:
"""
${resumeBox.value}
"""`.replace(/'/g, '&#39;').replace(/\"/g, '&quot;');
        
        if (!window.startAITimer) {
          window.startAITimer = function(btn) {
            if(typeof gtag === 'function') gtag('event', 'copied_ai_prompt', {'event_category': 'funnel'});
            navigator.clipboard.writeText(btn.getAttribute('data-prompt'));
            
            if (btn.innerText.includes('Copied')) {
              btn.innerText = 'Copied again! ✅';
              setTimeout(() => {
                if (btn.innerText === 'Copied again! ✅') {
                  btn.innerText = 'Copied! You have 5 minutes ➔';
                }
              }, 1000);
            } else {
              btn.innerText = 'Copied! You have 5 minutes ➔';
            }
            btn.style.color = '#10b981';
            
            const helperText = document.getElementById('ai-helper-text');
            helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ ACTION REQUIRED:</span> Open ChatGPT, paste the prompt, and save the newly generated resume as a PDF. Then, click <strong>Upload New Document</strong> in Step 1 to rescan it! You have <span id="countdown-timer" style="font-weight:800; font-family:monospace; background:#fee2e2; color:#ef4444; padding:2px 4px; border-radius:4px;">05:00</span> minutes.';
            
            let timeLeft = 300; // 5 minutes
            if(window.activeAITimer) clearInterval(window.activeAITimer);
            
            window.activeAITimer = setInterval(() => {
              timeLeft--;
              const timerEl = document.getElementById('countdown-timer');
              if(timerEl) {
                const m = Math.floor(timeLeft / 60);
                const s = timeLeft % 60;
                timerEl.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
              }
              
              if (timeLeft <= 0) {
                clearInterval(window.activeAITimer);
                if(timerEl) {
                  helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ Time is up!</span> You\'ve got this. Save your new AI-upgraded resume as a PDF and click <strong>Upload New Document</strong> in Step 1 to rescan it. Let\'s get you hired!';
                  btn.innerText = 'Generate New Prompt 🪄';
                  btn.style.color = 'white';
                }
              }
            }, 1000);
            
            // AUTOMATICALLY REVEAL STEP 5 PASTE BOX FOR THE USER!
            
            
            
            
            const scanBtn = document.getElementById('scan-btn');
            if (scanBtn) scanBtn.innerText = 'Scan Updated Resume';
            
            const fileCardArea = document.getElementById('injected-file-container');
            const replaceBtn = document.getElementById('btn-replace-file');
            if (fileCardArea) {
                setTimeout(() => {
                    fileCardArea.scrollIntoView({behavior: 'smooth', block: 'center'});
                    if (replaceBtn) {
                        replaceBtn.style.transition = 'all 0.3s';
                        replaceBtn.style.background = 'rgba(16,185,129,0.1)';
                        replaceBtn.style.padding = '8px 12px';
                        replaceBtn.style.borderRadius = '6px';
                        replaceBtn.style.color = '#10b981';
                        setTimeout(() => {
                            replaceBtn.style.background = 'none';
                            replaceBtn.style.padding = '0';
                            replaceBtn.style.color = 'var(--gray-500)';
                        }, 2500);
                    }
                }, 100);
            }
          };
        }
        
        const nudgeCTA = `
          <div style="margin-top:0;">
            <label style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">3. AI Prompt to Fix Resume:</label>
            <div style="background: var(--gray-50); border: 1px solid var(--gray-300); border-radius: var(--radius); padding: 16px;">
                <p style="margin:0 0 16px 0; color:var(--gray-600); font-size:13px; line-height:1.5;"><strong>How to get 100%:</strong> Copy the prompt below and paste it into ChatGPT or Claude. The AI will completely rewrite your resume to include your missing keywords! Then, upload your new resume at Step 1.<br><br><span style="font-size:12px; color:var(--primary); font-weight:600;">💡 Tip: Re-scan and repeat until you hit 100%!</span></p>
                <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--gray-900); color:white; border-radius:6px; padding:12px 16px; font-weight:700; font-size:14px; border:none; cursor:pointer; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.1); transition: background 0.2s;" onmouseover="this.style.background='var(--black)';" onmouseout="this.style.background='var(--gray-900)';">
                  Copy AI Prompt 🪄
                </button>
                <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin:12px 0 0 0; line-height:1.4; text-align:center;">
                  <em>Copies a custom prompt for ChatGPT / Claude</em>
                </p>
            </div>
          </div>
        `;
        
        const item4Container = document.getElementById('item-4-container');
        if(item4Container) { item4Container.innerHTML = ''; item4Container.style.display = 'none'; }
        if(item4Container) item4Container.style.display = 'block';
        // ATS TRAP ALERT LOGIC
        let atsTrapMessage = '';
        let showAtsTrap = false;
        const customDisp = document.getElementById('custom-role-display');
        if (customDisp && customDisp.innerText.includes('AI Fit') && score < 80) {
            const matchMatch = customDisp.innerText.match(/\((\d+)%/);
            if (matchMatch) {
                const aiScore = parseInt(matchMatch[1]);
                if (aiScore > score + 10) { // Only show if there's a significant gap
                    showAtsTrap = true;
                    atsTrapMessage = `<div style="background:#fff1f2; border:1px solid #fecdd3; padding:16px; border-radius:8px; margin-bottom:0; box-shadow:0 2px 4px rgba(0,0,0,0.05);"><h4 style="color:#be123c; font-size:16px; margin:0 0 12px 0;">🚨 The "ATS Trap" Detected!</h4><div style="background:white; border:1px solid #fecdd3; border-radius:6px; padding:12px; margin-bottom:12px;"><div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="font-weight:700; color:var(--gray-700);">Your Human Skill Level:</span><span style="font-weight:800; color:#10b981;">${aiScore}% Fit</span></div><div style="display:flex; justify-content:space-between;"><span style="font-weight:700; color:var(--gray-700);">ATS Robot Score:</span><span style="font-weight:800; color:#ef4444;">${score}% (Auto-Reject)</span></div></div><p style="color:#9f1239; font-size:13px; margin:0 0 12px 0; line-height:1.5;">You are highly qualified for this role, but because your resume is missing exact keywords, an automated ATS scanner will auto-reject you.</p><p style="color:#9f1239; font-size:14px; margin:0; font-weight:800;">Action Required: Go to Step 3 below to fix this.</p></div>`;
                }
            }
        }
        
        if (score < 50) {
           feedbackBox.innerHTML = showAtsTrap ? atsTrapMessage : `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords and will be auto-rejected by the ATS.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 3</strong> and use the Optimization Payload to generate a prompt that will rewrite your resume.</p>`;
           item4Container.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 80) {
           feedbackBox.innerHTML = showAtsTrap ? atsTrapMessage : `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the applicant pool.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 3</strong> and use the AI Prompt to weave in the remaining keywords.</p>`;
           item4Container.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>';
           item4Container.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply ready';
           applyBtn.disabled = false;
           applyBtn.innerText = 'Apply Now ➔';
           applyBtn.onclick = () => openApplyModal('content_button');
        } else {
           feedbackBox.innerHTML = '<h4>Flawless 100% Match! 🏆</h4><p>Your resume is fully optimized and guaranteed to pass the ATS filter. Now that your resume is perfect, you are ready to apply for the role.</p>';
           if(item4Container) item4Container.style.display = 'none';
           applyBtn.className = 'btn-apply ready';
           applyBtn.disabled = false;
           applyBtn.innerText = 'Apply Now ➔';
           applyBtn.onclick = () => openApplyModal('content_button');
        }
        
        scanBtn.innerText = 'Scan Again';
        scanBtn.disabled = false;
        
      }, 1200);
    });
  });

  // Auto-Select Role from URL if passed via ?role=...
  document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const passedRole = params.get('role');
    if (passedRole) {
        setTimeout(() => {
            const hiddenInput = document.getElementById('role-select');
            const customDisplayText = document.getElementById('custom-role-text');
            if (hiddenInput && customDisplayText) {
                hiddenInput.value = passedRole;
                customDisplayText.textContent = passedRole;
                
                // Trigger the selection logic (this fires the updateRequirements)
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
                
                // Find and trigger the hidden option if needed
                const customOptionsDiv = document.getElementById('custom-role-options');
                if (customOptionsDiv) {
                    const options = customOptionsDiv.querySelectorAll('.custom-role-option');
                    options.forEach(opt => {
                        if (opt.textContent === passedRole) {
                            opt.click();
                        }
                    });
                }
                
                // If a resume is already loaded, auto-run the scan for this role!
                setTimeout(() => {
                    const rBox = document.getElementById('resume-text');
                    const sBtn = document.getElementById('scan-btn');
                    if (rBox && rBox.value.length >= 50 && sBtn) {
                        sBtn.disabled = false;
                        sBtn.click();
                    }
                }, 600);
            }
        }, 500); // give the fetch waves.json time to complete
    }
  });

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
document.addEventListener('DOMContentLoaded', function() {
    const tabMercor = document.getElementById('tab-mercor');
    const tabCustom = document.getElementById('tab-custom');
    const roleSelectUi = document.getElementById('custom-role-select');
    const customJdContainer = document.getElementById('custom-jd-container');
    const customJdInput = document.getElementById('custom-jd-input');
    const hiddenSelect = document.getElementById('role-select');
    
    if(tabMercor && tabCustom) {
        tabMercor.addEventListener('click', () => {
            tabMercor.style.background = 'var(--white)';
            tabMercor.style.color = 'var(--black)';
            tabMercor.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            tabMercor.style.border = '1px solid var(--gray-200)';
            
            tabCustom.style.background = 'transparent';
            tabCustom.style.color = 'var(--gray-500)';
            tabCustom.style.boxShadow = 'none';
            tabCustom.style.border = 'none';
            
            roleSelectUi.style.display = 'block';
            customJdContainer.style.display = 'none';
            
            // Re-trigger the selection of whatever was in the mercor dropdown
            // (or let the user select it)
            if(hiddenSelect.value === 'Custom Job' && window.allRoles && window.allRoles.length > 0) {
                hiddenSelect.value = window.allRoles[0].title;
                hiddenSelect.dispatchEvent(new Event('change'));
            }
        });
        
        tabCustom.addEventListener('click', () => {
            tabCustom.style.background = 'var(--white)';
            tabCustom.style.color = 'var(--black)';
            tabCustom.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            tabCustom.style.border = '1px solid var(--gray-200)';
            
            tabMercor.style.background = 'transparent';
            tabMercor.style.color = 'var(--gray-500)';
            tabMercor.style.boxShadow = 'none';
            tabMercor.style.border = 'none';
            
            roleSelectUi.style.display = 'none';
            customJdContainer.style.display = 'block';
            
            hiddenSelect.value = 'Custom Job';
            // Force the change event to reset the scanner UI
            hiddenSelect.dispatchEvent(new Event('change'));
            
            if(customJdInput.value.trim() !== '') {
                extractAndRenderCustomKeywords();
            }
        });
    }

    const stopWords = new Set(["the", "and", "to", "of", "in", "for", "with", "is", "on", "that", "by", "this", "an", "as", "be", "are", "or", "from", "at", "it", "your", "will", "have", "we", "our", "you", "can", "their", "has", "not", "but", "all", "about", "which", "more", "if", "they", "there", "what", "so", "when", "how", "who", "up", "out", "get", "go", "me", "my", "us", "i", "he", "she", "them", "experience", "work", "job", "role", "team", "years", "skills", "ability", "including", "working", "strong", "required", "using", "support", "development", "knowledge", "must", "preferred", "status", "related", "other", "such", "within", "new", "ensure", "provide", "business", "data"]);

    function extractAndRenderCustomKeywords() {
        const text = customJdInput.value.trim().toLowerCase();
        if(!text) {
            window.keywordSets['Custom Job'] = ['Experience', 'Skills', 'Communication', 'Teamwork', 'Project', 'Analysis', 'Management', 'Requirements'];
        } else {
            const words = text.match(/[a-z]+/g) || [];
            const counts = {};
            words.forEach(w => {
                if(w.length > 3 && !stopWords.has(w)) counts[w] = (counts[w]||0)+1;
            });
            const sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
            // Take top 12 keywords
            const kws = sorted.slice(0, 12).map(w => w.charAt(0).toUpperCase() + w.slice(1));
            if(kws.length === 0) kws.push('Keywords', 'Not', 'Found');
            window.keywordSets['Custom Job'] = kws;
        }
        
        // Use the global renderKeywords if it exists (might need to call it via the global scope if possible, 
        // but renderKeywords is scoped inside the fetch. We can just dispatch the change event!
        // But change event will wipe the score. That's fine if they are typing a new JD.
        hiddenSelect.value = 'Custom Job';
        
        // Wait, dispatching change event resets the scanner.
        // If we want it to be instant *without* wiping, we need access to the DOM.
        const kwListEl = document.getElementById('keyword-list');
        kwListEl.innerHTML = '';
        window.keywordSets['Custom Job'].forEach(kw => {
            const chip = document.createElement('div');
            chip.className = 'kw-chip pending';
            chip.innerText = kw;
            kwListEl.appendChild(chip);
        });
        
        // Enable scan button
        const scanBtn = document.getElementById('scan-btn');
        if(scanBtn) {
            scanBtn.disabled = false;
            scanBtn.style.opacity = '1';
            scanBtn.innerText = 'Scan My Resume';
        }
    }

    if(customJdInput) {
        // Debounce the input so we don't re-render on every keystroke too aggressively
        let timeout = null;
        customJdInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(extractAndRenderCustomKeywords, 300);
        });
    }
});
