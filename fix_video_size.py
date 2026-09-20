import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Expand the overall grid max-width from 1000px to 1400px
find_prep_hub = """.prep-hub { max-width: 1000px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; align-items: stretch; }"""
replace_prep_hub = """.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 48px; align-items: stretch; }"""
if find_prep_hub in html:
    html = html.replace(find_prep_hub, replace_prep_hub)
else:
    print("Warning: Could not find prep-hub CSS")

# 2. Make the teleprompter more transparent and slightly smaller font to fit inside
find_tele_box = """<div id="teleprompter-box" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100; background:rgba(0,0,0,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:32px 48px; width:80%; max-width:800px; display:none; backdrop-filter:blur(12px); text-align:center; box-shadow:0 24px 64px rgba(0,0,0,0.8);">
              <div style="font-size:12px; color:var(--primary); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:16px;">Teleprompter (Read Aloud)</div>
              <div id="teleprompter-text" style="font-size:28px; color:white; font-weight:700; line-height:1.4; text-shadow: 0 4px 12px rgba(0,0,0,0.8);"></div>"""

replace_tele_box = """<div id="teleprompter-box" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px 32px; width:90%; max-height:85%; overflow-y:auto; max-width:800px; display:none; backdrop-filter:blur(4px); text-align:center; box-shadow:0 12px 32px rgba(0,0,0,0.5);">
              <div style="font-size:12px; color:var(--primary); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:12px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Teleprompter (Read Aloud)</div>
              <div id="teleprompter-text" style="font-size:24px; color:white; font-weight:700; line-height:1.5; text-shadow: 0 2px 8px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.8);"></div>"""
if find_tele_box in html:
    html = html.replace(find_tele_box, replace_tele_box)
else:
    print("Warning: Could not find teleprompter box")


# Cache bust
html = html.replace('<!-- CACHE BUST 16', '<!-- CACHE BUST 17')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Expanded video player size and improved teleprompter transparency")
