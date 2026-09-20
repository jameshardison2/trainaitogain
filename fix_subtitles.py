import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hide user-transcript completely (it's redundant now)
html = html.replace('<div class="user-transcript" id="user-transcript" style="font-size:14px;"></div>', '')

# 2. Update setUIState listening logic
find_listen = """    } else if (state === 'listening') {
      // Keep the question on the screen! Don't hide simText.
      // We just fade it slightly so they know it's their turn to talk.
      simText.style.opacity = '0.7';
      simText.style.transform = 'scale(0.9)';
      simText.style.transition = 'all 0.3s';
      
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      if (transcriptEnabled) {
          userTranscript.style.display = 'block';
      } else {
          userTranscript.style.display = 'none';
      }
    } else if (state === 'analyzing') {"""
replace_listen = """    } else if (state === 'listening') {
      simText.style.opacity = '1';
      simText.style.transform = 'scale(1)';
      simText.innerText = 'Listening...';
      
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      document.getElementById('stop-ai-btn').style.display = 'none';
      if(document.getElementById('finish-btn')) document.getElementById('finish-btn').style.display = 'inline-flex';
      if (!transcriptEnabled) {
          simText.style.display = 'none';
      }
    } else if (state === 'analyzing') {"""
html = html.replace(find_listen, replace_listen)

# 3. Update recognition.onresult
find_onresult = """        userTranscript.innerText = finalTranscript + interim;
        
        // Real-time copilot keyword highlighting"""
replace_onresult = """        if (transcriptEnabled) {
            simText.innerText = finalTranscript + interim;
            simText.style.display = 'inline-block';
        }
        
        // Real-time copilot keyword highlighting"""
html = html.replace(find_onresult, replace_onresult)

# Remove other userTranscript references to avoid ReferenceErrors
html = html.replace('const userTranscript = document.getElementById(\'user-transcript\');', '')
html = html.replace('userTranscript.style.display = \'none\';', '')
html = html.replace('userTranscript.style.display = \'block\';', '')
html = html.replace('userTranscript.innerText || "I don\'t know"', 'simText.innerText !== "Listening..." ? finalTranscript : "I don\'t know"')

# Cache bust
html = html.replace('<!-- CACHE BUST 3', '<!-- CACHE BUST 4')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated subtitles to track user voice directly")
