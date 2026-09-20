import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Change to continuous recognition
html = html.replace('recognition.continuous = false;', 'recognition.continuous = true;')

# 2. Add the "Finish Answer" button to the HTML
find_btns = """      <button class="btn-sim" id="next-btn" style="display:none; margin:0 auto;">
        Next Question ➔
      </button>"""
replace_btns = """      <button class="btn-sim" id="finish-btn" style="display:none; margin:0 auto; background:#3b82f6; box-shadow:0 8px 24px rgba(59, 130, 246, 0.3);">
        Done Answering
      </button>
      <button class="btn-sim" id="next-btn" style="display:none; margin:0 auto;">
        Next Question ➔
      </button>"""
html = html.replace(find_btns, replace_btns)

# 3. Add logic in setUIState to show/hide the button
find_uistate = """    if (state === 'speaking') {
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {"""
replace_uistate = """    if (state === 'speaking') {
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {"""
html = html.replace(find_uistate, replace_uistate)

find_uistate_listen = """      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      if (transcriptEnabled) {"""
replace_uistate_listen = """      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      if (transcriptEnabled) {"""
html = html.replace(find_uistate_listen, replace_uistate_listen)

find_uistate_feedback = """    } else if (state === 'feedback') {
      simText.style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }"""
replace_uistate_feedback = """    } else if (state === 'feedback') {
      simText.style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }"""
html = html.replace(find_uistate_feedback, replace_uistate_feedback)

# 4. Add the click handler for finish-btn
find_stop_btn = """  document.getElementById('stop-ai-btn').addEventListener('click', () => {
      if (synth.speaking) {"""
replace_stop_btn = """  if(document.getElementById('finish-btn')) {
      document.getElementById('finish-btn').addEventListener('click', () => {
          if (recognition) recognition.stop();
      });
  }

  document.getElementById('stop-ai-btn').addEventListener('click', () => {
      if (synth.speaking) {"""
html = html.replace(find_stop_btn, replace_stop_btn)

# Cache bust
html = html.replace('<!-- CACHE BUST 2', '<!-- CACHE BUST 3')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Added continuous listening and manual stop button")
