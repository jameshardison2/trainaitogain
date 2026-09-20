import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We will add a clear instruction to paste the updated resume.
# We can change the placeholder of the resumeBox or add a new label.

label_find = '<label for="resume-text" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">2. Paste Your Resume:</label>'
label_replace = '<label for="resume-text" id="resume-label" style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">2. Paste Your Resume (Original or AI Updated):</label>'

if label_find in html:
    html = html.replace(label_find, label_replace)
    
# In the JS, when the AI timer finishes, we can change the label to make it obvious
js_find = "helperText.innerHTML = '<span style=\\\"color:#ef4444; font-weight:700;\\\">⏳ Time is up!</span> You\\'ve got this. Paste your new AI-upgraded resume into the box above and hit Scan to verify it passes. Let\\'s get you hired!';"
js_replace = """helperText.innerHTML = '<span style=\"color:#ef4444; font-weight:700;\">⏳ Time is up!</span> You\\'ve got this. Paste your new AI-upgraded resume into the box above and hit Scan to verify it passes. Let\\'s get you hired!';
                  document.getElementById('resume-label').innerText = '🔥 Paste Your New AI-Updated Resume Here:';
                  document.getElementById('resume-text').value = '';
                  document.getElementById('resume-text').placeholder = 'Paste the new resume that ChatGPT/Claude just generated for you here...';
"""

if js_find in html:
    html = html.replace(js_find, js_replace)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added paste section logic!")
