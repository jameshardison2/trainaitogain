const fs = require('fs');
let code = fs.readFileSync('ai-interview.html', 'utf8');

const oldBodyStyle = `body { background: var(--black); color: var(--white); }`;
const newBodyStyle = `body { background: #0B0F12; color: var(--white); }`;
code = code.replace(oldBodyStyle, newBodyStyle);

const oldSimContainer = `.sim-container { background: rgba(0,0,0,0.5); border-radius: var(--radius-lg); padding: 48px 32px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 24px 48px rgba(0,0,0,0.4); text-align: center; position: relative; overflow: hidden; min-height: 500px; }`;
const newSimContainer = `.sim-container { background: rgba(0,0,0,0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: var(--radius-lg); padding: 48px 32px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); text-align: center; position: relative; overflow: hidden; min-height: 500px; }`;
code = code.replace(oldSimContainer, newSimContainer);

fs.writeFileSync('ai-interview.html', code);
console.log("Styles patched.");
