const fs = require('fs');
let code = fs.readFileSync('chat.js', 'utf8');

const styleBlock = `
<style>
  #ai-chat-widget {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    font-family: inherit;
  }
  @media (max-width: 768px) {
    #ai-chat-widget {
      bottom: 80px;
      right: 16px;
    }
  }
</style>
`;

code = code.replace('<div id="ai-chat-widget" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit;">', styleBlock + '\n<div id="ai-chat-widget">');

fs.writeFileSync('chat.js', code);
console.log("Patched chat.js");
