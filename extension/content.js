let isEnabled = true;

// 1. Master Toggle Logic
if (chrome && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(['tgExtensionEnabled'], function(result) {
    if (result && result.tgExtensionEnabled !== undefined) {
      isEnabled = result.tgExtensionEnabled;
    }
    if (isEnabled) {
      initializeExtension();
    }
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.tgExtensionEnabled) {
      isEnabled = changes.tgExtensionEnabled.newValue;
      if (isEnabled) {
        if (!document.getElementById('trainai-panel-trigger')) initializeExtension();
      } else {
        removeExtension();
      }
    }
  });
}

function removeExtension() {
  const trigger = document.getElementById('trainai-panel-trigger');
  if (trigger) trigger.remove();
  const panel = document.getElementById('trainai-side-panel');
  if (panel) panel.remove();
  const ats = document.getElementById('trainai-ats-scanner');
  if (ats) ats.remove();
}

function initializeExtension() {
  if (document.getElementById('trainai-panel-trigger')) return;

  const container = document.createElement('div');
  
  const trigger = document.createElement('button');
  trigger.id = 'trainai-panel-trigger';
  trigger.innerHTML = `Get You Hired`;

  if (!chrome || !chrome.storage || !chrome.storage.local) return;

  const panel = document.createElement('div');
  panel.id = 'trainai-side-panel';
  
  panel.innerHTML = `
    <div class="trainai-panel-header">
      <div class="trainai-panel-header-left">
        <h2>Get You Hired</h2>
      </div>
      <div class="trainai-panel-header-right">
        <button id="trainai-panel-close">×</button>
      </div>
    </div>
    
    <div class="trainai-dashboard-container" style="padding-top: 16px;">
      
      <!-- ATS SCANNER ONLY -->
      <div class="tg-section" data-tg-tooltip="Capture the current job description and export it to our powerful Web ATS Scanner.">
          <h3 class="tg-section-title">ATS KEYWORD SCANNER</h3>
          <p style="font-size:12px; color:var(--tg-text-sec); margin-bottom:16px;">
              Automatically capture this job listing and export it to the TrainAIToGain ATS tool to compare it against your resume.
          </p>
          <button id="tg-scan-btn-panel" class="tg-btn-primary" style="width:100%; padding:12px; font-weight:600;">Export to Web ATS ➔</button>
      </div>

    </div>
  `;
  
  container.appendChild(trigger);
  container.appendChild(panel);
  document.body.appendChild(container);

  // Logic: Open/Close Panel
  trigger.onclick = () => panel.classList.add('open');
  const closeBtn = document.getElementById('trainai-panel-close');
  if (closeBtn) {
      closeBtn.onclick = () => panel.classList.remove('open');
  }

  // Bind ATS Scanner Button (Export to Web Tool)
  const scanBtn = document.getElementById('tg-scan-btn-panel');
  if (scanBtn) {
      scanBtn.onclick = () => {
          const pageText = document.body.innerText;
          scanBtn.innerText = "Capturing...";
          chrome.storage.local.set({ tg_captured_job: pageText }, () => {
              setTimeout(() => {
                  scanBtn.innerText = "Exported! Opening Web ATS...";
                  setTimeout(() => {
                      window.open('https://trainaitogain.com/resume-ats-guide.html', '_blank');
                      scanBtn.innerText = "Export to Web ATS ➔";
                  }, 800);
              }, 500);
          });
      };
  }
}

// ----------------------------------------------------
// Auto-Populate Web ATS (If on trainaitogain.com)
// ----------------------------------------------------
if (window.location.href.includes('resume-ats-guide.html')) {
    chrome.storage.local.get(['tg_captured_job'], (result) => {
        if (result.tg_captured_job) {
            const jobBox = document.getElementById('job-desc');
            const badge = document.getElementById('import-badge');
            if (jobBox && badge) {
                jobBox.value = result.tg_captured_job;
                badge.style.display = 'inline-block';
                // Clear so it doesn't auto-fill next time they visit manually
                chrome.storage.local.remove('tg_captured_job');
            }
        }
    });
}

// ----------------------------------------------------
// UI Helpers
// ----------------------------------------------------
function showToast(message) {
    let toast = document.getElementById('tg-toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tg-toast-msg';
        if (document.body) document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.className = 'tg-toast show';
    setTimeout(() => { toast.className = 'tg-toast'; }, 3000);
// Clean ATS UI only.
}

// ----------------------------------------------------
// SPA Mutation Observer
// ----------------------------------------------------
function setupSPAObserver() {
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (isEnabled) {
                const path = window.location.href.toLowerCase();
                if (path.includes('job') || path.includes('role') || path.includes('explore') || document.querySelector('h1')) {
                    injectATSScanner();
                }
            }
        }, 500);
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// Removed fake modal scanner; we now export to the real web tool.


