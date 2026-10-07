const fs = require('fs');
let code = fs.readFileSync('apply.html', 'utf8');

const oldMatchedSection = `<div id="matched-waves-track" style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px;">`;
const newMatchedSection = `<div id="matched-waves-track" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; padding: 12px 16px 24px; margin: 0 -16px 24px; -webkit-overflow-scrolling: touch; text-align: left;">
        <style>
          #matched-waves-track::-webkit-scrollbar { height: 8px; }
          #matched-waves-track::-webkit-scrollbar-track { background: var(--gray-100); border-radius: 4px; margin: 0 16px; }
          #matched-waves-track::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 4px; }
          #matched-waves-track::-webkit-scrollbar-thumb:hover { background: var(--primary); }
        </style>`;

code = code.replace(oldMatchedSection, newMatchedSection);

// Make the heading exactly "Top 3 Recommended Roles for Your Profile"
code = code.replace(
  '<h2 style="font-size:24px; font-weight:800; margin-bottom:24px;">Your Top Qualified Roles</h2>',
  '<h2 style="font-size:24px; font-weight:800; margin-bottom:24px;">Top 3 Recommended Roles for Your Profile</h2>'
);

fs.writeFileSync('apply.html', code);
console.log("Patched matched roles section in apply.html");
