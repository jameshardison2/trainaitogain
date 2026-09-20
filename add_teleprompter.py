import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add the checkbox to the preferences menu
find_prefs = """          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">
              <input type="checkbox" id="toggle-transcript" checked style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show my live answer transcript on screen</span>
          </label>"""
replace_prefs = """          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:12px;">
              <input type="checkbox" id="toggle-transcript" checked style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show my live answer transcript on screen</span>
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">
              <input type="checkbox" id="toggle-teleprompter" style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show Teleprompter Hints (Ideal Keywords)</span>
          </label>"""
html = html.replace(find_prefs, replace_prefs)

# 2. Add the teleprompter box inside the video container
find_video_box = """          <button id="stop-ai-btn" style="position:absolute; top:16px; right:16px; z-index:100;"""
replace_video_box = """          <div id="teleprompter-box" style="position:absolute; top:16px; left:16px; z-index:100; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:12px 16px; max-width:60%; display:none; backdrop-filter:blur(8px); text-align:left; box-shadow:0 4px 16px rgba(0,0,0,0.5);">
              <div style="font-size:10px; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; font-weight:800; margin-bottom:4px;">Teleprompter Hints</div>
              <div id="teleprompter-text" style="font-size:14px; color:white; font-weight:600; line-height:1.4;"></div>
          </div>
          <button id="stop-ai-btn" style="position:absolute; top:16px; right:16px; z-index:100;"""
html = html.replace(find_video_box, replace_video_box)

# 3. Add the JS toggle logic
find_js_toggle = """  let transcriptEnabled = true;
  document.getElementById('toggle-transcript').addEventListener('change', (e) => {
      transcriptEnabled = e.target.checked;
  });"""
replace_js_toggle = """  let transcriptEnabled = true;
  document.getElementById('toggle-transcript').addEventListener('change', (e) => {
      transcriptEnabled = e.target.checked;
  });
  
  let teleprompterEnabled = false;
  document.getElementById('toggle-teleprompter').addEventListener('change', (e) => {
      teleprompterEnabled = e.target.checked;
  });"""
html = html.replace(find_js_toggle, replace_js_toggle)

# 4. Show/hide teleprompter box in setUIState
find_uistate_speak = """      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {"""
replace_uistate_speak = """      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      document.getElementById('teleprompter-box').style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {"""
html = html.replace(find_uistate_speak, replace_uistate_speak)

find_uistate_listen = """      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      if (!transcriptEnabled) {"""
replace_uistate_listen = """      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      
      if (teleprompterEnabled && currentQuestions[currentQ]) {
          document.getElementById('teleprompter-text').innerText = "Try mentioning: " + currentQuestions[currentQ].keywords.join(', ');
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {
          document.getElementById('teleprompter-box').style.display = 'none';
      }
      
      if (!transcriptEnabled) {"""
html = html.replace(find_uistate_listen, replace_uistate_listen)

# Cache bust
html = html.replace('<!-- CACHE BUST 6', '<!-- CACHE BUST 7')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added teleprompter cheat sheet feature")
