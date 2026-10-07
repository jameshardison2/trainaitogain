import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

old_speak_text = r"""  window._utterances = \[\]; // Global array to prevent garbage collection bugs
  function speakText\(text, callback\) \{
    if \(synth\.speaking\) \{
        synth\.cancel\(\);
    \}
    const stopBtn = document\.getElementById\('stop-ai-btn'\);
    if \(stopBtn\) stopBtn\.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;

    const utterance = new SpeechSynthesisUtterance\(text\);
    window\._utterances\.push\(utterance\); // Prevent Chromium from garbage collecting the utterance before onend fires!

    
    // Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document\.getElementById\('voice-select'\);
    if \(voiceSelect && availableVoices\.length > 0\) \{
        const selectedIndex = parseInt\(voiceSelect\.value, 10\);
        if \(!isNaN\(selectedIndex\) && availableVoices\[selectedIndex\]\) \{
            utterance\.voice = availableVoices\[selectedIndex\];
        \}
    \} else \{
        const voices = synth\.getVoices\(\);
        if \(voices\.length > 0\) \{
            utterance\.voice = voices\.find\(v => v\.name\.includes\('Google US English'\) \|\| v\.name\.includes\('Samantha'\)\) \|\| voices\.find\(v => v\.lang\.includes\('en-'\)\) \|\| voices\[0\];
        \}
    \}
    
    utterance\.rate = 1\.05;
    utterance\.pitch = 1\.1;
    utterance\.volume = 1; // Unmuted to let them hear the voice
    
    utterance\.onend = \(\) => \{
      if \(callback\) callback\(\);
      const idx = window\._utterances\.indexOf\(utterance\);
      if \(idx > -1\) window\._utterances\.splice\(idx, 1\);
    \};
    
    utterance\.onerror = \(e\) => \{
      console\.error\("SpeechSynthesis error:", e\);
      if \(callback\) callback\(\);
    \};
    
    synth\.speak\(utterance\);
  \}"""

new_speak_text = r"""  window._utterances = []; // Global array to prevent garbage collection bugs
  function speakText(text, callback) {
    if (synth.speaking) {
        synth.cancel();
    }
    const stopBtn = document.getElementById('stop-ai-btn');
    if (stopBtn) stopBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;

    // ElevenLabs API Integration
    const elevenLabsApiKey = localStorage.getItem('elevenlabs_key');
    if (elevenLabsApiKey) {
        const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Professional interviewer voice profile ID
        fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': elevenLabsApiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_flash_v2_5" // low latency real-time conversation model
            })
        }).then(response => {
            if (!response.ok) throw new Error("ElevenLabs API Error");
            return response.blob();
        }).then(blob => {
            const audio = new Audio(URL.createObjectURL(blob));
            audio.onended = () => { if (callback) callback(); };
            audio.play();
            // Hook pause AI button to this audio as well
            if (stopBtn) {
                stopBtn.onclick = () => {
                   audio.pause();
                   if (callback) callback();
                };
            }
        }).catch(err => {
            console.error('ElevenLabs streaming failed, falling back to Web Speech:', err);
            fallbackSpeech(text, callback);
        });
        return;
    }
    
    fallbackSpeech(text, callback);
  }
  
  function fallbackSpeech(text, callback) {
    const utterance = new SpeechSynthesisUtterance(text);
    window._utterances.push(utterance); // Prevent Chromium from garbage collecting the utterance before onend fires!

    // Use the voice selected by the user in the Preferences dropdown
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
    }
    
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.volume = 1; // Unmuted to let them hear the voice
    
    utterance.onend = () => {
      if (callback) callback();
      const idx = window._utterances.indexOf(utterance);
      if (idx > -1) window._utterances.splice(idx, 1);
    };
    
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      if (callback) callback();
    };
    
    synth.speak(utterance);
  }"""

content = re.sub(old_speak_text, new_speak_text, content)

# 2. Add an ElevenLabs config input in the preferences box so they can use it
eleven_input = r"""          <p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don't like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>
          
          <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05);">
             <label style="display:block; font-size:12px; color:var(--accent); margin-bottom:8px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">ElevenLabs API (Ultra-Realistic Streaming):</label>
             <input type="password" id="eleven-key" placeholder="Paste ElevenLabs API Key for Flash v2.5 Voice" style="width:100%; padding:10px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.2); color:white; font-size:13px; font-family:monospace;" onchange="if(this.value) localStorage.setItem('elevenlabs_key', this.value); else localStorage.removeItem('elevenlabs_key');">
          </div>"""

# Ensure we don't accidentally duplicate
if 'elevenlabs_key' not in content:
    content = content.replace(r'<p style="font-size:12px; color:#888; margin-top:8px; margin-bottom:0; line-height:1.4;">If you don\'t like the robotic voice, click the dropdown above to choose a premium, humanized OS voice.</p>', eleven_input)

# Add a script tag at the bottom to auto-fill the API key box if already stored
init_key_script = """
  // Auto-fill ElevenLabs key
  document.addEventListener('DOMContentLoaded', () => {
     const savedKey = localStorage.getItem('elevenlabs_key');
     const input = document.getElementById('eleven-key');
     if(savedKey && input) input.value = savedKey;
  });
"""
content = content.replace("</script>\n</body>", init_key_script + "\n</script>\n</body>")

with open('ai-interview.html', 'w') as f:
    f.write(content)

print("Applied ElevenLabs patch")
