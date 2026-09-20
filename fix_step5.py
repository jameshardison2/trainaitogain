import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the HTML block containing Step 3 and Step 5
find_html = """    <div id="step-3-container">
      <label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; margin-top:8px; color:var(--black);">3. Upload Your Resume:</label>
      <div id="ats-upload-zone" style="background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-50)';">
        <div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div>
        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
      </div>
      <input type="file" id="ats-file-input" accept=".pdf,.docx" style="display:none;" />
      <!-- fileCard will be injected here -->
      <div id="injected-file-container"></div>
    </div>
    
    <!-- Step 4 Payload -->
    <div id="item-4-container" style="display:none; margin-top:24px;"></div>

    <!-- Step 5 Textarea -->
    <div id="step-5-container" style="display:none; margin-top:24px;">
      <label id="step-5-label" style="display:block; font-weight:700; color:var(--black); margin-bottom:12px;">5. Provide AI-Updated Resume:</label>
      
      <button id="btn-upload-instead" type="button" style="background:var(--primary); color:white; border:none; border-radius:6px; padding:14px 16px; font-size:15px; cursor:pointer; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; transition:all 0.2s; box-shadow:0 4px 6px rgba(16,185,129,0.2); margin-bottom:12px;" onmouseover="this.style.opacity='0.9';" onmouseout="this.style.opacity='1';" onclick="document.getElementById('ats-file-input').click();">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        Upload AI-Updated PDF or DOCX
      </button>
      
      <div style="text-align:center; color:var(--gray-500); font-size:12px; margin-bottom:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">— OR PASTE TEXT —</div>
      
      <textarea class="resume-box" id="resume-text" style="height:250px; display:block; margin-bottom:12px;" placeholder="Paste the raw text here..."></textarea>
      
      <button class="btn-scan" id="scan-btn" style="width:100%; padding:14px 16px; font-size:15px;">Scan My Resume</button>
    </div>"""

replace_html = """    <div id="step-3-container">
      <label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; margin-top:8px; color:var(--black);">3. Provide Your Resume:</label>
      <div id="ats-upload-zone" style="background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-50)';">
        <div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div>
        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
      </div>
      <input type="file" id="ats-file-input" accept=".pdf,.docx" style="display:none;" />
      <!-- fileCard will be injected here -->
      <div id="injected-file-container"></div>
      
      <div style="text-align:center; color:var(--gray-500); font-size:12px; margin-bottom:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">— OR PASTE TEXT —</div>
      
      <textarea class="resume-box" id="resume-text" style="height:250px; display:block; margin-bottom:12px;" placeholder="Paste the raw text here..."></textarea>
      
      <button class="btn-scan" id="scan-btn" style="width:100%; padding:14px 16px; font-size:15px;">Scan My Resume</button>
    </div>
    
    <!-- Step 4 Payload -->
    <div id="item-4-container" style="display:none; margin-top:24px;"></div>"""

html = html.replace(find_html, replace_html)

# Now remove all JS references to step-5-container and btn-upload-instead
html = re.sub(r"const s5 = document\.getElementById\('step-5-container'\);\n\s*if\(s5\) s5\.style\.display = '[^']+';", "", html)
html = re.sub(r"const step5 = document\.getElementById\('step-5-container'\);\n\s*if\s*\(step5\)\s*step5\.style\.display\s*=\s*'block';", "", html)
html = re.sub(r"document\.getElementById\('step-5-container'\)\.style\.display\s*=\s*'none';", "", html)
html = re.sub(r"const step6 = document\.getElementById\('step-6-label'\);\n\s*if\s*\(step6\)\s*step6\.style\.display\s*=\s*'block';", "", html)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed step 5 entirely.")
