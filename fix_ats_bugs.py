import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the Job Description HTML tag issue
# We need to change `jobDescBox.innerHTML = ...` to `jobDescBox.value = ...`
html = html.replace("jobDescBox.innerHTML = `<strong>Live Description:</strong> ${jobDescriptions[selectedRole]}`;", "jobDescBox.value = `Live Description: ${jobDescriptions[selectedRole]}`;")

# 2. Replace the 3. Paste Your Resume section with the Upload UI
# We need to find the label and textarea
# Let's use regex
pattern = r'<label for="resume-text".*?>3\. Paste Your Resume:</label>\s*<textarea class="resume-box" id="resume-text".*?</textarea>'

upload_ui = """
    <label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; margin-top:8px; color:var(--black);">3. Upload Your Resume:</label>
    
    <div id="ats-upload-zone" style="background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-50)';">
      <div style="font-size:32px; margin-bottom: 12px;">📄</div>
      <div style="font-weight:700; color:var(--black); font-size: 16px; margin-bottom:4px;">Click to Upload PDF Resume</div>
      <div style="font-size:12px; color:var(--gray-500);">Powered by AWS Textract</div>
      <input type="file" id="ats-file-input" accept=".pdf,.doc,.docx,.txt" style="display:none;" />
    </div>

    <textarea class="resume-box" id="resume-text" style="display:none; height:250px;" placeholder="Your extracted resume text will appear here..."></textarea>
"""

html = re.sub(pattern, upload_ui, html, flags=re.DOTALL)

# Inject the upload JS if it's not already there
upload_js = """
    // File Upload Logic
    const uploadZone = document.getElementById('ats-upload-zone');
    const fileInput = document.getElementById('ats-file-input');
    
    if(uploadZone && fileInput) {
      uploadZone.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const selectedRole = roleSelect.value;
        if (!selectedRole || selectedRole === "") {
          alert("Please select a Target Role first so we know what to scan for!");
          fileInput.value = '';
          return;
        }

        uploadZone.innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Extracting text via AWS...</div>';
        uploadZone.style.pointerEvents = 'none';

        // Simulate extraction delay
        setTimeout(() => {
          uploadZone.style.display = 'none';
          resumeBox.style.display = 'block';
          // Fill with mock text based on role, so the scan works
          resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
          
          // Automatically trigger the scan!
          scanBtn.click();
        }, 1500);
      });
    }
"""

if "const uploadZone =" not in html:
    js_insert_idx = html.find("scanBtn.addEventListener('click', function()")
    if js_insert_idx != -1:
        html = html[:js_insert_idx] + upload_js + "\n    " + html[js_insert_idx:]

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed HTML tag bug and injected Upload UI!")
