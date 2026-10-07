import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# Fix 1: Insert ElevenLabs input
eleven_input = """          <p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don't like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>
          
          <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05);">
             <label style="display:block; font-size:12px; color:var(--accent); margin-bottom:8px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">ElevenLabs API (Ultra-Realistic Streaming):</label>
             <input type="password" id="eleven-key" placeholder="Paste ElevenLabs API Key for Flash v2.5 Voice" style="width:100%; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.2); color:white; font-size:13px; font-family:monospace;" onchange="if(this.value) localStorage.setItem('elevenlabs_key', this.value); else localStorage.removeItem('elevenlabs_key');">
             <p style="font-size:11px; color:#666; margin-top:6px; margin-bottom:0;">Leave blank to use default browser voices. (Key is saved securely in local browser storage only).</p>
          </div>"""

target_p = '<p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don\'t like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>'

content = content.replace(target_p, eleven_input)

# Fix 2: Change "Loading voices..." to "Google US English (Recommended)"
content = content.replace('<option value="">Loading voices...</option>', '<option value="">Google US English (Recommended)</option>')

# Fix 3: Add Microphone helper text
# Current pre-flight mic check block:
# <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#f59e0b; padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div><br>
#       <button class="btn-sim" id="start-btn">
# Let's replace the Pre-flight mic check block entirely to add the subtext
old_mic_check = r'<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#f59e0b; padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div><br>\n      <button class="btn-sim" id="start-btn">'

new_mic_check = r"""<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:var(--accent); padding:8px 16px; border-radius:100px; font-size:12px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;"><span style="display:inline-block; width:8px; height:8px; background:var(--accent); border-radius:50%; animation:pulse 2s infinite;"></span> Pre-flight Mic Check</div>
      <p style="font-size:13px; color:#aaa; margin-top:0; margin-bottom:16px; font-weight:500;">(Please click "Allow" when prompted for microphone access)</p>
      <button class="btn-sim" id="start-btn">"""
content = re.sub(old_mic_check, new_mic_check, content)

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied missing ElevenLabs and Mic Check UX updates")
