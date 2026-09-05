const fs = require('fs');

let content = fs.readFileSync('extension/content.js', 'utf8');

// 1. App Tracker Tab
content = content.replace(
  '<button id="tg-tab-tracker" class="tg-tab active">App Tracker</button>',
  '<button id="tg-tab-tracker" class="tg-tab active" data-tooltip="Like a radar for the algorithm. It scans your dashboard and tells you exactly what to do next to get prioritized.">App Tracker</button>'
);

// 2. Master Profile Tab
content = content.replace(
  '<button id="tg-tab-profile" class="tg-tab">Master Profile</button>',
  '<button id="tg-tab-profile" class="tg-tab" data-tooltip="Your personal vault. Save your resume here once so we can auto-type it for you on every application.">Master Profile</button>'
);

// 3. Autofill Button
content = content.replace(
  '<button id="trainai-autofill-btn">',
  '<button id="trainai-autofill-btn" data-tooltip="Click this to instantly beam your saved resume into all the empty boxes on this page.">'
);

// 4. ATS Pre-Scanner Button
content = content.replace(
  '<button id="tg-scan-btn">🔍 Run ATS Keyword Scan</button>',
  '<button id="tg-scan-btn" data-tooltip="Like an X-ray for job descriptions. It shows you exactly what keywords you\'re missing before you apply.">🔍 Run ATS Keyword Scan</button>'
);

// 5. Impact Coach Header
content = content.replace(
  '<div class="tg-coach-header">🎯 Impact Coach Live</div>',
  '<div class="tg-coach-header" data-tooltip="A live spell-checker, but for impact. It forces you to write answers the AI actually respects by tracking your metrics.">🎯 Impact Coach Live</div>'
);

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('content.js updated with tooltips!');
