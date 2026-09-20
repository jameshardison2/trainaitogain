import re

with open('chat.js', 'r', encoding='utf-8') as f:
    chat_js = f.read()

# I will add a container for suggested chips right after the initial pageGreeting.
chips_html = """
      <div id="suggested-chips" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: -8px; padding-left: 18px;">
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='How long does the interview take?'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">How long is the interview?</button>
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='What are the current pay rates?'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">What is the pay like?</button>
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='I am ready to apply.'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">How do I apply?</button>
      </div>
"""

# Find where the initial greeting is injected
target_str = "      </div>\n    </div>\n    <div style=\"padding: 16px 20px;"

if target_str in chat_js:
    # We want to inject the chips right after the greeting div closes, but inside the chat-messages div
    chat_js = chat_js.replace(
        "      </div>\n    </div>\n    <div style=\"padding: 16px 20px;", 
        "      </div>\n" + chips_html + "    </div>\n    <div style=\"padding: 16px 20px;"
    )
    print("Chips injected!")
else:
    print("Target string not found!")

# Also, when a message is sent, we should hide the suggested chips so they don't clutter the chat
hide_chips_js = """
    // Hide suggested chips when user sends a message
    const chipsDiv = document.getElementById('suggested-chips');
    if (chipsDiv) chipsDiv.style.display = 'none';
"""

if "const text = chatInput.value.trim();" in chat_js:
    chat_js = chat_js.replace("const text = chatInput.value.trim();", hide_chips_js + "\n    const text = chatInput.value.trim();")
    print("Hide logic injected!")

with open('chat.js', 'w', encoding='utf-8') as f:
    f.write(chat_js)

# Bust cache
import glob
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'chat.js?v=8' in content:
        content = content.replace('chat.js?v=8', 'chat.js?v=9')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Cache busted to v=9!")
