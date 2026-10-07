import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Update prep-hub to support order
old_hub = r'\.prep-hub \{ max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 48px; align-items: stretch; \}'
new_hub = r'.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: flex; flex-direction: row; gap: 48px; align-items: stretch; }\n    .prep-hub > .cheat-sheet { flex: 1; order: 2; min-width:300px; }\n    .prep-hub > .sim-container { flex: 2; order: 1; min-width:0; }\n    @media (max-width: 800px) { .prep-hub { flex-direction: column; } .prep-hub > .cheat-sheet { order: 2; } .prep-hub > .sim-container { order: 1; } }'

content = re.sub(old_hub, new_hub, content)

# Remove the old mobile query for prep-hub if present
content = content.replace('@media (max-width: 800px) {\n        .prep-hub { grid-template-columns: 1fr; }\n    }', '')

# 2. Add Pre-flight Mic Check pill above Start Button
# Let's find the start button
start_btn = r'<button class="btn-sim" id="start-btn">'
new_start_btn = r'<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#f59e0b; padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div><br>\n      <button class="btn-sim" id="start-btn">'
content = content.replace(start_btn, new_start_btn)

# 3. STAR+ Rubric Visibility
# Currently it's in a <details> tag hidden under "View STAR+ Interview Rubric"
# The user wants it prominent. "Keep the STAR+ scoring breakdown prominent"
# I will change the <details> into a permanently open div.
old_details = r'<details style="max-width:600px; margin: 0 auto 24px auto; background:rgba\(255,255,255,0\.03\); border:1px solid rgba\(255,255,255,0\.1\); border-radius:8px; text-align:left; overflow:hidden;">'
new_details = r'<details open style="max-width:600px; margin: 0 auto 24px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; text-align:left; overflow:hidden;">'
content = re.sub(old_details, new_details, content)

# 4. Teleprompter & Voice Model Placement wording
# Update the label to explicitly mention the humanized OS voices
old_voice_label = r'<label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0\.05em;">AI Voice Model \(Pick the most human one\):</label>'
new_voice_label = r'<label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">AI Voice Model (Pick the most human one like Google US English, Samantha, or Daniel):</label>'
content = re.sub(old_voice_label, new_voice_label, content)

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied UX Refinements")
