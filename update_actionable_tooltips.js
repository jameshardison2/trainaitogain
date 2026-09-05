const fs = require('fs');
let content = fs.readFileSync('extension/content.js', 'utf8');

// Replace App Tracker tooltip
content = content.replace(
  'data-tg-tooltip="A radar for the algorithm. Tells you what to do next to get prioritized."',
  'data-tg-tooltip="A radar for the algorithm. It scans your dashboard automatically. Apply to the specific roles it highlights to trigger priority grading."'
);

// Replace Master Profile tooltip
content = content.replace(
  'data-tg-tooltip="Your personal vault. Save your resume here to auto-type it on applications."',
  'data-tg-tooltip="Your personal vault. Step 1: Paste your resume and bio here. Step 2: Click Save. We will use this to auto-type your forms."'
);

// Replace Autofill Button tooltip
content = content.replace(
  'data-tg-tooltip="Instantly beam your saved resume into all the empty boxes on this page."',
  'data-tg-tooltip="Step 1: Open a job application form. Step 2: Click this button to instantly auto-type your saved resume into all the empty boxes."'
);

// Replace ATS Pre-Scanner tooltip
content = content.replace(
  'data-tg-tooltip="Like an X-ray for job descriptions. It shows you exactly what keywords you\'re missing before you apply."',
  'data-tg-tooltip="Click this button while viewing a job description. It will scan the page and tell you exactly which keywords to add to your resume before applying."'
);

// Replace Impact Coach tooltip
content = content.replace(
  'data-tg-tooltip="A live spell-checker, but for impact. It forces you to write answers the AI actually respects by tracking your metrics."',
  'data-tg-tooltip="Start typing your answer. The coach analyzes your text live and warns you if you need to add more metrics (numbers, $, %) or strong action verbs."'
);

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('Actionable tooltips injected successfully!');
