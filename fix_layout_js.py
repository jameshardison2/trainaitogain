import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the old secondaryActions injection (we don't need Paste AI-Updated text buttons anymore because it's a linear flow)
js_injection_find = """          const secondaryActions = document.createElement('div');
          secondaryActions.className = 'ats-secondary-actions'; // for easy cleanup
          secondaryActions.style.display = 'flex';
          secondaryActions.style.justifyContent = 'center';
          secondaryActions.style.gap = '24px';
          secondaryActions.style.alignItems = 'center';
          secondaryActions.style.marginBottom = '24px';
          secondaryActions.style.marginTop = '12px';
          secondaryActions.style.padding = '0 4px';
          
          secondaryActions.innerHTML = `
             <button id="btn-edit-text" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--primary); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               Paste AI-Updated Text
             </button>
             <button id="btn-replace-file" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--gray-500); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               Upload Different PDF
             </button>
          `;
          
          resumeBox.parentNode.insertBefore(fileCard, resumeBox);
          resumeBox.parentNode.insertBefore(secondaryActions, resumeBox);
          
          document.getElementById('btn-edit-text').onclick = function() {
              resumeBox.style.display = 'block';
              resumeBox.value = '';
              resumeBox.placeholder = 'Paste your new AI-updated resume text here...';
              resumeBox.focus();
              fileCard.style.display = 'none';
              if(labelEl) labelEl.innerHTML = '3. Paste AI-Updated Resume:<br><span style="font-size:13px; color:var(--gray-500); font-weight:400; display:block; margin-top:4px;">Paste the new resume you got from ChatGPT below and click Scan.</span>';
          };
          
          document.getElementById('btn-replace-file').onclick = function() {
              fileCard.style.display = 'none';
              uploadZone.style.display = 'flex';
              resumeBox.style.display = 'none';
              resumeBox.value = '';
              if(labelEl) labelEl.innerHTML = '3. Upload Your Resume:';
              uploadZone.style.pointerEvents = 'auto';
              uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div>';
          };"""

js_injection_replace = """          const secondaryActions = document.createElement('div');
          secondaryActions.className = 'ats-secondary-actions';
          secondaryActions.style.display = 'flex';
          secondaryActions.style.justifyContent = 'center';
          secondaryActions.style.marginBottom = '24px';
          secondaryActions.style.marginTop = '12px';
          
          secondaryActions.innerHTML = `
             <button id="btn-replace-file" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--gray-500); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               Upload Different PDF
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
              
              // Hide step 4 and step 5 when uploading a new file
              document.getElementById('item-4-container').style.display = 'none';
              document.getElementById('step-5-container').style.display = 'none';
              resumeBox.value = '';
              
              if(labelEl) labelEl.innerHTML = '3. Upload Your Resume:';
              uploadZone.style.pointerEvents = 'auto';
              uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div>';
          };"""

if js_injection_find in html:
    html = html.replace(js_injection_find, js_injection_replace)
    print("Replaced JS Injection!")
else:
    print("Could not find JS Injection block.")

# Update the startAITimer auto-open logic to open Step 5!
find_timer_open = """            // AUTOMATICALLY OPEN THE PASTE BOX FOR THE USER!
            const editBtn = document.getElementById('btn-edit-text');
            if (editBtn) editBtn.click();
            
            const rBox = document.getElementById('resume-text');
            if (rBox) {
                rBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                rBox.style.transition = 'box-shadow 0.3s';
                rBox.style.boxShadow = '0 0 0 6px rgba(16,185,129,0.3)';
                setTimeout(() => rBox.style.boxShadow = '', 2000);
            }"""

replace_timer_open = """            // AUTOMATICALLY REVEAL STEP 5 PASTE BOX FOR THE USER!
            const step5 = document.getElementById('step-5-container');
            if (step5) step5.style.display = 'block';
            
            const rBox = document.getElementById('resume-text');
            if (rBox) {
                setTimeout(() => {
                    rBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                    rBox.style.transition = 'box-shadow 0.3s';
                    rBox.style.boxShadow = '0 0 0 6px rgba(16,185,129,0.3)';
                    setTimeout(() => rBox.style.boxShadow = '', 2000);
                    rBox.focus();
                }, 100);
            }"""

if find_timer_open in html:
    html = html.replace(find_timer_open, replace_timer_open)
    print("Replaced Timer open!")
else:
    print("Could not find timer open.")

# Activate the "Apply" button dynamically when score >= 80
find_apply_btn = """<button   class="btn-apply" id="apply-btn" style="cursor:pointer;" onclick="openApplyModal('content_button');">You must score 80%+ to Apply</button>"""
replace_apply_btn = """<button class="btn-apply" id="apply-btn" style="cursor:not-allowed; opacity:0.6;" disabled onclick="openApplyModal('content_button');">You must score 80%+ to Apply</button>"""

if find_apply_btn in html:
    html = html.replace(find_apply_btn, replace_apply_btn)
    print("Disabled Apply button initially!")

find_score_check = """        if (score >= 80) meterColor = '#10b981';
        meterFill.style.background = meterColor;"""
replace_score_check = """        if (score >= 80) meterColor = '#10b981';
        meterFill.style.background = meterColor;
        
        const applyBtn = document.getElementById('apply-btn');
        if (applyBtn) {
            if (score >= 80) {
                applyBtn.disabled = false;
                applyBtn.style.opacity = '1';
                applyBtn.style.cursor = 'pointer';
                applyBtn.style.background = 'var(--primary)';
                applyBtn.style.color = 'white';
                applyBtn.innerHTML = 'Next Step: AI Interview Prep ➔';
                // Trigger celebratory animation
                applyBtn.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
                setTimeout(() => applyBtn.style.boxShadow = 'none', 1500);
            } else {
                applyBtn.disabled = true;
                applyBtn.style.opacity = '0.6';
                applyBtn.style.cursor = 'not-allowed';
                applyBtn.style.background = 'var(--gray-400)';
                applyBtn.innerHTML = 'You must score 80%+ to Apply';
            }
        }"""

if find_score_check in html:
    html = html.replace(find_score_check, replace_score_check)
    print("Added Apply button activation logic!")
else:
    print("Could not find score check.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
