import re

with open('chat.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update Chat Window Styles (Glassmorphism + Mobile Fixes)
old_window = 'width: 360px; height: 520px; background: white; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.18); border: 1px solid #e5e7eb;'
new_window = 'width: min(380px, calc(100vw - 40px)); height: 560px; max-height: calc(100vh - 100px); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); border: 1px solid rgba(255, 255, 255, 0.6);'
js = js.replace(old_window, new_window)

# 2. Update Header
old_header = '<div style="background: #111; color: white; padding: 18px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center;">'
new_header = '<div style="background: linear-gradient(135deg, #111 0%, #333 100%); color: white; padding: 20px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">'
js = js.replace(old_header, new_header)

# 3. Update Title
old_title = """      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">🤖</span>
        <span>Guide Assistant</span>
      </div>"""
new_title = """      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800;">T</div>
        <span style="font-size: 16px; letter-spacing: -0.02em;">TrainAI<span style="font-weight: 500;">Copilot</span></span>
      </div>"""
js = js.replace(old_title, new_title)

# 4. Update chat messages background
old_msg_bg = 'id="chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #f9fafb;"'
new_msg_bg = 'id="chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: transparent;"'
js = js.replace(old_msg_bg, new_msg_bg)

# 5. Update input area
old_input_area = '<div style="padding: 16px 20px; background: white; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; align-items: center;">'
new_input_area = '<div style="padding: 16px 20px; background: rgba(255,255,255,0.7); border-top: 1px solid rgba(0,0,0,0.05); display: flex; gap: 12px; align-items: center;">'
js = js.replace(old_input_area, new_input_area)

# 6. Completely remove auto-open logic
auto_open_regex = r"  // Only auto-open if we are NOT on the homepage.*?}, 10000\);\n  }"
js = re.sub(auto_open_regex, '', js, flags=re.DOTALL)

# Fallback in case old auto_open logic is still there somehow
auto_open_regex2 = r"  setTimeout\(\(\) => \{\n    if \(\!hasOpened\).*?\}, 10000\);"
js = re.sub(auto_open_regex2, '', js, flags=re.DOTALL)

# Also fix the mobile positioning widget container
old_widget = '<div id="ai-chat-widget" style="position: fixed; bottom: 32px; right: 32px; z-index: 9999; font-family: inherit;">'
new_widget = '<div id="ai-chat-widget" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit;">'
js = js.replace(old_widget, new_widget)

with open('chat.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Redesigned chat.js")
