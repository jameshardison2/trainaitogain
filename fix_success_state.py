import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the broken step 5 innerHTML destruction
# First, revert the previous JS replacement:
find_js_bad = """        if (applyBtn) {
            if (score >= 100) {
                const s5 = document.getElementById('step-5-container');
                if(s5) {
                    s5.innerHTML = '<div style="background:#ecfdf5; border:1px solid #34d399; padding:24px; border-radius:12px; text-align:center;"><div style="font-size:32px; margin-bottom:12px;">✅</div><h3 style="color:#065f46; margin:0 0 8px 0;">Resume Fully Optimized!</h3><p style="margin:0; color:#047857; font-size:14px;">Your resume has successfully hit a 100% keyword match. Click the Next Step button to proceed.</p></div>';
                }
            }
            if (score >= 80) {"""
            
replace_js_good = """        if (applyBtn) {
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
            if (score >= 80) {"""

if find_js_bad in html:
    html = html.replace(find_js_bad, replace_js_good)
    print("JS logic fixed!")
else:
    print("Could not find bad JS logic.")

# Now we need to inject <div id="success-container"> right after step-5-container
find_html = """      <button class="btn-scan" id="scan-btn" style="width:100%; padding:14px 16px; font-size:15px;">Scan My Resume</button>
    </div>"""

replace_html = """      <button class="btn-scan" id="scan-btn" style="width:100%; padding:14px 16px; font-size:15px;">Scan My Resume</button>
    </div>
    
    <div id="success-container" style="display:none; background:#ecfdf5; border:1px solid #34d399; padding:24px; border-radius:12px; text-align:center; margin-top:24px;">
      <div style="font-size:32px; margin-bottom:12px;">✅</div>
      <h3 style="color:#065f46; margin:0 0 8px 0;">Resume Fully Optimized!</h3>
      <p style="margin:0; color:#047857; font-size:14px;">Your resume has successfully hit a 100% keyword match. Click the Next Step button to proceed.</p>
    </div>"""

if find_html in html:
    html = html.replace(find_html, replace_html)
    print("HTML success container injected!")
else:
    print("Could not find HTML block.")
    
# We also need to hide success-container when they select a new role
find_role_reset = """        // Reset the ATS scanner UI
        document.getElementById('meter-fill').style.width = '0%';
        document.getElementById('score-text').innerHTML = '0%';"""

replace_role_reset = """        // Reset the ATS scanner UI
        document.getElementById('meter-fill').style.width = '0%';
        document.getElementById('score-text').innerHTML = '0%';
        document.getElementById('score-text').style.color = '#ef4444';
        
        const successMsg = document.getElementById('success-container');
        if(successMsg) successMsg.style.display = 'none';
        
        const s5 = document.getElementById('step-5-container');
        if(s5) s5.style.display = 'block';"""

if find_role_reset in html:
    html = html.replace(find_role_reset, replace_role_reset)
    print("Role reset logic fixed!")
else:
    print("Could not find role reset logic.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
