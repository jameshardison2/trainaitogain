import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the hardcoded voice selection with the dropdown logic
find_voice_logic = re.search(r'// Select a premium, human-like female voice.*?if \(goodVoice\) utterance\.voice = goodVoice;', html, re.DOTALL)

replace_voice_logic = """// Use the voice selected by the user in the Preferences dropdown
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && voiceSelect.value !== '') {
        // availableVoices is a global array populated by populateVoiceList
        utterance.voice = availableVoices[parseInt(voiceSelect.value, 10)];
    } else {
        const voices = synth.getVoices();
        utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices.find(v => v.lang.includes('en-'));
    }"""

if find_voice_logic:
    html = html.replace(find_voice_logic.group(0), replace_voice_logic)
else:
    print("WARNING: Could not find voice logic block to replace")

# Cache bust
html = html.replace('<!-- CACHE BUST 4', '<!-- CACHE BUST 5')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed voice assignment logic")
