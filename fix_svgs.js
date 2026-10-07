const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

// Replace all SVG tags that lack a viewBox with one that has it
code = code.replace(/<svg\s+(width="\d+"\s+height="\d+")/g, '<svg viewBox="0 0 24 24" $1');

fs.writeFileSync('render_waves.ts', code);
console.log("Added viewBox to all SVGs.");
