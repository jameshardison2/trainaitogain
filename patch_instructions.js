const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

const oldCopy = `<h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">How to Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>Click "Apply Now" on your target role below to access our direct referral link.</li>
          <li>Complete your profile setup on the partner platform (Mercor or Micro1) to bypass the general waitlist and fast-track your verification.</li>
        </ul>`;

const newCopy = `<h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">How to Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>Click <strong>"Apply Now"</strong> on your target role below to access our direct referral link.</li>
          <li>Complete your profile setup on the partner platform (Mercor or Micro1) to bypass the general waitlist and fast-track your verification.</li>
        </ul>
        
        <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--gray-200);">
            <h4 style="margin-top:0; margin-bottom:12px; color:var(--gray-800); font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">Pro Tip — Using the Job Cards:</h4>
            <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:13px; color:var(--gray-600);">
                <div style="display:flex; align-items:center; gap:6px; background:white; padding:4px 8px; border-radius:4px; border:1px solid var(--gray-200);">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                    <span><strong>Save</strong> to Dashboard</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; background:white; padding:4px 8px; border-radius:4px; border:1px solid var(--gray-200);">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    <span><strong>Mark</strong> as Applied</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; background:white; padding:4px 8px; border-radius:4px; border:1px solid var(--gray-200);">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    <span><strong>Scan</strong> Resume Match</span>
                </div>
            </div>
        </div>`;

code = code.replace(oldCopy, newCopy);
fs.writeFileSync('render_waves.ts', code);
console.log("Patched render_waves.ts");
