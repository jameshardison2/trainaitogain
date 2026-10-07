const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldVideoCont = 'width: 100%; max-width: 100%; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.12); margin-bottom: 48px; border: 1px solid var(--gray-200); background: #000; transform: translateZ(0); position: relative;';
const newVideoCont = 'width: 100%; max-width: 900px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.12); margin-bottom: 48px; border: 1px solid var(--gray-200); background: #000; transform: translateZ(0); position: relative;';

code = code.replace(oldVideoCont, newVideoCont);

fs.writeFileSync('index.html', code);
console.log("Patched video container in index.html");
