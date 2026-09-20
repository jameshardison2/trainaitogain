import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Unmute the voice (restore to 1)
html = html.replace('utterance.volume = 0; // Mute robotic voice, acts as timer', 'utterance.volume = 1; // Unmuted to let them hear the voice')

# 2. Redesign the video container to be super sleek
# Remove AI participant box
find_ai_participant = """          <!-- AI Interviewer overlay -->
          <div id="ai-participant" style="position:absolute; top:16px; right:16px; width:120px; height:90px; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); border-radius:8px; border:1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 16px rgba(0,0,0,0.3);">
              <div class="avatar-ring" id="avatar-ring" style="width:40px; height:40px; margin:0; margin-bottom:4px; box-shadow:none;">
                  <div class="avatar-icon" id="avatar-emoji" style="font-size:20px;">👩‍💻</div>
              </div>
              <div style="font-size:10px; font-weight:700; color:#aaa; text-transform:uppercase; letter-spacing:0.05em; margin-top:8px;">AI Recruiter</div>
          </div>"""
replace_ai_participant = ""
html = html.replace(find_ai_participant, replace_ai_participant)

# Make subtitles cinematic (no massive box, just pure text)
find_captions = """          <!-- Real-time captions / status overlay -->
          <div style="position:absolute; bottom:16px; left:0; width:100%; padding:0 32px; box-sizing:border-box;">
              <div id="sim-status-box" style="background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); border-radius:8px; padding:12px; border:1px solid rgba(255,255,255,0.1); text-align:center; max-width:80%; margin:0 auto;">
                  <div class="sim-status" id="sim-status" style="margin-bottom:8px;">Connecting...</div>
                  <div class="sim-text" id="sim-text" style="font-size:16px; min-height:24px; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Initializing AI...</div>
              </div>
          </div>"""
replace_captions = """          <!-- Sleek Cinematic Subtitles -->
          <div style="position:absolute; bottom:24px; left:0; width:100%; padding:0 48px; box-sizing:border-box; text-align:center;">
              <div class="sim-text" id="sim-text" style="display:inline-block; font-size:22px; font-weight:600; line-height:1.4; color:white; margin:0; text-shadow: 0px 2px 8px rgba(0,0,0,0.8), 0px 4px 16px rgba(0,0,0,0.8); background:rgba(0,0,0,0.4); padding:8px 16px; border-radius:8px; backdrop-filter:blur(4px);">Initializing AI...</div>
          </div>"""
html = html.replace(find_captions, replace_captions)

# 3. Clean up JS logic for UI state so it doesn't try to access deleted elements
find_setuistate = """  function setUIState(state, text) {
    simText.innerText = text;
    avatarRing.className = 'avatar-ring';
    simStatus.className = 'sim-status';
    
    if (state === 'speaking') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'AI Interviewer is Speaking...';
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {
      avatarRing.classList.add('listening');
      simStatus.classList.add('listening');
      simStatus.innerText = 'Listening to you...';
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
    } else if (state === 'analyzing') {
      avatarRing.classList.add('listening');
      simStatus.classList.add('listening');
      simStatus.innerText = 'Analyzing...';
    } else if (state === 'feedback') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'Coaching Feedback';
      avatarEmoji.innerText = '🧠';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    }
  }"""
replace_setuistate = """  function setUIState(state, text) {
    if (text) {
        simText.innerText = text;
        simText.style.display = 'inline-block';
    } else {
        simText.style.display = 'none';
    }
    
    if (state === 'speaking') {
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {
      simText.style.display = 'none'; // Hide subtitles when user is speaking
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      userTranscript.style.display = 'block'; // Show user's words as they speak
    } else if (state === 'analyzing') {
      simText.style.display = 'none';
    } else if (state === 'feedback') {
      simText.style.display = 'none'; // Feedback is in copilot panel now!
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }
  }"""
html = html.replace(find_setuistate, replace_setuistate)

# Clean up other avatarEmoji / avatarRing references in processAnswer / askQuestion
html = re.sub(r'avatarRing\.classList\.remove\(\'speaking\'\);\n\s*simStatus\.classList\.remove\(\'speaking\'\);\n\s*simStatus\.innerText = \'Feedback Complete\';\n\s*avatarEmoji\.innerText = \'[^\']+\';', '', html)
html = re.sub(r'avatarEmoji\.innerText = \'[^\']+\';', '', html)

# 4. Make User Transcript sleek chat bubble
html = html.replace('.user-transcript { font-size: 16px; color: #aaa; font-style: italic; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; margin-bottom: 24px; min-height: 60px; text-align: left; display: none; border-left: 3px solid #3b82f6; }', '.user-transcript { font-size: 18px; color: var(--white); font-weight:500; background: rgba(59, 130, 246, 0.15); padding: 16px 24px; border-radius: 24px; margin: 0 auto 24px auto; max-width: 80%; text-align: center; display: none; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 8px 16px rgba(0,0,0,0.2); line-height:1.5; }')

# 5. Remove 'avatarRing' and 'avatarEmoji' declarations since they are deleted from HTML
html = html.replace("const avatarRing = document.getElementById('avatar-ring');", "")
html = html.replace("const avatarEmoji = document.getElementById('avatar-emoji');", "")
html = html.replace("const simStatus = document.getElementById('sim-status');", "")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied hyper-professional competitor UI")
