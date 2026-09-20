import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_step5 = """    <!-- Step 5 Textarea -->
    <div id="step-5-container" style="display:none; margin-top:24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:8px;">
        <label id="step-5-label" style="display:block; font-weight:700; color:var(--black);">5. Provide AI-Updated Resume:</label>
        <button id="btn-upload-instead" type="button" style="background:white; border:1px solid var(--gray-300); border-radius:6px; padding:6px 12px; font-size:13px; cursor:pointer; color:var(--black); font-weight:700; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='var(--primary)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.color='var(--black)';" onclick="document.getElementById('ats-file-input').click();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload PDF or DOCX
        </button>
      </div>
      <textarea class="resume-box" id="resume-text" style="height:250px; display:block;" placeholder="Paste the raw text here, or click &quot;Upload PDF or DOCX&quot; above..."></textarea>
    </div>
    
    <div id="step-6-container" style="margin-top:24px;">
      <label id="step-6-label" style="display:none; font-weight:700; margin-bottom:8px; color:var(--black);">6. Scan Your Resume:</label>
      <button class="btn-scan" id="scan-btn">Scan My Resume</button>
    </div>"""

replace_step5 = """    <!-- Step 5 Textarea -->
    <div id="step-5-container" style="display:none; margin-top:24px;">
      <label id="step-5-label" style="display:block; font-weight:700; color:var(--black); margin-bottom:12px;">5. Provide AI-Updated Resume:</label>
      
      <button id="btn-upload-instead" type="button" style="background:var(--primary); color:white; border:none; border-radius:6px; padding:14px 16px; font-size:15px; cursor:pointer; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; transition:all 0.2s; box-shadow:0 4px 6px rgba(16,185,129,0.2); margin-bottom:12px;" onmouseover="this.style.opacity='0.9';" onmouseout="this.style.opacity='1';" onclick="document.getElementById('ats-file-input').click();">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        Upload AI-Updated PDF or DOCX
      </button>
      
      <div style="text-align:center; color:var(--gray-500); font-size:12px; margin-bottom:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">— OR PASTE TEXT —</div>
      
      <textarea class="resume-box" id="resume-text" style="height:250px; display:block; margin-bottom:12px;" placeholder="Paste the raw text here..."></textarea>
      
      <button class="btn-scan" id="scan-btn" style="width:100%; padding:14px 16px; font-size:15px;">Scan My Resume</button>
    </div>
    
    <div id="step-6-container" style="display:none;">
    </div>"""

if find_step5 in html:
    html = html.replace(find_step5, replace_step5)
    print("Step 5 UI redesigned and Step 6 removed!")
else:
    print("Could not find step 5 block.")
    
with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
