const fs = require('fs');

let content = fs.readFileSync('extension/content.js', 'utf8');

// The new Tools Map HTML for the Hub
const toolsMapHTML = `
    <div class="tg-tools-map">
      <h3>📍 Tools Map</h3>
      <p><strong>Impact Coach & ATS Scanner:</strong> These tools are automatically injected directly onto Job Application pages and Interview forms when you open them!</p>
    </div>
`;

// Insert the tools map right before the autofill button inside the panel HTML
if (!content.includes('tg-tools-map')) {
  content = content.replace('    <div id="trainai-autofill-btn">', toolsMapHTML + '\n    <div id="trainai-autofill-btn" data-tg-tooltip="Instantly beam your saved resume into all the empty boxes on this page.">');
}

// 1. App Tracker Tab
content = content.replace(
  '<button class="trainai-tab active" data-tab="tracker">App Tracker</button>',
  '<button class="trainai-tab active" data-tab="tracker" data-tg-tooltip="A radar for the algorithm. Tells you what to do next to get prioritized.">App Tracker</button>'
);

// 2. Master Profile Tab
content = content.replace(
  '<button class="trainai-tab" data-tab="profile">Master Profile</button>',
  '<button class="trainai-tab" data-tab="profile" data-tg-tooltip="Your personal vault. Save your resume here to auto-type it on applications.">Master Profile</button>'
);

// 4. ATS Pre-Scanner Button
content = content.replace(
  '<button id="tg-scan-btn">🔍 Run ATS Keyword Scan</button>',
  '<button id="tg-scan-btn" data-tg-tooltip="Like an X-ray for job descriptions. It shows you exactly what keywords you\'re missing before you apply.">🔍 Run ATS Keyword Scan</button>'
);

// 5. Impact Coach Header
content = content.replace(
  '<div class="tg-coach-header">🎯 Impact Coach Live</div>',
  '<div class="tg-coach-header" data-tg-tooltip="A live spell-checker, but for impact. It forces you to write answers the AI actually respects by tracking your metrics.">🎯 Impact Coach Live</div>'
);

// Voice Tooltips Logic (Inject at the end of the file)
const voiceLogic = `
// Voice Tooltips (Text-to-Speech)
document.addEventListener('mouseover', (e) => {
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    // Prevent spamming the same speech
    if (window._tgLastSpoken === tooltipElement) return;
    window._tgLastSpoken = tooltipElement;
    
    const text = tooltipElement.getAttribute('data-tg-tooltip');
    window.speechSynthesis.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1.0;
    
    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
});
document.addEventListener('mouseout', (e) => {
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    window._tgLastSpoken = null;
    window.speechSynthesis.cancel();
  }
});
`;

if (!content.includes('SpeechSynthesisUtterance')) {
  content += '\n' + voiceLogic;
}

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('content.js successfully upgraded with Voice Tooltips and Tools Map!');
