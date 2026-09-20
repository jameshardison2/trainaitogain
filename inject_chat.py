import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

chat_ui = """
<!-- ==========================================
     LANGCHAIN RAG CHAT WIDGET
     ========================================== -->
<div id="ai-chat-widget" style="position: fixed; bottom: 32px; right: 32px; z-index: 9999; font-family: inherit;">
  
  <!-- Chat Window -->
  <div id="chat-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 360px; height: 520px; background: white; border-radius: var(--radius-lg); box-shadow: 0 16px 48px rgba(0,0,0,0.18); border: 1px solid var(--gray-200); flex-direction: column; overflow: hidden; transform-origin: bottom right; transition: all 0.3s ease;">
    
    <!-- Header -->
    <div style="background: var(--black); color: white; padding: 18px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">🤖</span>
        <span>Guide Assistant</span>
      </div>
      <button id="chat-close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">✖</button>
    </div>

    <!-- Messages Area -->
    <div id="chat-messages" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #f9fafb;">
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid var(--gray-200); font-size: 14px; max-width: 85%; line-height: 1.5; color: var(--black); box-shadow: var(--shadow-sm);">
        👋 Hi! I've read the entire Hiring Blueprint. What questions do you have about the Mercor interview process?
      </div>
    </div>

    <!-- Input Area -->
    <div style="padding: 16px 20px; background: white; border-top: 1px solid var(--gray-200); display: flex; gap: 12px; align-items: center;">
      <input type="text" id="chat-input" placeholder="Ask a question..." style="flex: 1; padding: 12px 18px; border: 1px solid var(--gray-300); border-radius: 100px; font-size: 14px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--gray-300)'">
      <button id="chat-send-btn" style="background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(52,211,153,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        ➤
      </button>
    </div>
  </div>

  <!-- Chat Toggle Button -->
  <button id="chat-toggle-btn" style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary); color: white; border: none; box-shadow: 0 8px 32px rgba(52,211,153,0.4); font-size: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    💬
  </button>
</div>

<script>
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

    // Add user message to UI
    chatMessages.innerHTML += `
      <div style="align-self: flex-end; background: var(--primary); color: white; padding: 14px 18px; border-radius: 16px; border-bottom-right-radius: 4px; font-size: 14px; max-width: 85%; line-height: 1.5; box-shadow: var(--shadow-sm);">
        ${text}
      </div>
    `;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    chatMessages.innerHTML += `
      <div id="${loadingId}" style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid var(--gray-200); font-size: 14px; color: var(--gray-500); display: flex; gap: 4px;">
        <span style="animation: pulse 1.5s infinite">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.2s">●</span>
        <span style="animation: pulse 1.5s infinite; animation-delay: 0.4s">●</span>
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate network delay to LangChain backend
    await new Promise(r => setTimeout(r, 1500));
    
    // Remove loading indicator
    document.getElementById(loadingId).remove();

    // Add mock AI response
    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid var(--gray-200); font-size: 14px; max-width: 85%; line-height: 1.5; color: var(--black); box-shadow: var(--shadow-sm);">
        Based on the Blueprint, you should prepare by reviewing the scoring rubric on page 3. Make sure to use clear, concise language during the AI interview.
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
</script>
<style>
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
</style>
"""

# Inject before closing body tag
content = content.replace("</body>", chat_ui + "\n</body>")

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Chat widget injected!")
