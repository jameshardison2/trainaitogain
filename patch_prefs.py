import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Advanced Audio Accordion
old_block = """          <label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">AI Voice Model (Pick the most human one like Google US English, Samantha, or Daniel):</label>
          <div style="position:relative;">
              <select id="voice-select" style="width:100%; padding:12px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:#111; color:white; font-size:15px; appearance:none; cursor:pointer; font-weight:500;">
                  <option value="">Google US English (Recommended)</option>
              </select>
              <span style="position:absolute; right:16px; top:12px; color:#aaa; pointer-events:none; font-size:12px;">▼</span>
          </div>
                    <p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don't like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>
          
          <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05);">
             <label style="display:block; font-size:12px; color:var(--accent); margin-bottom:8px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">ElevenLabs API (Ultra-Realistic Streaming):</label>
             <input type="password" id="eleven-key" placeholder="Paste ElevenLabs API Key for Flash v2.5 Voice" style="width:100%; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.2); color:white; font-size:13px; font-family:monospace;" onchange="if(this.value) localStorage.setItem('elevenlabs_key', this.value); else localStorage.removeItem('elevenlabs_key');">
             <p style="font-size:11px; color:#666; margin-top:6px; margin-bottom:0;">Leave blank to use default browser voices. (Key is saved securely in local browser storage only).</p>
          </div>"""

new_block = """          <details style="margin-top:16px; border-top:1px solid rgba(255,255,255,0.05); padding-top:16px;">
             <summary style="cursor:pointer; font-size:13px; font-weight:800; color:var(--primary); outline:none; user-select:none; display:flex; align-items:center; gap:8px;">
                <span>🎛️ Advanced Audio Settings</span><span style="font-size:10px; color:#666;">(Optional)</span>
             </summary>
             <div style="padding-top:16px;">
                <label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">AI Voice Model (Pick the most human one like Google US English, Samantha, or Daniel):</label>
                <div style="position:relative;">
                    <select id="voice-select" style="width:100%; padding:12px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:#111; color:white; font-size:15px; appearance:none; cursor:pointer; font-weight:500;">
                        <option value="">Google US English (Recommended)</option>
                    </select>
                    <span style="position:absolute; right:16px; top:12px; color:#aaa; pointer-events:none; font-size:12px;">▼</span>
                </div>
                <p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don't like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>
                
                <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05);">
                   <label style="display:block; font-size:12px; color:var(--accent); margin-bottom:8px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">ElevenLabs API (Ultra-Realistic Streaming):</label>
                   <input type="password" id="eleven-key" placeholder="Paste ElevenLabs API Key for Flash v2.5 Voice" style="width:100%; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.2); color:white; font-size:13px; font-family:monospace;" onchange="if(this.value) localStorage.setItem('elevenlabs_key', this.value); else localStorage.removeItem('elevenlabs_key');">
                   <p style="font-size:11px; color:#666; margin-top:6px; margin-bottom:0;">Leave blank to use default browser voices. (Key is saved securely in local browser storage only).</p>
                </div>
             </div>
          </details>"""

content = content.replace(old_block, new_block)

# 2. Collapse the STAR+ Rubric (remove the "open" attribute)
content = content.replace('<details open style="max-width:600px; margin: 0 auto 24px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; text-align:left; overflow:hidden;">', '<details style="max-width:600px; margin: 0 auto 24px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; text-align:left; overflow:hidden;">')

# 3. Clean up the Sidebar Empty State (Copilot)
old_status = '<p style="font-size:13px; color:#888; margin-bottom:24px; line-height:1.5;" id="copilot-status">Waiting for interviewer to speak...</p>'
new_status = '<p style="font-size:13px; color:#888; margin-bottom:24px; line-height:1.5; display:flex; align-items:center; gap:8px;" id="copilot-status"><span style="display:inline-block; width:8px; height:8px; background:#888; border-radius:50%; animation:pulse 2s infinite;"></span> Waiting for interview telemetry...</p>'
content = content.replace(old_status, new_status)

# 4. Sticky Bottom Nav
old_bottom = """  <div style="grid-column: 1 / -1; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
      <a href="resume-ats-guide.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">⬅ Step 1: Resume Optimizer</a>
      <a href="post-hire.html" style="color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 800; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Step 3: Survive the Black Box ➔</a>
  </div>"""

sticky_bottom = """
  <!-- Sticky Bottom Navigation -->
  <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: var(--black); border-top: 1px solid rgba(255,255,255,0.1); padding: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
      <div class="container" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:0;">
          <a href="resume-ats-guide.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">⬅ Step 1: Resume Optimizer</a>
          <a href="post-hire.html" class="btn-primary" style="text-decoration: none; font-size: 14px; padding: 12px 24px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">Step 3: Survive the Black Box ➔</a>
      </div>
  </div>
"""

content = content.replace(old_bottom, "")
content = content.replace('</body>', sticky_bottom + '\n</body>')

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied layout fixes")
