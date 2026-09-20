import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_populate = """  let availableVoices = [];
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
  // Fallback for Safari
  setTimeout(populateVoiceList, 100);
  setTimeout(populateVoiceList, 500);
  setTimeout(populateVoiceList, 1500);"""

replace_populate = """  let availableVoices = [];
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
  }
  
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // Fallback: poll every 250ms until voices load (max 10 seconds)
  let pollAttempts = 0;
  voiceInterval = setInterval(() => {
      populateVoiceList();
      pollAttempts++;
      if (pollAttempts > 40) clearInterval(voiceInterval); // Give up after 10s
  }, 250);
  populateVoiceList();"""

if find_populate in html:
    html = html.replace(find_populate, replace_populate)
else:
    print("Warning: Could not find populateVoiceList to replace")

# Cache bust
html = html.replace('<!-- CACHE BUST 10', '<!-- CACHE BUST 11')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated populateVoiceList with polling and no language restriction")
