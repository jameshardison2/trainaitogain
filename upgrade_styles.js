const fs = require('fs');
let content = fs.readFileSync('extension/styles.css', 'utf8');

const darkVars = `:root {
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

const lightGrayVars = `:root {
  --tg-bg: #f8fafc;
  --tg-surface: rgba(241, 245, 249, 0.85); /* Light Gray Transparent */
  --tg-surface-light: rgba(255, 255, 255, 0.9);
  --tg-accent: #059669; /* Branded Emerald */
  --tg-accent-hover: #047857;
  --tg-accent-glow: rgba(5, 150, 105, 0.15);
  --tg-text: #0f172a;
  --tg-text-sec: #475569;
  --tg-border: rgba(0, 0, 0, 0.1);
  --tg-danger: #ef4444;
  --tg-warning: #f59e0b;
}`;

content = content.replace(darkVars, lightGrayVars);
fs.writeFileSync('extension/styles.css', content, 'utf8');
