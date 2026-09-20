import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_populate = """  let availableVoices = [];
  let voiceInterval;
  function populateVoiceList() {
      if(typeof synth === 'undefined') return;
      
      // Get all voices (don't restrict to 'en' in case they only have foreign OS voices installed)
      let voices = synth.getVoices();
      if (voices.length === 0) return; // Still loading...
      
      // Stop the interval once we get voices
      if (voiceInterval) clearInterval(voiceInterval);
      
      availableVoices = voices;
      const voiceSelect = document.getElementById('voice-select');
      
      if (voiceSelect) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              option.textContent = v.name + " (" + (v.lang) + ")";
              option.value = i;
              
              if (v.name === 'Google US English' || v.name === 'Ava' || v.name === 'Allison' || v.name === 'Samantha') {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }
  }"""

replace_populate = """  let availableVoices = [];
  let voiceInterval;
  function populateVoiceList() {
      if(typeof synth === 'undefined') return;
      
      let voices = synth.getVoices();
      const voiceSelect = document.getElementById('voice-select');
      
      if (voices.length === 0) {
          if (voiceSelect && voiceSelect.options.length === 1 && voiceSelect.options[0].textContent.includes('Loading')) {
              voiceSelect.options[0].textContent = "System Default Voice (Auto-selected)";
          }
          return; // Still loading or blocked by browser
      }
      
      if (voiceInterval) clearInterval(voiceInterval);
      
      // Only rebuild if we haven't already
      if (availableVoices.length === voices.length) return;
      
      availableVoices = voices;
      
      if (voiceSelect) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              option.textContent = v.name + " (" + (v.lang) + ")";
              option.value = i;
              
              if (v.name === 'Google US English' || v.name === 'Ava' || v.name === 'Allison' || v.name === 'Samantha') {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }
  }
  
  // Try populating on user interaction as well
  document.addEventListener('click', populateVoiceList, {once: false});
  document.addEventListener('touchstart', populateVoiceList, {once: false});"""

if find_populate in html:
    html = html.replace(find_populate, replace_populate)
else:
    print("Warning: Could not find populateVoiceList to replace")

# 2. Fix speakText to handle the fallback "System Default Voice" if voices are empty
find_speakText = """    // Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && voiceSelect.value !== '') {
        // availableVoices is a global array populated by populateVoiceList
        utterance.voice = availableVoices[parseInt(voiceSelect.value, 10)];
    } else {
        const voices = synth.getVoices();
        utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices.find(v => v.lang.includes('en-'));
    }"""
    
replace_speakText = """    // Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && availableVoices.length > 0) {
        const selectedIndex = parseInt(voiceSelect.value, 10);
        if (!isNaN(selectedIndex) && availableVoices[selectedIndex]) {
            utterance.voice = availableVoices[selectedIndex];
        }
    } else {
        const voices = synth.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices.find(v => v.lang.includes('en-')) || voices[0];
        }
    }"""
if find_speakText in html:
    html = html.replace(find_speakText, replace_speakText)
else:
    print("Warning: Could not find speakText to replace")

# Cache bust
html = html.replace('<!-- CACHE BUST 11', '<!-- CACHE BUST 12')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed voice dropdown UX fallback and interaction triggers")
