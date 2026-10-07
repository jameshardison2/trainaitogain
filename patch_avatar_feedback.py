import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Teleprompter Checkbox Fix
old_checkbox = r'<label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:24px; padding:12px; background:rgba\(0,0,0,0\.2\); border-radius:8px; border:1px solid rgba\(255,255,255,0\.05\);">'
new_checkbox = r'<label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:24px; padding:16px; background:rgba(16,185,129,0.05); border-radius:8px; border:1px solid rgba(16,185,129,0.3); transition:all 0.2s;" onmouseover="this.style.background=\'rgba(16,185,129,0.1)\'" onmouseout="this.style.background=\'rgba(16,185,129,0.05)\'">'
content = re.sub(old_checkbox, new_checkbox, content)
content = content.replace('id="toggle-teleprompter" style="width:20px; height:20px; accent-color:var(--primary); cursor:pointer;"', 'id="toggle-teleprompter" style="width:24px; height:24px; accent-color:var(--primary); cursor:pointer;"')

# 2. Copilot Empty State Fix
old_copilot = r'<p style="font-size:13px; color:#888; margin-bottom:24px; line-height:1.5; display:flex; align-items:center; gap:8px;" id="copilot-status"><span style="display:inline-block; width:8px; height:8px; background:#888; border-radius:50%; animation:pulse 2s infinite;"></span> Waiting for interview telemetry...</p>'
new_copilot = r"""<div id="copilot-status" style="margin-bottom:24px;">
        <p style="font-size:13px; color:#888; margin:0; line-height:1.5; display:flex; align-items:center; gap:8px;"><span style="display:inline-block; width:8px; height:8px; background:#888; border-radius:50%; animation:pulse 2s infinite;"></span> Waiting for interview telemetry...</p>
        <div style="border:1px dashed rgba(255,255,255,0.15); padding:16px; border-radius:8px; background:rgba(0,0,0,0.2); margin-top:16px;">
            <h4 style="color:var(--primary); font-size:12px; text-transform:uppercase; margin-top:0; margin-bottom:12px; font-weight:800; display:flex; align-items:center; gap:6px;">⚙️ AI Copilot Functions</h4>
            <ul style="font-size:13px; color:#aaa; margin:0; padding-left:16px; line-height:1.6; display:flex; flex-direction:column; gap:8px;">
                <li>Real-time speech transcription</li>
                <li>STAR+ Rubric tracking</li>
                <li>Instant coaching feedback</li>
            </ul>
        </div>
    </div>"""
content = re.sub(old_copilot, new_copilot, content)

# 3. Mic Check Fix
old_mic = r"""<div style="background:rgba\(245,158,11,0\.1\); border:1px solid rgba\(245,158,11,0\.3\); color:var\(--accent\); padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:8px; text-transform:uppercase; letter-spacing:0\.05em;"><span style="display:inline-block; width:8px; height:8px; background:var\(--accent\); border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div>
      <p style="font-size:13px; color:#aaa; margin-top:0; margin-bottom:16px; font-weight:500;">\(Please click "Allow" when prompted for microphone access\)</p>"""
new_mic = r"""<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:var(--accent); padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:var(--accent); border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check <span style="font-weight:600; opacity:0.8; margin-left:6px; padding-left:10px; border-left:1px solid rgba(245,158,11,0.3); text-transform:none; letter-spacing:normal;">(Click "Allow" when prompted)</span></div>"""
content = re.sub(old_mic, new_mic, content)

# 4. Mobile Footer Fix
old_footer = r'<div class="container" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:0;">'
new_footer = r'<div class="container" id="sticky-nav-container" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:0;">'
content = content.replace(old_footer, new_footer)

mobile_style = """
    @media (max-width: 600px) {
        #sticky-nav-container { flex-direction: column !important; gap: 12px !important; }
        #sticky-nav-container a { width: 100% !important; text-align: center !important; justify-content: center !important; display: flex; align-items: center; box-sizing: border-box; }
        .prep-hub { padding-bottom: 160px !important; }
    }
"""
if "#sticky-nav-container" not in content:
    content = content.replace('</style>', mobile_style + '\n  </style>')

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied avatar feedback fixes")
