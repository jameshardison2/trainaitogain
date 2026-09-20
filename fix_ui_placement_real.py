import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_find = """          fileCard.innerHTML = `
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
          
          document.getElementById('btn-edit-text').onclick = function() {"""

js_replace = """          fileCard.style.marginBottom = '8px'; // reduce margin since we have actions below it
          fileCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> 
              <span style="font-weight:600; color:var(--black);">resume_final.pdf</span>
            </div>
          `;
          
          const secondaryActions = document.createElement('div');
          secondaryActions.className = 'ats-secondary-actions'; // for easy cleanup
          secondaryActions.style.display = 'flex';
          secondaryActions.style.justifyContent = 'center';
          secondaryActions.style.gap = '24px';
          secondaryActions.style.alignItems = 'center';
          secondaryActions.style.marginBottom = '24px';
          secondaryActions.style.marginTop = '12px';
          secondaryActions.style.padding = '0 4px';
          
          secondaryActions.innerHTML = `
             <button id="btn-edit-text" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--primary); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               Paste AI-Updated Text
             </button>
             <button id="btn-replace-file" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--gray-500); font-weight:600; display:flex; align-items:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               Upload Different PDF
             </button>
          `;
          
          resumeBox.parentNode.insertBefore(fileCard, resumeBox);
          resumeBox.parentNode.insertBefore(secondaryActions, resumeBox);
          
          document.getElementById('btn-edit-text').onclick = function() {"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed UI layout correctly!")
else:
    print("Could not find file card block.")

