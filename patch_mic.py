with open('ai-interview.html', 'r') as f:
    content = f.read()

old = '<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#f59e0b; padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div><br>\n      <button class="btn-sim" id="start-btn">'
new = '<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:var(--accent); padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:var(--accent); border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div>\n      <p style="font-size:13px; color:#aaa; margin-top:0; margin-bottom:16px; font-weight:500;">(Please click "Allow" when prompted for microphone access)</p>\n      <button class="btn-sim" id="start-btn">'

content = content.replace(old, new)

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied mic check fix")
