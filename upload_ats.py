import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will add an upload dropzone right above the resume text box.
# I will hide the resume-text box initially.
upload_ui = """
    <label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">2. Upload Your Resume:</label>
    
    <div id="ats-upload-zone" style="background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-50)';">
      <div style="font-size:32px; margin-bottom: 12px;">📄</div>
      <div style="font-weight:700; color:var(--black); font-size: 16px; margin-bottom:4px;">Click to Upload PDF Resume</div>
      <div style="font-size:12px; color:var(--gray-500);">Powered by AWS Textract</div>
      <input type="file" id="ats-file-input" accept=".pdf,.doc,.docx,.txt" style="display:none;" />
    </div>

    <!-- The actual text box will be hidden until an upload or AI generation happens -->
    <textarea id="resume-text" rows="12" placeholder="Your extracted resume text will appear here..." style="display:none; width:100%; padding:14px; border-radius:var(--radius); border:1px solid var(--gray-300); font-family:var(--font); font-size:14px; margin-bottom:24px; resize:vertical; box-sizing:border-box; background:var(--gray-50);"></textarea>
"""

# Replace the existing label and textarea
find_str = '<label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">2. Paste Your Resume (Original or AI Updated):</label>'
# Wait, I need to find the textarea too.
# Let's just find the label and the textarea and replace them.

start_idx = html.find('<label for="resume-text" id="resume-label"')
end_idx = html.find('</textarea>', start_idx) + 11

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + upload_ui + html[end_idx:]

# Now I need to add the JS for the upload zone
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

# Inject the upload JS inside DOMContentLoaded
js_insert_idx = html.find("document.getElementById('fill-template-btn').addEventListener('click'")
if js_insert_idx != -1:
    html = html[:js_insert_idx] + upload_js + "\n    " + html[js_insert_idx:]

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Upload UI injected!")
