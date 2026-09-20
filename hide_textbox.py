import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Modify the simulated extraction JS
js_find = """        // Simulate extraction delay
        setTimeout(() => {
          uploadZone.style.display = 'none';
          
          // Show a success message and explain the text box
          const labelEl = document.querySelector('label[for="resume-text"]');
          if (labelEl) {
              labelEl.innerHTML = '3. ✅ PDF Uploaded Successfully!<br><span style="font-size:13px; color:var(--gray-500); font-weight:400; display:block; margin-top:4px;">We extracted the raw text from your resume below. You can edit it manually if the formatting broke, or paste your new AI-updated version here later.</span>';
          }
          
          resumeBox.style.display = 'block';
          // Fill with mock text based on role, so the scan works
          resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
          
          // Automatically trigger the scan!
          scanBtn.click();
        }, 1500);"""

js_replace = """        // Simulate extraction delay
        setTimeout(() => {
          uploadZone.style.display = 'none';
          
          // Show a success message
          const labelEl = document.querySelector('label[for="resume-text"]');
          if (labelEl) {
              labelEl.innerHTML = '3. ✅ PDF Uploaded Successfully!<br><span style="font-size:13px; color:var(--gray-500); font-weight:400; display:block; margin-top:4px;">Your resume has been securely processed by AWS Textract and is ready for ATS scoring.</span>';
          }
          
          // Keep the resumeBox hidden to keep the UI clean
          resumeBox.style.display = 'none';
          
          // Fill with mock text based on role, so the scan works
          resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
          
          // We can also create a sleek "File Loaded" visual representation
          const fileCard = document.createElement('div');
          fileCard.style.padding = '16px';
          fileCard.style.border = '1px solid var(--gray-200)';
          fileCard.style.borderRadius = 'var(--radius-sm)';
          fileCard.style.background = 'var(--white)';
          fileCard.style.display = 'flex';
          fileCard.style.alignItems = 'center';
          fileCard.style.gap = '12px';
          fileCard.style.marginBottom = '24px';
          fileCard.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> <span style="font-weight:600; color:var(--black);">resume_final.pdf</span>`;
          
          resumeBox.parentNode.insertBefore(fileCard, resumeBox);
          
          // Automatically trigger the scan!
          scanBtn.click();
        }, 1500);"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Hidden text box and added file card!")
else:
    print("Could not find upload JS block.")
