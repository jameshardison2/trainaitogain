const fs = require('fs');

// --- 1. Fix apply.html (Resume Matcher Title) ---
let applyHtml = fs.readFileSync('apply.html', 'utf8');
applyHtml = applyHtml.replace('✨ Optional: Match my resume with AI', '✨ Check if your resume matches these roles');
fs.writeFileSync('apply.html', applyHtml);

// --- 2. Fix render_waves.ts ---
let tsCode = fs.readFileSync('render_waves.ts', 'utf8');

// A. Restore the Carousel (Revert Grid)
const oldGridRegex = /<div id="\$\{cat\.id\}" style="display:grid; grid-template-columns: repeat\(auto-fill, minmax\(300px, 1fr\)\); gap:24px; padding: 12px 0 24px;">/g;
const newCarousel = `<div id="\${cat.id}" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;">
            <style>
              /* Beautiful visible scrollbar so users know there are more jobs */
              #\${cat.id}::-webkit-scrollbar { height: 8px; }
              #\${cat.id}::-webkit-scrollbar-track { background: var(--gray-100); border-radius: 4px; margin: 0 16px; }
              #\${cat.id}::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 4px; }
              #\${cat.id}::-webkit-scrollbar-thumb:hover { background: var(--primary); }
            </style>`;
tsCode = tsCode.replace(oldGridRegex, newCarousel);

// B. Restore the Card sizing for Carousel
const oldCardStyle = /style="width:100%; box-sizing:border-box; order:\$\{index\};/g;
const newCardStyle = `style="flex:0 0 320px; order:\${index}; scroll-snap-align:start;`;
tsCode = tsCode.replace(oldCardStyle, newCardStyle);

// C. Replace the Action Buttons with Modern SVGs
// 1. Partner Network Button (was 🏛️)
const btn1Regex = /title="Direct Partner Network \(Mercor\/Micro1\)" onclick="saveRole[^>]*style="(.*?)"[^>]*>🏛️<\/button>/g;
const btn1SVG = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>`;
tsCode = tsCode.replace(btn1Regex, (match, p1) => {
    // Add display:flex and align-items:center to the style
    let newStyle = p1;
    if (!newStyle.includes('display:flex')) {
        newStyle = newStyle.replace('cursor:pointer;', 'cursor:pointer; display:flex; align-items:center; justify-content:center;');
    }
    return `title="Direct Partner Network (Mercor/Micro1)" onclick="saveRole('\${safeTitle}', '\${safeDomain}', '\${safePay}', this, '\${role.linkTarget || 'https://t.mercor.com/wbPMF'}')" style="${newStyle}">${btn1SVG}</button>`;
});

// 2. AI Match Button (was ✅)
const btn2Regex = /title="AI Resume Match Confirmed" onclick="markAsComplete[^>]*style="(.*?)"[^>]*>✅<\/button>/g;
const btn2SVG = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
tsCode = tsCode.replace(btn2Regex, (match, p1) => {
    let newStyle = p1;
    if (!newStyle.includes('display:flex')) {
        newStyle = newStyle.replace('cursor:pointer;', 'cursor:pointer; display:flex; align-items:center; justify-content:center;');
    }
    return `title="AI Resume Match Confirmed" onclick="markAsComplete('\${safeTitle}', '\${safeDomain}', '\${safePay}', this)" style="${newStyle}">${btn2SVG}</button>`;
});

// 3. Priority Waitlist Button (was 🎯)
const btn3Regex = /title="Priority Waitlist Fast-Track" onclick="window\.open[^>]*style="(.*?)"[^>]*>🎯<\/button>/g;
const btn3SVG = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
tsCode = tsCode.replace(btn3Regex, (match, p1) => {
    let newStyle = p1;
    if (!newStyle.includes('display:flex')) {
        newStyle = newStyle.replace('cursor:pointer;', 'cursor:pointer; display:flex; align-items:center; justify-content:center;');
    }
    return `title="Priority Waitlist Fast-Track" onclick="window.open('resume-ats-guide?role=' + encodeURIComponent('\${safeTitle}'), '_blank');" style="${newStyle}">${btn3SVG}</button>`;
});

fs.writeFileSync('render_waves.ts', tsCode);
console.log("Successfully reverted to carousel with visible scrollbars, updated SVG buttons, and updated apply.html title.");
