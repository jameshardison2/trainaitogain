const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

code = code.replace(/title="Direct Partner Network \(Mercor\/Micro1\)"/g, 'title="Save role to dashboard"');
code = code.replace(/title="AI Resume Match Confirmed"/g, 'title="Mark as Applied / Completed"');
code = code.replace(/title="Priority Waitlist Fast-Track"/g, 'title="Scan my resume to see if it matches this job"');

fs.writeFileSync('render_waves.ts', code);
console.log("Tooltips updated.");
