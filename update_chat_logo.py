import re

with open('chat.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Current title
old_title = """      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800;">T</div>
        <span style="font-size: 16px; letter-spacing: -0.02em;">TrainAI<span style="font-weight: 500;">Copilot</span></span>
      </div>"""

new_title = """      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="logo.svg" style="height: 24px; filter: brightness(0) invert(1);" alt="Logo" />
        <span style="font-size: 16px; letter-spacing: -0.01em;">Hiring Assistant</span>
      </div>"""

if old_title in js:
    js = js.replace(old_title, new_title)
    with open('chat.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated chat title and logo.")
else:
    print("Could not find old title.")
