const fs = require('fs');

let content = fs.readFileSync('extension/content.js', 'utf8');

content = content.replace(
  'if (!res.tgMasterProfile) return;',
  `if (!res.tgMasterProfile) {
        autoBtn.innerText = '⚠️ Save Profile First!';
        setTimeout(() => { autoBtn.innerHTML = '⚡ Autofill This Page'; }, 2000);
        return;
      }`
);

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('Fixed autofill stuck bug');
