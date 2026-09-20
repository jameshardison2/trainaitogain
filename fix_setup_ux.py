import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the corrupted double label tag that broke flexbox
find_corrupted_label = """          <label style="display:flex; align-items:center; gap:12px; margin-bottom:20px; cursor:pointer;">
              <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">
              <input type="checkbox" id="toggle-teleprompter" style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show Teleprompter Hints (Ideal Keywords)</span>
          </label>"""

replace_fixed_label = """          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:24px; padding:12px; background:rgba(0,0,0,0.2); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
              <input type="checkbox" id="toggle-teleprompter" style="width:20px; height:20px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:15px; color:white; font-weight:600;">Enable Teleprompter (Display Ideal Answer)</span>
          </label>"""

if find_corrupted_label in html:
    html = html.replace(find_corrupted_label, replace_fixed_label)
else:
    print("Warning: Could not find corrupted label")

# 2. Increase the max-width of the setup boxes from 400px to 600px to give it a premium, spacious feel
html = html.replace('max-width:400px;', 'max-width:600px;')

# Cache bust
html = html.replace('<!-- CACHE BUST 15', '<!-- CACHE BUST 16')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed setup UX and expanded container size")
