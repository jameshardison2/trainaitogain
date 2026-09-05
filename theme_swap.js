const fs = require('fs');
let content = fs.readFileSync('extension/styles.css', 'utf8');

// Replace the bright SaaS variables with Mercor-native dark slate variables
const oldVars = `:root {
  --tg-bg: #ffffff;
  --tg-surface: rgba(255, 255, 255, 0.95);
  --tg-surface-light: #f8fafc;
  --tg-accent: #059669; /* Professional Emerald */
  --tg-accent-hover: #047857;
  --tg-accent-glow: rgba(5, 150, 105, 0.15);
  --tg-text: #0f172a;
  --tg-text-sec: #475569;
  --tg-border: #e2e8f0;
  --tg-danger: #ef4444;
  --tg-warning: #f59e0b;
}`;

const newVars = `:root {
  /* Mercor-Native Dark Theme */
  --tg-bg: #0f172a;
  --tg-surface: rgba(15, 23, 42, 0.95);
  --tg-surface-light: rgba(30, 41, 59, 1);
  --tg-accent: #3b82f6; /* Mercor-style Blue */
  --tg-accent-hover: #2563eb;
  --tg-accent-glow: rgba(59, 130, 246, 0.2);
  --tg-text: #f8fafc;
  --tg-text-sec: #94a3b8;
  --tg-border: rgba(255, 255, 255, 0.1);
  --tg-danger: #ef4444;
  --tg-warning: #f59e0b;
}`;

// Also fix the header background which was hardcoded to white
content = content.replace('background: white;', 'background: var(--tg-surface);');
content = content.replace('background: white;', 'background: var(--tg-surface);');
content = content.replace('background: white;', 'background: var(--tg-surface);');
content = content.replace('background: white;', 'background: var(--tg-surface);');
// Fix the tabs container background
content = content.replace('background: white;', 'background: var(--tg-surface);');
// Fix hover states that were hardcoded
content = content.replace('background: #f1f5f9;', 'background: rgba(255,255,255,0.05);');

content = content.replace(oldVars, newVars);

fs.writeFileSync('extension/styles.css', content, 'utf8');
console.log('Swapped to Mercor-native dark theme!');
