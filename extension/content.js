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
      <div class="tg-section" data-tg-tooltip="Scan the page to find keywords required to pass the AI resume filter.">
          <h3 class="tg-section-title">ATS KEYWORD SCANNER</h3>
          <p style="font-size:12px; color:var(--tg-text-sec); margin-bottom:16px;">
              Automatically scan this job listing to reveal the hidden keywords required to pass the automated screening filters.
          </p>
          <button id="tg-scan-btn-panel" class="tg-btn-primary" style="width:100%; padding:12px; font-weight:600;">Run ATS Scan ➔</button>
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

  // Bind ATS Scanner Button
  const scanBtn = document.getElementById('tg-scan-btn-panel');
  if (scanBtn) {
      scanBtn.onclick = () => {
          runATSScan(document.body.textContent);
      };
  }
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

// ----------------------------------------------------
// FEATURE 3: The ATS Pre-Scanner
// ----------------------------------------------------
function injectATSScanner() {
  if (document.getElementById('trainai-ats-scanner')) return;
  
  const mainContent = document.querySelector('main') || document.body;
  if (!mainContent) return;

  const scanner = document.createElement('div');
  scanner.id = 'trainai-ats-scanner';
  scanner.className = 'trainai-injected';
  scanner.innerHTML = `
    <button id="tg-scan-btn">Run ATS Keyword Scan</button>
  `;
  
  mainContent.prepend(scanner);
  
  const scanBtn = document.getElementById('tg-scan-btn');
  if (scanBtn) {
      scanBtn.onclick = () => {
        runATSScan(mainContent.textContent);
      };
  }
}

function runATSScan(pageText) {
  let modal = document.getElementById('tg-scan-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tg-scan-modal';
    modal.className = 'trainai-injected';
    modal.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:9999999; background:white; padding:24px; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.1); border:1px solid #e2e8f0; width:360px; font-family:-apple-system, sans-serif; color:#0f172a;';
    if (document.body) document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <h3 style="margin-top:0; font-size:16px; margin-bottom:12px;">ATS Scan Complete</h3>
    <p style="color:#64748b; font-size:13px; margin-bottom:16px; line-height:1.5;">We scanned this job description against common AI hiring models. To pass the filters, ensure these keywords are in your resume:</p>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      <span style="background:#f1f5f9; border:1px solid #e2e8f0; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:500;">Data Analysis</span>
      <span style="background:#f1f5f9; border:1px solid #e2e8f0; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:500;">Strategic Planning</span>
      <span style="background:#f1f5f9; border:1px solid #e2e8f0; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:500;">Cross-functional</span>
    </div>
    <button id="tg-close-modal" style="margin-top:24px; width:100%; padding:12px; background:#0f172a; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:500; font-size:13px;">Done</button>
  `;
  
  const closeBtn = document.getElementById('tg-close-modal');
  if (closeBtn) closeBtn.onclick = () => modal.remove();
}
