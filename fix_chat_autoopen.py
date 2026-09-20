import re

with open('chat.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_timeout = """  setTimeout(() => {
    if (!hasOpened) {
      openChat();
      chatMessages.innerHTML += `
        <div style="align-self: flex-start; background: #fffbe8; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #fde047; font-size: 14px; max-width: 85%; line-height: 1.5; color: #854d0e; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-top: 8px;">
          <strong>🔔 Quick Reminder:</strong> The active hiring waves are filling up fast! Let me know if you need help starting your application.
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 10000);"""

new_timeout = """  // Only auto-open if we are NOT on the homepage (to prevent blocking the hero grid)
  if (currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '') {
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
  }"""

if old_timeout in js:
    js = js.replace(old_timeout, new_timeout)
    with open('chat.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed auto-open.")
else:
    print("Could not find timeout code.")
