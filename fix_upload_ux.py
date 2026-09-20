import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We want to change what happens after the mock upload finishes.
# Find the simulated extraction delay in the JS:

js_find = """        // Simulate extraction delay
        setTimeout(() => {
          uploadZone.style.display = 'none';
          resumeBox.style.display = 'block';
          // Fill with mock text based on role, so the scan works
          resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
          
          // Automatically trigger the scan!
          scanBtn.click();
        }, 1500);"""

js_replace = """        // Simulate extraction delay
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

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed upload UX!")
else:
    print("Could not find upload JS block.")
