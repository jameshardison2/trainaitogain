const fs = require('fs');

let content = fs.readFileSync('extension/content.js', 'utf8');

// Rename M.E.A.T to Impact
content = content.replace(/MEAT/g, 'Impact');
content = content.replace(/meat/g, 'impact');
content = content.replace(/M\.E\.A\.T\./g, 'Impact');
content = content.replace(/🥩/g, '🎯');

// Fix Bug #8 (ATS URL guard)
content = content.replace(
  "if (url.includes('roles') || url.includes('opportunities')) {",
  "if (url.includes('roles') || url.includes('opportunities') || url.includes('jobs/list_') || url.includes('/job')) {"
);

// Fix Bug #9 (App Tracker heuristic)
const oldTracker = `  const appMatch = document.body.innerText.match(/Applications\\s*(\\d+)/i);
  if (appMatch) apps = parseInt(appMatch[1]);`;

const newTracker = `  const appMatch = document.body.innerText.match(/(?:active|in progress|under review|applied).*?(\\d+)/i) || document.body.innerText.match(/(\\d+).*?(?:active|in progress|under review|applied)/i);
  if (appMatch) {
    apps = parseInt(appMatch[1]);
  } else {
    const matches = document.body.innerText.match(/\\b(?:in progress|active|under review)\\b/gi);
    if (matches) apps = matches.length;
  }`;

content = content.replace(oldTracker, newTracker);

// Add Onboarding Tooltip
const oldInitEnd = `  // Initial scan for tracker
  runTrackerScan();
}`;

const newInitEnd = `  // Initial scan for tracker
  runTrackerScan();
  
  // Onboarding Tooltip
  chrome.storage.local.get(['tgOnboardingSeen'], (res) => {
    if (!res.tgOnboardingSeen) {
      const tooltip = document.createElement('div');
      tooltip.className = 'trainai-injected';
      tooltip.style.cssText = 'position:fixed; top:50%; right:140px; transform:translateY(-50%); background:rgba(16,185,129,0.9); color:white; padding:12px 16px; border-radius:8px; font-family:Inter,sans-serif; font-size:14px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.2); z-index:999999; backdrop-filter:blur(10px); display:flex; align-items:center; gap:8px; pointer-events:none;';
      tooltip.innerHTML = '<span>TrainAIToGain: Click here to set up your profile and enable Autofill ➔</span>';
      document.body.appendChild(tooltip);
      
      trigger.addEventListener('click', () => {
        tooltip.remove();
        chrome.storage.local.set({tgOnboardingSeen: true});
      }, {once: true});
    }
  });
}`;

content = content.replace(oldInitEnd, newInitEnd);

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('content.js updated!');
