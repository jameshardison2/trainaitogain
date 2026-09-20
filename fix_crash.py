import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the broken setUIState function entirely
find_func = re.search(r'function setUIState\(state, text\) \{.*?(?=\n  \}\n\n  function speakText)', html, re.DOTALL)
if find_func:
    new_func = """function setUIState(state, text) {
    if (text) {
        simText.innerText = text;
        simText.style.display = 'inline-block';
    }
    
    if (state === 'speaking') {
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      document.getElementById('stop-ai-btn').style.display = 'inline-flex';
    } else if (state === 'listening') {
      // Keep the question on the screen! Don't hide simText.
      // We just fade it slightly so they know it's their turn to talk.
      simText.style.opacity = '0.7';
      simText.style.transform = 'scale(0.9)';
      simText.style.transition = 'all 0.3s';
      
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      userTranscript.style.display = 'block';
    } else if (state === 'analyzing') {
      simText.style.display = 'none';
    } else if (state === 'feedback') {
      simText.style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      document.getElementById('stop-ai-btn').style.display = 'none';
    }
  }"""
    html = html.replace(find_func.group(0), new_func)

# Also fix the askQuestion reset
html = html.replace("setUIState('speaking', qText);", "simText.style.opacity = '1'; simText.style.transform = 'scale(1)'; setUIState('speaking', qText);")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed setUIState crash")
