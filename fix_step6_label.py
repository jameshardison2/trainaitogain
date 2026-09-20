import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_label = """<label id="step-6-label" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">6. Scan Your Resume:</label>"""
replace_label = """<label id="step-6-label" style="display:none; font-weight:700; margin-bottom:8px; color:var(--black);">6. Scan Your Resume:</label>"""

if find_label in html:
    html = html.replace(find_label, replace_label)
    print("Hid step 6 label initially!")
else:
    print("Could not find step 6 label.")

find_js = """            const step5 = document.getElementById('step-5-container');
            if (step5) step5.style.display = 'block';"""
replace_js = """            const step5 = document.getElementById('step-5-container');
            if (step5) step5.style.display = 'block';
            
            const step6 = document.getElementById('step-6-label');
            if (step6) step6.style.display = 'block';"""

if find_js in html:
    html = html.replace(find_js, replace_js)
    print("Added logic to reveal step 6 label!")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
