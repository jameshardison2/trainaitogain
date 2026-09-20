import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add ai-fix-container under feedbackBox
html_find = """    <div class="feedback-box" id="feedback-box">
      <h4>Awaiting Scan...</h4>
      <p>Upload your resume on the left and we will automatically scan it for you.</p>
    </div>"""

html_replace = """    <div class="feedback-box" id="feedback-box">
      <h4>Awaiting Scan...</h4>
      <p>Upload your resume on the left and we will automatically scan it for you.</p>
    </div>
    <div id="ai-fix-container"></div>"""

if html_find in html:
    html = html.replace(html_find, html_replace)
    print("Added ai-fix-container!")
else:
    print("Could not find feedback-box HTML.")


# 2. Redesign the nudgeCTA
js_nudge_find = """        const nudgeCTA = `
          <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(0,0,0,0.1);">
            <p style="font-size:13px; color:var(--gray-600); margin-bottom:8px;">Want AI to fix it for you?</p>
            <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--primary); color:white; border:none; padding:8px 12px; border-radius:4px; font-weight:700; font-size:13px; cursor:pointer; font-family:inherit; transition:background 0.2s;">
              Copy Custom AI Prompt 🪄
            </button>
            <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin-top:8px; line-height:1.4;">
              <em>After copying, open ChatGPT, Claude, or Gemini and paste the prompt. It will automatically rewrite your resume to include the missing keywords!</em>
            </p>
          </div>
        `;"""

js_nudge_replace = """        const nudgeCTA = `
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display:flex; align-items:center; gap:8px;">
               <span style="font-size:20px;">✨</span>
               <h4 style="margin:0; color:#166534; font-weight:800; font-size:15px; letter-spacing:-0.02em;">Instantly fix your resume with AI</h4>
            </div>
            <p style="margin:0; color:#15803d; font-size:13px; line-height:1.4;">Let ChatGPT or Claude rewrite your bullets to include the missing keywords perfectly without fabricating experience.</p>
            <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:#16a34a; color:white; border-radius:8px; padding:12px 16px; font-weight:700; font-size:14px; border:none; cursor:pointer; width:100%; box-shadow:0 2px 4px rgba(22,163,74,0.2); transition: transform 0.1s, box-shadow 0.1s;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px rgba(22,163,74,0.2)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(22,163,74,0.2)';">
              Copy Custom AI Prompt
            </button>
            <p id="ai-helper-text" style="font-size:12px; color:#166534; margin:0; line-height:1.4; opacity:0.8;">
              <em>Paste this prompt into your favorite AI. It will generate your new resume text.</em>
            </p>
          </div>
        `;"""

if js_nudge_find in html:
    html = html.replace(js_nudge_find, js_nudge_replace)
    print("Redesigned nudgeCTA!")
else:
    print("Could not find nudgeCTA JS.")

# 3. Inject it into ai-fix-container instead of feedbackBox
# We need to find the if/else block and change it.
js_if_find = """        if (score < 50) {
           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords. The automated scanner is highly likely to reject this. Please add the missing keywords highlighted above into your bullet points organically.</p> ${nudgeCTA}`;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 80) {
           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the candidate pool.</p> ${nudgeCTA}`;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>' + nudgeCTA;
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        } else {
           feedbackBox.innerHTML = '<h4>Flawless 100% Match! 🏆</h4><p>Great job! Your resume is absolutely perfect. It is guaranteed to pass the ATS screening. Let\\'s move you along the pipeline to prepare for the AI Interview!</p>';
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        }"""

js_if_replace = """        const fixContainer = document.getElementById('ai-fix-container');
        if (score < 50) {
           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords. The automated scanner is highly likely to reject this. Please add the missing keywords highlighted above into your bullet points organically.</p>`;
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 80) {
           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the candidate pool.</p>`;
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>';
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        } else {
           feedbackBox.innerHTML = '<h4>Flawless 100% Match! 🏆</h4><p>Great job! Your resume is absolutely perfect. It is guaranteed to pass the ATS screening. Let\\'s move you along the pipeline to prepare for the AI Interview!</p>';
           fixContainer.innerHTML = '';
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        }"""

if js_if_find in html:
    html = html.replace(js_if_find, js_if_replace)
    print("Updated if block!")
else:
    print("Could not find if block.")
    
# 4. Add clearing logic to the reset block
reset_find = """        const impBadge = document.getElementById('improvement-badge');
        if(impBadge) impBadge.style.display = 'none';
        
        const feedbackBox = document.getElementById('feedback-box');"""

reset_replace = """        const impBadge = document.getElementById('improvement-badge');
        if(impBadge) impBadge.style.display = 'none';
        
        const fixContainer = document.getElementById('ai-fix-container');
        if(fixContainer) fixContainer.innerHTML = '';
        
        const feedbackBox = document.getElementById('feedback-box');"""

if reset_find in html:
    html = html.replace(reset_find, reset_replace)
    print("Updated reset block!")
    
with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)

