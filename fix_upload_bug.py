import re

for filename in ['resume-ats-guide.html', 'apply.html']:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
            
        # We need to change the JS that resets the upload zone so it doesn't destroy the input.
        # It currently does: uploadZone.innerHTML = '... Click to Upload PDF or DOCX</div>';
        
        # Let's find all instances of uploadZone.innerHTML = ... and add the input back AND reattach the listener!
        # Actually, the easiest way is to use event delegation!
        # But wait, we can just find the place where it resets the upload zone, and append the input element.
        
        old_reset = """uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>';"""
        
        # We can just change the HTML to include the input, BUT we need to reattach the event listener.
        # How is the event listener defined? It's a massive block: `fileInput.addEventListener('change', async (e) => { ... })`
        # If we just change the reset logic to NOT touch the innerHTML, but instead just find the text divs and change them?
        # Let's wrap the content inside the upload zone in a div initially!
        
        # 1. Modify the initial HTML
        html = html.replace(
            '<div id="ats-upload-zone"',
            '<div id="ats-upload-zone"'
        )
        # Actually, let's just make the JS reset logic only change the text node.
        # When extracting: uploadZone.querySelector('.upload-content').innerHTML = ...
        
        # Let's inject a wrapper:
        html = html.replace(
            """<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div>
        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
      <input type="file" id="ats-file-input" """,
            """<div id="upload-content-wrapper">
        <div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div>
        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
      </div>
      <input type="file" id="ats-file-input" """
        )
        
        # Now change the JS that updates it during extraction:
        html = html.replace(
            """uploadZone.innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Extracting text locally...</div>';""",
            """document.getElementById('upload-content-wrapper').innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Extracting text locally...</div>';"""
        )
        
        html = html.replace(
            """uploadZone.innerHTML = '<div style="font-size:24px; margin-bottom:12px;">📄</div><div style="font-weight:700; color:var(--black);">Securely reading your resume...</div>';""",
            """document.getElementById('upload-content-wrapper').innerHTML = '<div style="font-size:24px; margin-bottom:12px;">📄</div><div style="font-weight:700; color:var(--black);">Securely reading your resume...</div>';"""
        )
        
        # And the JS that resets it when changing role:
        html = html.replace(
            """uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>';""",
            """document.getElementById('upload-content-wrapper').innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>';"""
        )
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
            
    except Exception as e:
        print(f"Skipping {filename}: {e}")

print("Fixed upload bug.")
