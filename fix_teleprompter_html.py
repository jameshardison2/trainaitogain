import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_prefs = re.search(r'<input type="checkbox" id="toggle-transcript".*?</span>\s*</label>', html, re.DOTALL)

replace_prefs = """<input type="checkbox" id="toggle-transcript" checked style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show my live answer transcript on screen</span>
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">
              <input type="checkbox" id="toggle-teleprompter" style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show Teleprompter Hints (Ideal Keywords)</span>
          </label>"""
          
if find_prefs:
    # Need to keep the first part of the label intact since the regex matches from <input>
    html = html[:find_prefs.start()] + replace_prefs + html[find_prefs.end():]
else:
    print("WARNING: Could not find prefs HTML")

# Cache bust
html = html.replace('<!-- CACHE BUST 12', '<!-- CACHE BUST 13')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected teleprompter HTML to fix null pointer crash")
