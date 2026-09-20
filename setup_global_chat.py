import os
import glob
import re

# 1. Define the global chat widget as a JS script
chat_js = """
// chat.js
document.addEventListener('DOMContentLoaded', () => {
  const chatUI = `
<div id="ai-chat-widget" style="position: fixed; bottom: 32px; right: 32px; z-index: 9999; font-family: inherit;">
  <div id="chat-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 360px; height: 520px; background: white; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.18); border: 1px solid #e5e7eb; flex-direction: column; overflow: hidden; transform-origin: bottom right; transition: all 0.3s ease;">
    <div style="background: #111; color: white; padding: 18px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">🤖</span>
        <span>Guide Assistant</span>
      </div>
      <button id="chat-close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">✖</button>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #f9fafb;">
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        👋 Hi! I'm here to help you get hired on Mercor. Any questions about completing your application or acing the interview?
      </div>
    </div>
    <div style="padding: 16px 20px; background: white; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; align-items: center;">
      <input type="text" id="chat-input" placeholder="Ask a question..." style="flex: 1; padding: 12px 18px; border: 1px solid #d1d5db; border-radius: 100px; font-size: 14px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981'" onblur="this.style.borderColor='#d1d5db'">
      <button id="chat-send-btn" style="background: #10b981; color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        ➤
      </button>
    </div>
  </div>
  <button id="chat-toggle-btn" style="width: 64px; height: 64px; border-radius: 50%; background: #10b981; color: white; border: none; box-shadow: 0 8px 32px rgba(16,185,129,0.4); font-size: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    💬
  </button>
</div>
<style>
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
</style>
  `;

  document.body.insertAdjacentHTML('beforeend', chatUI);

  const toggleBtn = document.getElementById('chat-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');
  
  toggleBtn.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });
  
  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatMessages.innerHTML += `
      <div style="align-self: flex-end; background: #10b981; color: white; padding: 14px 18px; border-radius: 16px; border-bottom-right-radius: 4px; font-size: 14px; max-width: 85%; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${text}
      </div>
    `;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatMessages.innerHTML += `
      <div id="${loadingId}" style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; display: flex; gap: 4px;">
        <span style="animation: pulse 1.5s infinite">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.2s">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.4s">●</span>
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Persuasive conversion-focused AI mock response
    await new Promise(r => setTimeout(r, 1500));
    document.getElementById(loadingId).remove();

    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        That is a great question. According to our Guide, the most important thing is to just get your application submitted today while the hiring wave is active! 
        <br><br>
        Don't overthink it—Mercor's AI evaluates you mostly on your live interview. <a href="apply.html" style="color:#10b981; font-weight:700;">Click here to start the application right now</a> before these roles close!
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
});
"""

with open('chat.js', 'w', encoding='utf-8') as f:
    f.write(chat_js)

# 2. Update chatbot.py prompt to be persuasive
with open('langchain_backend/chatbot.py', 'r', encoding='utf-8') as f:
    bot_code = f.read()

new_system_prompt = """    system_prompt = (
        "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline. "
        "Use the following pieces of retrieved context to answer the candidate's question. "
        "Your PRIMARY goal is to encourage the user to complete the application process immediately. "
        "Always end your answer by urging them to click the apply link and start their application before the hiring wave closes. "
        "Keep the answer concise and professional.\\n\\n"
        "{context}"
    )"""

bot_code = re.sub(r'system_prompt = \([^)]+\)', new_system_prompt, bot_code, flags=re.DOTALL)
with open('langchain_backend/chatbot.py', 'w', encoding='utf-8') as f:
    f.write(bot_code)

# 3. Strip the old hardcoded widget from apply.html
with open('apply.html', 'r', encoding='utf-8') as f:
    apply_content = f.read()

# Try to find and remove the old widget (everything from LANGCHAIN RAG CHAT WIDGET to </style>)
start_marker = "<!-- =========================================="
end_marker = "</style>"
if start_marker in apply_content and end_marker in apply_content:
    start_idx = apply_content.find(start_marker)
    end_idx = apply_content.find(end_marker, start_idx) + len(end_marker)
    apply_content = apply_content[:start_idx] + apply_content[end_idx:]
    with open('apply.html', 'w', encoding='utf-8') as f:
        f.write(apply_content)

# 4. Inject script src="chat.js" into every single HTML file
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'src="chat.js"' not in content:
        content = content.replace('</body>', '<script src="chat.js?v=2"></script>\n</body>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added chat widget to {file}")

print("Chat bot updated and deployed globally!")
