const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
  '<div style="color: rgba(255,255,255,0.8); font-weight: 600; font-size: 14px; margin-top: 4px; background: rgba(0,0,0,0.5); padding: 4px 12px; border-radius: 100px;">Over 50,000 views</div>',
  '<div style="color: rgba(255,255,255,0.8); font-weight: 600; font-size: 14px; margin-top: 4px; background: rgba(0,0,0,0.5); padding: 4px 12px; border-radius: 100px;">Trusted by 4,200+ active applicants this month</div>'
);

fs.writeFileSync('index.html', code);
console.log("Patched views in index.html");
