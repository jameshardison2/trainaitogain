// TrainAIToGain - Mercor Cheat Code Extension Content Script

function init() {
  injectSOSButton();
  
  // We use simple path matching, though Mercor is often a SPA (React).
  // We will run checks periodically to handle URL changes in SPA.
  setInterval(checkPageContext, 2000);
  checkPageContext();
}

function checkPageContext() {
  const url = window.location.href.toLowerCase();
  
  if (url.includes('interview') || url.includes('assessment') || url.includes('record')) {
    injectTeleprompter();
  } else {
    removeTeleprompter();
  }
  
  if (url.includes('dashboard') || url.includes('home')) {
    injectDemystifier();
  }
  
  if (url.includes('profile') || url.includes('upload') || url.includes('resume')) {
    injectATSWarning();
  }
}

// ----------------------------------------------------
// 1. The M.E.A.T. Teleprompter (with Visual Pacing)
// ----------------------------------------------------
function injectTeleprompter() {
  if (document.getElementById('trainai-teleprompter')) return;
  
  const tp = document.createElement('div');
  tp.id = 'trainai-teleprompter';
  tp.innerHTML = `
    <div class="trainai-header">
      🔥 The M.E.A.T. Framework
      <button id="trainai-close-tp">×</button>
    </div>
    <div class="trainai-body">
      <ul>
        <li><strong>M</strong> - Metric-driven Intro ("3 main reasons...")</li>
        <li><strong>E</strong> - Explicit Transitions ("Firstly, Secondly...")</li>
        <li><strong>A</strong> - Algorithmic Logic (Explain the "Why")</li>
        <li><strong>T</strong> - Time-boxed Conclusion ("In conclusion...")</li>
      </ul>
      <div class="trainai-pacing">
        <div class="trainai-pacing-label">Pacing Monitor (2 Min Answer)</div>
        <div class="trainai-progress-bar">
          <div id="trainai-progress-fill"></div>
        </div>
        <button id="trainai-start-timer">Start Timer</button>
      </div>
    </div>
  `;
  document.body.appendChild(tp);
  
  document.getElementById('trainai-close-tp').onclick = () => tp.remove();
  
  // Visual Pacer Logic
  document.getElementById('trainai-start-timer').onclick = function() {
    this.style.display = 'none';
    const fill = document.getElementById('trainai-progress-fill');
    fill.style.width = '0%';
    fill.style.transition = 'width 120s linear, background-color 1s';
    
    // Force reflow
    void fill.offsetWidth;
    
    // Start 2 min animation
    fill.style.width = '100%';
    
    // Color changes based on time
    setTimeout(() => { fill.style.backgroundColor = '#fbbf24'; }, 90000); // 1.5 min = yellow (wrap up)
    setTimeout(() => { fill.style.backgroundColor = '#ef4444'; }, 110000); // 1.8 min = red (stop talking)
  };
}

function removeTeleprompter() {
  const tp = document.getElementById('trainai-teleprompter');
  if (tp) tp.remove();
}

// ----------------------------------------------------
// 2. The "Next Step" Demystifier
// ----------------------------------------------------
function injectDemystifier() {
  if (document.getElementById('trainai-demystifier')) return;
  
  // Look for text that says "Submitted" or "In Review"
  const bodyText = document.body.innerText;
  if (bodyText.includes('Submitted') || bodyText.includes('In Review')) {
    const demystifier = document.createElement('div');
    demystifier.id = 'trainai-demystifier';
    demystifier.innerHTML = `
      <strong>💡 TrainAIToGain Tip:</strong> You are currently in the algorithm. Do NOT just wait here. Manually apply to 3+ Domain Expert roles on the Job Board to force the algorithm to prioritize your profile!
      <span class="trainai-close" onclick="this.parentElement.remove()">×</span>
    `;
    document.body.appendChild(demystifier);
  }
}

// ----------------------------------------------------
// 3. The ATS Warning
// ----------------------------------------------------
function injectATSWarning() {
  if (document.getElementById('trainai-ats-warning')) return;
  
  // Find a file input that accepts PDF
  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs.length === 0) return;
  
  const warning = document.createElement('div');
  warning.id = 'trainai-ats-warning';
  warning.innerHTML = `
    <strong>⚠️ WARNING:</strong> Mercor's ATS parser is extremely rigid. If your PDF has columns, graphics, or tables, it will fail and trap you in an infinite "parsing loop." Ensure your resume is a simple, 1-column text document before uploading.
  `;
  
  // Insert warning right before the first file input
  const input = fileInputs[0];
  input.parentNode.insertBefore(warning, input);
}

// ----------------------------------------------------
// 4. The Human Support Escalator
// ----------------------------------------------------
function injectSOSButton() {
  if (document.getElementById('trainai-sos-btn')) return;
  
  const sos = document.createElement('button');
  sos.id = 'trainai-sos-btn';
  sos.innerText = '🆘 Stuck?';
  document.body.appendChild(sos);
  
  sos.onclick = () => {
    const template = "ESCALATION REQUIRED: My account is experiencing a critical error preventing interview/assessment completion. Please escalate to a human agent immediately to clear the infinite loop so I can proceed.";
    navigator.clipboard.writeText(template).then(() => {
      alert("An aggressive escalation script has been copied to your clipboard! Paste this into an email to Mercor Support.");
      window.location.href = "mailto:support@mercor.com?subject=ESCALATION%20REQUIRED";
    });
  };
}

// Start the extension
window.addEventListener('load', init);
