const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

// 1. Remove the description
code = code.replace(/<p style="color:var\(--gray-500\); font-size:14px; margin-bottom:20px; flex-grow:1; line-height:1\.6;">\$\{role\.description\}<\/p>/g, '');

// Give the title flex-grow:1 so the layout pushes buttons to the bottom
code = code.replace(/<h3 style="font-size:18px; margin-bottom:8px; color:var\(--black\); line-height:1\.2;">\$\{role\.title\}<\/h3>/g, '<h3 style="font-size:18px; margin-bottom:20px; color:var(--black); line-height:1.2; flex-grow:1;">${role.title}</h3>');


// 2. Change category-wrapper to a details/summary accordion
const oldHeader = `<div class="category-wrapper">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
          <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">\${cat.icon}</div>
          <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">\${cat.name}</h2>
        </div>
        
        <div style="position:relative;">`;

const newHeader = `<details class="category-wrapper" \${cat.domain === 'SOFTWARE' ? 'open' : ''} style="margin-bottom: 24px; background: var(--white); border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); overflow: hidden;">
          <summary style="display:flex; align-items:center; gap:16px; padding: 24px; cursor: pointer; list-style: none; outline: none; background: #fafafa; border-bottom: 1px solid var(--gray-200);">
            <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">\${cat.icon}</div>
            <h2 style="font-size:22px; font-weight:800; color:var(--black); margin:0; flex:1;">\${cat.name}</h2>
            <div style="color: var(--primary); font-size: 14px; font-weight: 700; background: var(--primary-light); padding: 4px 12px; border-radius: 20px;">\${categoryRoles.length} Roles</div>
            <div style="color: var(--gray-400); font-size: 12px;">▼</div>
          </summary>
          
        <div style="position:relative; padding-top: 24px;">`;

code = code.replace(oldHeader, newHeader);

// Replace the closing divs
code = code.replace(/html \+= \`<\/div><\/div><\/div>\`;/g, 'html += `</div></div></details>`;');


fs.writeFileSync('render_waves.ts', code);
console.log("Patched render_waves.ts");
