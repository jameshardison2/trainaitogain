import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

replace_active_view = """<div id="active-view" style="display:none; text-align:center;">
      
      <div class="video-container" style="position:relative; width:100%; aspect-ratio:16/9; background:#111; border-radius:12px; overflow:hidden; border:1px solid #333; margin-bottom:24px; box-shadow: 0 12px 32px rgba(0,0,0,0.5);">
          <!-- User's Camera -->
          <video id="user-camera" autoplay muted playsinline style="width:100%; height:100%; object-fit:cover; transform:scaleX(-1); display:none;"></video>
          
          <!-- Placeholder before camera starts -->
          <div id="camera-placeholder" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#1a1a1a;">
              <div style="font-size:48px; margin-bottom:16px; animation: pulse-ring-blue 2s infinite;">📹</div>
              <p style="color:#aaa; font-weight:600;">Accessing Camera...</p>
          </div>
          
          <!-- AI Interviewer overlay -->
          <div id="ai-participant" style="position:absolute; top:16px; right:16px; width:120px; height:90px; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); border-radius:8px; border:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(0,0,0,0.3);">
              <div class="avatar-ring" id="avatar-ring" style="width:40px; height:40px; margin:0; margin-bottom:4px; box-shadow:none;">
                  <div class="avatar-icon" id="avatar-emoji" style="font-size:20px;">👩‍💻</div>
              </div>
              <div style="font-size:10px; font-weight:700; color:#aaa; text-transform:uppercase; letter-spacing:0.05em; margin-top:8px;">AI Recruiter</div>
          </div>
          
          <!-- Real-time captions / status overlay -->
          <div style="position:absolute; bottom:16px; left:0; width:100%; padding:0 32px; box-sizing:border-box;">
              <div id="sim-status-box" style="background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); border-radius:8px; padding:16px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
                  <div class="sim-status" id="sim-status" style="margin-bottom:8px;">Connecting...</div>
                  <div class="sim-text" id="sim-text" style="font-size:18px; min-height:50px; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Initializing AI...</div>
              </div>
          </div>
      </div>
      
      <div class="user-transcript" id="user-transcript" style="font-size:14px;"></div>
      
      <button class="btn-sim" id="next-btn" style="display:none; margin:0 auto;">
        Next Question ➔
      </button>
    </div>"""

# Safely replace using regex
html = re.sub(r'<div id="active-view" style="display:none;">.*?Next Question</button>\n    </div>', replace_active_view, html, flags=re.DOTALL)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Regex injected camera UI to ai-interview.html!")


# Also rename Prep Hub
with open('prep-hub.html', 'r', encoding='utf-8') as f:
    prep = f.read()
    
prep = prep.replace('Interactive Prep Hub', 'AI Interview Prep Hub')

with open('prep-hub.html', 'w', encoding='utf-8') as f:
    f.write(prep)
print("Renamed Prep Hub.")

