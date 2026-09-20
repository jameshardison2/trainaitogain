
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
<div id="ai-chat-widget" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit;">
  <div id="chat-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: min(380px, calc(100vw - 40px)); height: 560px; max-height: calc(100vh - 100px); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); border: 1px solid rgba(255, 255, 255, 0.6); flex-direction: column; overflow: hidden; transform-origin: bottom right; transition: all 0.3s ease;">
    <div style="background: linear-gradient(135deg, #111 0%, #333 100%); color: white; padding: 20px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="logo.svg" style="height: 24px; filter: brightness(0) invert(1);" alt="Logo" />
        <span style="font-size: 16px; letter-spacing: -0.01em;">Hiring Assistant</span>
      </div>
      <button id="chat-close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">✖</button>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: transparent;">
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${pageGreeting}
      </div>

      <div id="suggested-chips" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: -8px; padding-left: 18px;">
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='How long does the interview take?'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">How long is the interview?</button>
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='What are the current pay rates?'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">What is the pay like?</button>
        <button class="chat-chip" onclick="document.getElementById('chat-input').value='I am ready to apply.'; document.getElementById('chat-send-btn').click();" style="background: white; border: 1px solid #10b981; color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">How do I apply?</button>
      </div>
    </div>
    <div style="padding: 16px 20px; background: rgba(255,255,255,0.7); border-top: 1px solid rgba(0,0,0,0.05); display: flex; gap: 12px; align-items: center;">
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



  async function handleSend() {
    
    // Hide suggested chips when user sends a message
    const chipsDiv = document.getElementById('suggested-chips');
    if (chipsDiv) chipsDiv.style.display = 'none';

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
    
    // --- GEMINI API INTEGRATION ---
        let botResponse = "";
    
    // Guardrail Check
    if (text.toLowerCase().includes("apply") || text.toLowerCase().includes("ready") || text.toLowerCase().includes("start")) {
      botResponse = `
        <strong style="color: #ef4444;">🚨 CRITICAL STEP BEFORE YOU APPLY:</strong><br><br>
        Before clicking the application link, you <strong>MUST</strong> create a free Mercor account. If you don't do this first, your progress in the AI interview will be lost!<br><br>
        <a href="https://mercor.com" target="_blank" style="color:#10b981; font-weight:700;">1. Click here to create your account</a><br>
        <a href="apply.html" style="color:#10b981; font-weight:700;">2. Then click here to start the interview</a>
      `;
      document.getElementById(loadingId).remove();
      chatMessages.innerHTML += `
        <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          ${botResponse}
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return;
    }

    try {
      const response = await fetch('/api/generateAiResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: (function() {
                let context = "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline, helping candidates get hired at Mercor. ";
                const score = localStorage.getItem('atsScore');
                const role = localStorage.getItem('atsRole');
                const missing = localStorage.getItem('atsMissing');
                if (score) {
                   context += `Context: The candidate just used the ATS Scanner. Their target role is '${role}'. They scored ${score}%. They are missing the following keywords: ${missing}. If they ask for help with their resume, give them highly specific tactical advice on how to naturally incorporate these missing keywords into their work experience bullets. `;
                } else {
                   context += "The candidate has not scanned their resume yet. If they ask about resumes, tell them to use the Live ATS Scanner on the left. ";
                }
                context += "The user asks: " + text + ". Answer in 1 to 3 short sentences. Be helpful, specific, and natural. Do not be overly robotic.";
                return context;
              })()
            }]
          }]
        })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      botResponse = data.candidates[0].content.parts[0].text;
      // Convert markdown bold to html
      botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Add the click-to-apply action at the end
      
      
    } catch(err) {
      console.error(err);
      botResponse = "The Mercor AI interview evaluates your critical thinking and communication. My best advice: Answer directly, don't use filler words, and speak clearly. <br><br><strong style='color:#10b981; cursor:pointer;' onclick=\"document.getElementById('chat-input').value='I am ready to apply'; document.getElementById('chat-send-btn').click();\">Click here to start the application right now.</strong>";
    }
    
    document.getElementById(loadingId).remove();
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

  // Highlight active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    // Check if the link's href matches the current path
    const linkPath = new URL(link.href).pathname;
    const currentWindowPath = window.location.pathname;
    
    // If the path matches (ignoring empty/index differences)
    if (linkPath === currentWindowPath || (currentWindowPath === '/' && linkPath.includes('index.html'))) {
      // Don't mess with the green 'The Hiring Pipeline' button
      if (!link.style.background.includes('var(--primary)')) {
        link.style.color = 'var(--primary)';
        link.style.fontWeight = '700';
      }
    }
  });
