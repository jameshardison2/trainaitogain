const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

// 1. Remove the carousel buttons
code = code.replace(/<button class="carousel-btn desktop-only"[\s\S]*?<\/button>/g, '');

// 2. Change the container from flex-carousel to CSS Grid
const oldContainer = /\<div id="\$\{cat\.id\}" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;"\>/g;
const newContainer = `<div id="\${cat.id}" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:24px; padding: 12px 0 24px;">`;
code = code.replace(oldContainer, newContainer);

// 3. Update the card style to fit the grid instead of flex
const oldCardStyle = /style="flex:0 0 320px; order:\$\{index\}; scroll-snap-align:start;/g;
const newCardStyle = `style="width:100%; box-sizing:border-box; order:\${index};`;
code = code.replace(oldCardStyle, newCardStyle);

fs.writeFileSync('render_waves.ts', code);
console.log("Patched render_waves.ts to use Grid Layout");
