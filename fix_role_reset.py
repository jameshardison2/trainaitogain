import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the % bug first
js_score_find = """        scoreText.innerHTML = score + '%' + diffHtml;"""
js_score_replace = """        scoreText.innerHTML = score + diffHtml;"""
if js_score_find in html:
    html = html.replace(js_score_find, js_score_replace)


# Update the change listener to reset the UI
js_reset_find = """    roleSelect.addEventListener('change', function() {
      const selectedRole = this.value;
      if (jobDescriptions[selectedRole]) {
        jobDescBox.value = `Live Description: ${jobDescriptions[selectedRole]}`;
        badge.style.display = 'inline-block';
        badge.innerText = "Synced from Waves DB ✅";
        renderKeywords(selectedRole);
      }
    });"""

js_reset_replace = """    roleSelect.addEventListener('change', function() {
      const selectedRole = this.value;
      if (jobDescriptions[selectedRole]) {
        jobDescBox.value = `Live Description: ${jobDescriptions[selectedRole]}`;
        badge.style.display = 'inline-block';
        badge.innerText = "Synced from Waves DB ✅";
        renderKeywords(selectedRole);
        
        // Reset the ATS scanner UI
        document.getElementById('meter-fill').style.width = '0%';
        document.getElementById('score-text').innerHTML = '0';
        previousScore = null;
        
        const feedbackBox = document.getElementById('feedback-box');
        if(feedbackBox) {
            feedbackBox.innerHTML = '<h4>Awaiting Scan...</h4><p>Upload your resume on the left and we will automatically scan it for you.</p>';
        }
        
        const applyBtn = document.getElementById('apply-btn');
        if(applyBtn) {
            applyBtn.className = 'btn-apply';
            applyBtn.innerText = 'You must score 80%+ to Apply';
            applyBtn.onclick = null;
        }
        
        const uploadZone = document.getElementById('ats-upload-zone');
        const resumeBox = document.getElementById('resume-text');
        if(uploadZone && resumeBox) {
            uploadZone.style.display = 'flex';
            uploadZone.style.pointerEvents = 'auto';
            uploadZone.innerHTML = '<div style="font-size:32px; margin-bottom:12px; color:var(--gray-400);">📄</div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div><div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>';
            
            resumeBox.style.display = 'none';
            resumeBox.value = '';
        }
        
        // Remove the file card if it exists
        const fileCards = document.querySelectorAll('#resume-text');
        // Actually, the file card is inserted BEFORE resumeBox. We didn't give it an ID.
        // Let's just find and remove it.
        const parent = resumeBox.parentNode;
        Array.from(parent.children).forEach(child => {
            if (child.innerHTML && child.innerHTML.includes('resume_final.pdf')) {
                child.remove();
            }
        });
        
        const labelEl = document.querySelector('label[for="resume-text"]');
        if(labelEl) labelEl.innerHTML = '3. Upload Your Resume:';
        
        scanBtn.innerText = 'Scan My Resume';
      }
    });"""

if js_reset_find in html:
    html = html.replace(js_reset_find, js_reset_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added UI reset logic on role change!")
else:
    print("Could not find roleSelect listener.")
