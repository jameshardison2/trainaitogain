import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """          const aiData = await aiResponse.json();
          let aiText = aiData.candidates[0].content.parts[0].text;"""

new_code = """          const aiData = await aiResponse.json();
          if (!aiData.candidates || aiData.candidates.length === 0) {
              console.error("AI Error:", aiData);
              statusDiv.style.animation = 'none';
              statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Scanner Offline: Our AI provider is currently experiencing high load. Please browse and apply to the roles manually below.</span>';
              return;
          }
          let aiText = aiData.candidates[0].content.parts[0].text;"""

content = content.replace(old_code, new_code)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
