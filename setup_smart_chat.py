import re

chat_js = """
// chat.js
document.addEventListener('DOMContentLoaded', () => {

  let pageGreeting = "👋 Hi! I'm here to help you get hired on Mercor. Any questions about completing your application or acing the interview?";
  const currentPath = window.location.pathname.toLowerCase();
  
  if (currentPath.includes('medical')) {
    pageGreeting = "👋 Hi! Are you ready to apply for the Medical Evaluator position? I can walk you through the medical scoring rubric right now.";
  } else if (currentPath.includes('software') || currentPath.includes('coding')) {
    pageGreeting = "👋 Hi! Looking at the Software Engineering roles? I can help you prepare for the technical live-coding AI interview.";
  } else if (currentPath.includes('finance')) {
    pageGreeting = "👋 Hi! Ready to apply for the Finance & Accounting wave? Let's get your application started before the roles close.";
  }

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
        ${pageGreeting}
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
  
  let hasOpened = false;

  function openChat() {
    chatWindow.style.display = 'flex';
    hasOpened = true;
  }

  toggleBtn.addEventListener('click', () => {
    if (chatWindow.style.display === 'none') {
      openChat();
    } else {
      chatWindow.style.display = 'none';
    }
  });
  
  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  setTimeout(() => {
    if (!hasOpened) {
      openChat();
      chatMessages.innerHTML += `
        <div style="align-self: flex-start; background: #fffbe8; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #fde047; font-size: 14px; max-width: 85%; line-height: 1.5; color: #854d0e; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-top: 8px;">
          <strong>🔔 Quick Reminder:</strong> The active hiring waves are filling up fast! Let me know if you need help starting your application.
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 10000);

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. User Message
    chatMessages.innerHTML += `
      <div style="align-self: flex-end; background: #10b981; color: white; padding: 14px 18px; border-radius: 16px; border-bottom-right-radius: 4px; font-size: 14px; max-width: 85%; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${text}
      </div>
    `;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Loading State
    const loadingId = 'loading-' + Date.now();
    chatMessages.innerHTML += `
      <div id="${loadingId}" style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; display: flex; gap: 4px;">
        <span style="animation: pulse 1.5s infinite">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.2s">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.4s">●</span>
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 3. Simulated "Smart" Fallback Logic
    await new Promise(r => setTimeout(r, 1200));
    document.getElementById(loadingId).remove();
    
    let botResponse = "";
    const lowerText = text.toLowerCase();

    // Guardrail Check
    if (lowerText.includes("apply") || lowerText.includes("ready") || lowerText.includes("start")) {
      botResponse = `
        <strong style="color: #ef4444;">🚨 CRITICAL STEP BEFORE YOU APPLY:</strong><br><br>
        Before clicking the application link, you <strong>MUST</strong> create a free Mercor account. If you don't do this first, your progress in the AI interview will be lost!<br><br>
        <a href="https://mercor.com" target="_blank" style="color:#10b981; font-weight:700;">1. Click here to create your account</a><br>
        <a href="apply.html" style="color:#10b981; font-weight:700;">2. Then click here to start the interview</a>
      `;
    } 
    // Dynamic Keyword Matches based on the Guide
    else if (lowerText.includes("interview") || lowerText.includes("ai")) {
      botResponse = "The Mercor AI interview usually takes 20 minutes. It evaluates your critical thinking and communication. My best advice: Answer directly, don't use filler words, and speak clearly. <br><br>Are you ready to create your account and start?";
    } else if (lowerText.includes("pay") || lowerText.includes("salary") || lowerText.includes("money") || lowerText.includes("rate")) {
      botResponse = "Rates are extremely competitive right now! Medical and Legal domains pay up to $150/hr, while Software and Data Engineering are around $90-$120/hr. <br><br>The active waves are still open, you should start your application immediately before they fill up! <a href='apply.html' style='color:#10b981; font-weight:700;'>Click here to apply.</a>";
    } else if (lowerText.includes("resume") || lowerText.includes("cv")) {
      botResponse = "You can actually upload your PDF resume directly on our <a href='apply.html' style='color:#10b981; font-weight:700;'>Application Page</a>. Our system will analyze it and highlight the exact active hiring wave you should apply to!";
    } else if (lowerText.includes("time") || lowerText.includes("long")) {
      botResponse = "The entire process is incredibly fast. The AI interview takes 20 minutes, and if you score well, you can be matched with a role in as little as 48 hours. <br><br><a href='apply.html' style='color:#10b981; font-weight:700;'>Click here to start the process now.</a>";
    } else {
      // Default Persuasive Catch-All
      botResponse = "That is a great question. According to our Guide, the most important thing is to just get your application submitted today while the hiring wave is active! <br><br>Don't overthink it—Mercor's AI evaluates you mostly on your live interview. <strong style="color:#10b981; cursor:pointer;" onclick="document.getElementById('chat-input').value='I am ready to apply'; document.getElementById('chat-send-btn').click();">Click here if you are ready to apply right now.</strong>";
    }

    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${botResponse}
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

# Bust cache to v=4
import glob
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'chat.js?v=3' in content:
        content = content.replace('chat.js?v=3', 'chat.js?v=4')
    elif 'chat.js?v=2' in content:
        content = content.replace('chat.js?v=2', 'chat.js?v=4')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Smart chat injected and cache busted to v=4")
