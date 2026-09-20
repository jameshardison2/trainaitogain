import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inject the HTML preferences block
find_setup = """      </div>
      <!-- Keep the select hidden so existing references (if any) don't crash -->
      <select id="domain-selector" style="display:none;">"""
replace_setup = """      </div>
      
      <!-- Preferences -->
      <div style="max-width:400px; margin: 0 auto 24px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:20px; text-align:left; box-shadow:inset 0 2px 10px rgba(0,0,0,0.5);">
          <h3 style="font-size:14px; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:16px; margin-top:0;">Simulator Preferences</h3>
          
          <label style="display:flex; align-items:center; gap:12px; margin-bottom:20px; cursor:pointer;">
              <input type="checkbox" id="toggle-transcript" checked style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:#eee; font-weight:500;">Show my live answer transcript on screen</span>
          </label>
          
          <label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">AI Voice Model (Pick the most human one):</label>
          <div style="position:relative;">
              <select id="voice-select" style="width:100%; padding:12px 16px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:#111; color:white; font-size:15px; appearance:none; cursor:pointer; font-weight:500;">
                  <option value="">Loading voices...</option>
              </select>
              <span style="position:absolute; right:16px; top:12px; color:#aaa; pointer-events:none; font-size:12px;">▼</span>
          </div>
          <p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don't like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>
      </div>
      
      <!-- Keep the select hidden so existing references (if any) don't crash -->
      <select id="domain-selector" style="display:none;">"""
html = html.replace(find_setup, replace_setup)

# 2. Add the JS variables and list population logic
find_js_start = """  const simText = document.getElementById('sim-text');
  const userTranscript = document.getElementById('user-transcript');"""
replace_js_start = """  const simText = document.getElementById('sim-text');
  const userTranscript = document.getElementById('user-transcript');
  
  let transcriptEnabled = true;
  document.getElementById('toggle-transcript').addEventListener('change', (e) => {
      transcriptEnabled = e.target.checked;
  });
  
  let availableVoices = [];
  function populateVoiceList() {
      if(typeof synth === 'undefined') return;
      availableVoices = synth.getVoices().filter(v => v.lang.startsWith('en'));
      const voiceSelect = document.getElementById('voice-select');
      if (voiceSelect && availableVoices.length > 0) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              option.textContent = v.name + " (" + (v.localService ? 'Local' : 'Premium') + ")";
              option.value = i;
              
              if (v.name === 'Google US English' || v.name === 'Ava' || v.name === 'Allison' || v.name === 'Samantha') {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }
  }
  populateVoiceList();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }
"""
html = html.replace(find_js_start, replace_js_start)

# 3. Use the toggle logic in setUIState
find_ui_listening = """      document.getElementById('stop-ai-btn').style.display = 'none';
      userTranscript.style.display = 'block';
    } else if (state === 'analyzing') {"""
replace_ui_listening = """      document.getElementById('stop-ai-btn').style.display = 'none';
      if (transcriptEnabled) {
          userTranscript.style.display = 'block';
      } else {
          userTranscript.style.display = 'none';
      }
    } else if (state === 'analyzing') {"""
html = html.replace(find_ui_listening, replace_ui_listening)

# 4. Use the chosen voice in speakText
find_voice_logic = """    // Select a premium, human-like female voice
    const voices = synth.getVoices();
    const goodVoice = voices.find(v => v.name === 'Google US English') || 
                      voices.find(v => v.name.includes('Google UK English Female')) ||
                      voices.find(v => v.name.includes('Ava')) ||
                      voices.find(v => v.name.includes('Allison')) ||
                      voices.find(v => v.name.includes('Susan')) ||
                      voices.find(v => v.name.includes('Alex')) ||
                      voices.find(v => v.lang === 'en-US');
    
    if (goodVoice) utterance.voice = goodVoice;"""
replace_voice_logic = """    // Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && voiceSelect.value !== '') {
        utterance.voice = availableVoices[voiceSelect.value];
    } else if (availableVoices.length > 0) {
        utterance.voice = availableVoices[0];
    }"""
html = html.replace(find_voice_logic, replace_voice_logic)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added preferences menu for transcript toggle and voice selection")
