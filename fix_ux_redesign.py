import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Swap the order of apply-btn and ai-fix-container in HTML
html_order_find = """    <div class="feedback-box" id="feedback-box">
      <h4>Awaiting Scan...</h4>
      <p>Upload your resume on the left and we will automatically scan it for you.</p>
    </div>
    <div id="ai-fix-container"></div>
    
    <button class="btn-apply" id="apply-btn" style="margin-top:24px;">You must score 80%+ to Apply</button>"""

html_order_replace = """    <div class="feedback-box" id="feedback-box">
      <h4>Awaiting Scan...</h4>
      <p>Upload your resume on the left and we will automatically scan it for you.</p>
    </div>
    
    <button class="btn-apply" id="apply-btn" style="margin-top:24px;">You must score 80%+ to Apply</button>
    <div id="ai-fix-container"></div>"""

if html_order_find in html:
    html = html.replace(html_order_find, html_order_replace)
    print("Swapped container order!")
else:
    print("Could not swap container order.")


# 2. Redesign the nudgeCTA string to be clinical and professional
js_nudge_find = """        const nudgeCTA = `
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

js_nudge_replace = """        const nudgeCTA = `
          <div style="border: 1px solid var(--gray-300); border-radius: 8px; padding: 16px; margin-top: 16px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--black)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               <h4 style="margin:0; color:var(--black); font-weight:700; font-size:14px;">ATS Optimization Payload</h4>
            </div>
            <p style="margin:0 0 16px 0; color:var(--gray-600); font-size:13px; line-height:1.5;">Copy the pre-configured ATS payload to your clipboard and use your preferred external tool (e.g. Claude, ChatGPT) to automatically resolve the missing keywords.</p>
            <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--gray-800); color:white; border-radius:6px; padding:10px 16px; font-weight:600; font-size:13px; border:none; cursor:pointer; width:100%; transition: background 0.2s;" onmouseover="this.style.background='var(--black)';" onmouseout="this.style.background='var(--gray-800)';">
              Copy Optimization Payload
            </button>
            <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin:12px 0 0 0; line-height:1.4; text-align:center;">
              <em>System generates exact match phrasing</em>
            </p>
          </div>
        `;"""

if js_nudge_find in html:
    html = html.replace(js_nudge_find, js_nudge_replace)
    print("Redesigned CTA to be clinical!")
else:
    print("Could not find nudgeCTA to replace.")

# 3. Replace the 📄 emoji with a clean SVG in the HTML upload zone
html_upload_find = """<div style="font-size:32px; margin-bottom: 12px;">📄</div>"""
html_upload_replace = """<div style="margin-bottom: 12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div>"""

if html_upload_find in html:
    html = html.replace(html_upload_find, html_upload_replace)
    print("Fixed initial upload zone icon!")
else:
    print("Could not find initial upload zone icon.")
    
# 4. Replace the 📄 emoji with a clean SVG in the JS reset block
js_upload_find = """uploadZone.innerHTML = '<div style="font-size:32px; margin-bottom:12px; color:var(--gray-400);">📄</div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div><div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>';"""
js_upload_replace = """uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div><div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>';"""

if js_upload_find in html:
    html = html.replace(js_upload_find, js_upload_replace)
    print("Fixed JS reset upload zone icon!")
else:
    print("Could not find JS reset upload zone icon.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
