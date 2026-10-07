const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

const oldCopy = `      <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:48px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">How to Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>Click "Apply Now" below to instantly access this exact role via our direct referral link.</li>
          <li>Complete your profile setup on Mercor to bypass the general waitlist and fast-track your verification.</li>
        </ul>
      </div>`;

const newCopy = `      <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:48px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">How to Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>Click "Apply Now" on your target role below to access our direct referral link.</li>
          <li>Complete your profile setup on the partner platform (Mercor or Micro1) to bypass the general waitlist and fast-track your verification.</li>
        </ul>
      </div>`;

code = code.replace(oldCopy, newCopy);
fs.writeFileSync('render_waves.ts', code);
console.log("Updated How to Apply copy in TS.");
