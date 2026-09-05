const fs = require('fs');
let css = fs.readFileSync('extension/styles.css', 'utf8');

// Update surface colors to branded transparent green
css = css.replace('--tg-surface: rgba(30, 41, 59, 0.95);', '--tg-surface: rgba(16, 185, 129, 0.25);');
css = css.replace('--tg-surface-light: rgba(51, 65, 85, 0.9);', '--tg-surface-light: rgba(16, 185, 129, 0.4);');

// Rename MEAT references in CSS just in case
css = css.replace(/meat/g, 'impact');
css = css.replace(/MEAT/g, 'Impact');

fs.writeFileSync('extension/styles.css', css, 'utf8');
console.log('styles.css updated!');
