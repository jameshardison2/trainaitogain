import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_find = """          // We can also create a sleek "File Loaded" visual representation
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
          
          resumeBox.parentNode.insertBefore(fileCard, resumeBox);"""

js_replace = """          // We can also create a sleek "File Loaded" visual representation
          const fileCard = document.createElement('div');
          fileCard.style.padding = '16px';
          fileCard.style.border = '1px solid var(--gray-200)';
          fileCard.style.borderRadius = 'var(--radius-sm)';
          fileCard.style.background = 'var(--white)';
          fileCard.style.display = 'flex';
          fileCard.style.alignItems = 'center';
          fileCard.style.justifyContent = 'space-between';
          fileCard.style.marginBottom = '12px';
          
          fileCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> 
              <span style="font-weight:600; color:var(--black);">resume_final.pdf</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button id="btn-edit-text" style="background:none; border:1px solid var(--gray-300); padding:6px 10px; border-radius:4px; font-size:12px; cursor:pointer; color:var(--gray-600); font-weight:600;">Paste AI Fix</button>
              <button id="btn-replace-file" style="background:none; border:1px solid var(--gray-300); padding:6px 10px; border-radius:4px; font-size:12px; cursor:pointer; color:var(--gray-600); font-weight:600;">Upload New</button>
            </div>
          `;
          
          resumeBox.parentNode.insertBefore(fileCard, resumeBox);
          
          document.getElementById('btn-edit-text').onclick = function() {
              resumeBox.style.display = 'block';
              resumeBox.value = '';
              resumeBox.placeholder = 'Paste your new AI-updated resume text here...';
              resumeBox.focus();
              fileCard.style.display = 'none';
              if(labelEl) labelEl.innerHTML = '3. Paste AI-Updated Resume:<br><span style="font-size:13px; color:var(--gray-500); font-weight:400; display:block; margin-top:4px;">Paste the new resume you got from ChatGPT below and click Scan.</span>';
          };
          
          document.getElementById('btn-replace-file').onclick = function() {
              fileCard.style.display = 'none';
              uploadZone.style.display = 'flex';
              resumeBox.style.display = 'none';
              resumeBox.value = '';
              if(labelEl) labelEl.innerHTML = '3. Upload Your Resume:';
              uploadZone.style.pointerEvents = 'auto';
              uploadZone.innerHTML = '<div style="font-size:32px; margin-bottom:12px; color:var(--gray-400);">📄</div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div><div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>';
          };"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added replace/edit buttons to the file card!")
else:
    print("Could not find file card JS block.")
