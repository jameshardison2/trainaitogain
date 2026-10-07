const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

// 1. Remove the old `display: none` scrollbar style
code = code.replace(/<style>\s*#\$\{cat\.id\}::-webkit-scrollbar \{ display: none; \}\s*<\/style>/g, '');

// 2. Re-inject the desktop arrows right above the <div id="${cat.id}">
const target = `<div id="\${cat.id}" style="display:flex; overflow-x:auto;`;
const arrows = `<button class="carousel-btn desktop-only" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('\${cat.id}')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
          <button class="carousel-btn desktop-only" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('\${cat.id}')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>
          `;

code = code.replace(target, arrows + target);

fs.writeFileSync('render_waves.ts', code);
console.log("Arrows added and display:none removed.");
