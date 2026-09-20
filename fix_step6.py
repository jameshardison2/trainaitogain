import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_btn = """<button class="btn-scan" id="scan-btn" style="margin-top:24px;">Scan My Resume</button>"""
replace_btn = """<div id="step-6-container" style="margin-top:24px;">
      <label id="step-6-label" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">6. Scan Your Resume:</label>
      <button class="btn-scan" id="scan-btn">Scan My Resume</button>
    </div>"""

if find_btn in html:
    html = html.replace(find_btn, replace_btn)
    print("Wrapped button in Step 6!")
else:
    print("Could not find button.")

# Let's also hide Step 6 label initially, and reveal it when Step 5 is revealed?
# Actually, the user might want it visible all the time. But since 4 and 5 are hidden, "3... 6" is weird.
# Let's dynamically reveal the label.
find_js = """            const step5 = document.getElementById('step-5-container');
            if (step5) step5.style.display = 'block';"""

replace_js = """            const step5 = document.getElementById('step-5-container');
            if (step5) step5.style.display = 'block';
            
            const scanBtn = document.getElementById('scan-btn');
            if (scanBtn) scanBtn.innerText = 'Scan Updated Resume';"""

html = html.replace(find_js, replace_js)

# Wait, if I just rename the button to "6. Rescan Resume" when Step 5 opens, that's cleaner than a label.
# I will change the button text.

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
