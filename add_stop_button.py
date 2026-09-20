import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add the Stop Button in the active-view
find_active_view = '<div id="active-view" style="display:none; text-align:center;">'
replace_active_view = """<div id="active-view" style="display:none; text-align:center;">
      <button id="stop-ai-btn" style="position:absolute; top:24px; right:24px; background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:100px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; display:none; align-items:center; gap:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        Pause AI
      </button>"""
html = html.replace(find_active_view, replace_active_view)

# 2. Add the JS logic to show/hide and handle the Stop button
find_js_speaking = """    if (state === 'speaking') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'AI Interviewer is Speaking...';
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
    }"""
replace_js_speaking = """    if (state === 'speaking') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'AI Interviewer is Speaking...';
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    }"""
html = html.replace(find_js_speaking, replace_js_speaking)

find_js_listening = """    } else if (state === 'listening') {
      avatarRing.classList.add('listening');
      simStatus.classList.add('listening');
      simStatus.innerText = 'Listening to you...';
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
    }"""
replace_js_listening = """    } else if (state === 'listening') {
      avatarRing.classList.add('listening');
      simStatus.classList.add('listening');
      simStatus.innerText = 'Listening to you...';
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }"""
html = html.replace(find_js_listening, replace_js_listening)

find_js_feedback = """    } else if (state === 'feedback') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'Coaching Feedback';
      avatarEmoji.innerText = '🧠';
      nextBtn.style.display = 'inline-flex';
    }"""
replace_js_feedback = """    } else if (state === 'feedback') {
      avatarRing.classList.add('speaking');
      simStatus.classList.add('speaking');
      simStatus.innerText = 'Coaching Feedback';
      avatarEmoji.innerText = '🧠';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    }"""
html = html.replace(find_js_feedback, replace_js_feedback)

# Append the event listener to the end of the script
append_js = """
  document.getElementById('stop-ai-btn').addEventListener('click', () => {
      if (synth.speaking) {
          synth.cancel();
          document.getElementById('stop-ai-btn').style.display = 'none';
      }
  });
</script>"""
html = html.replace("</script>\n\n\n<script>\n  // Global Affiliate Tracker", append_js + "\n\n<script>\n  // Global Affiliate Tracker")

# 3. Enhance voice selection to avoid Samantha (robotic default on Mac) and prioritize high quality Google voices
find_voice_selection = """    const voices = synth.getVoices();
    const goodVoice = voices.find(v => 
        (v.name.includes('Google') && v.name.includes('Female')) || 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        v.name.includes('Daniel')
    );"""
replace_voice_selection = """    const voices = synth.getVoices();
    const goodVoice = voices.find(v => v.name === 'Google US English') || 
                      voices.find(v => v.name.includes('Google UK English Female')) ||
                      voices.find(v => v.name.includes('Ava')) ||
                      voices.find(v => v.name.includes('Allison')) ||
                      voices.find(v => v.name.includes('Susan')) ||
                      voices.find(v => v.name.includes('Alex')) ||
                      voices.find(v => v.lang === 'en-US');"""
html = html.replace(find_voice_selection, replace_voice_selection)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Added pause button and upgraded voices")
