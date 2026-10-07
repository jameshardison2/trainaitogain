const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Top Left
code = code.replace(
  '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px;"></div>',
  `<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">
    <div style="font-size: clamp(32px, 8vw, 48px); font-weight: 800; color: #111; margin-bottom: 8px;">342</div>
    <div style="font-size: clamp(14px, 4vw, 16px); font-weight: 700; color: #444; line-height: 1.3;">Active Engineering Roles</div>
  </div>`
);

// Top Right
code = code.replace(
  '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative;">',
  `<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">
    <div style="font-size: clamp(32px, 8vw, 48px); font-weight: 800; color: #111; margin-bottom: 8px;">92%</div>
    <div style="font-size: clamp(14px, 4vw, 16px); font-weight: 700; color: #444; line-height: 1.3;">Interview Invite Rate</div>`
);

// Bottom Left
code = code.replace(
  '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative;">',
  `<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">
    <div style="font-size: clamp(32px, 8vw, 48px); font-weight: 800; color: #111; margin-bottom: 8px;">$95/hr</div>
    <div style="font-size: clamp(14px, 4vw, 16px); font-weight: 700; color: #444; line-height: 1.3;">Average Match Rate</div>`
);

// Bottom Right
code = code.replace(
  '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px;"></div>',
  `<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">
    <div style="font-size: clamp(32px, 8vw, 48px); font-weight: 800; color: #111; margin-bottom: 8px;">10k+</div>
    <div style="font-size: clamp(14px, 4vw, 16px); font-weight: 700; color: #444; line-height: 1.3;">Global Placements</div>
  </div>`
);

fs.writeFileSync('index.html', code);
console.log("Patched index.html cards.");
