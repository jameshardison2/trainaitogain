const fs = require('fs');
let content = fs.readFileSync('extension/content.js', 'utf8');

const oldMap = `<div class="tg-tools-map">
      <h3>📍 Tools Map</h3>
      <p><strong>Impact Coach & ATS Scanner:</strong> These tools are automatically injected directly onto Job Application pages and Interview forms when you open them!</p>
    </div>`;

const newMap = `<div class="tg-tools-map" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
      <h3 style="color:#10b981; margin:0 0 12px 0; font-size:12px; letter-spacing:1px; text-transform:uppercase;">📍 Hidden Tools Map</h3>
      <p style="margin:0 0 10px 0; font-size:13px; line-height:1.5;"><strong>🎯 Impact Coach:</strong> A live writing assistant that tracks your metrics. <em>(Automatically appears when you type in Interview forms)</em></p>
      <p style="margin:0; font-size:13px; line-height:1.5;"><strong>🔍 ATS Scanner:</strong> Scans job requirements to tell you which keywords you missed. <em>(Automatically appears on Job Application pages)</em></p>
    </div>`;

// Safely replace the old map with the new map
content = content.replace(oldMap, newMap);
// Fallback if the whitespace doesn't match perfectly
if (content === fs.readFileSync('extension/content.js', 'utf8')) {
    // try regex
    content = content.replace(/<div class="tg-tools-map">[\s\S]*?<\/div>/, newMap);
}

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('Tools Map updated successfully!');
