// TrainAIToGain - Mercor Extension Content Script V1.0.1

let isEnabled = true;

// 1. Initialize and sync state
chrome.storage.local.get(['cheatCodeEnabled'], (res) => {
  if (res.cheatCodeEnabled !== undefined) {
    isEnabled = res.cheatCodeEnabled;
  }
  if (isEnabled) initHeavyHitters();
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleStateChanged") {
    isEnabled = request.enabled;
    if (isEnabled) {
      initHeavyHitters();
    } else {
      removeAllInjectedUI();
    }
  }
});

function removeAllInjectedUI() {
  document.querySelectorAll('.trainai-injected').forEach(el => el.remove());
}

function initHeavyHitters() {
  if (!isEnabled) return;
  
  injectNetworkTranslator();
  injectAutoCacheVault();
  injectSOSButton();
  
  setInterval(() => {
    if (!isEnabled) return;
    const url = window.location.href.toLowerCase();
    
    if (url.includes('interview') || url.includes('record') || url.includes('assessment')) {
      injectContextAnchor();
    } else {
      const anchor = document.getElementById('trainai-context-anchor');
      if (anchor) anchor.remove();
    }
    
    if (url.includes('home')) {
      injectDemystifier();
    } else {
      const demy = document.getElementById('trainai-demystifier');
      if (demy) demy.remove();
    }

    if (url.includes('profile')) {
      injectATSWarning();
    } else {
      const ats = document.getElementById('trainai-ats-warning');
      if (ats) ats.remove();
    }
  }, 2000);
}

// ----------------------------------------------------
// FEATURE 1: The Auto-Cache Vault (Cures Information Loop)
// ----------------------------------------------------
function injectAutoCacheVault() {
  document.addEventListener('input', (e) => {
    if (!isEnabled) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      const name = e.target.name || e.target.id || e.target.placeholder || 'generic_field';
      if (name && name !== 'generic_field') {
        chrome.storage.local.set({ [`trainai_cache_${name}`]: e.target.value });
      }
    }
  });

  setInterval(() => {
    if (!isEnabled) return;
    const url = window.location.href.toLowerCase();
    if (!url.includes('profile')) return; // Only show on profile pages where forms exist
    
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    if (inputs.length >= 1 && !document.getElementById('trainai-restore-btn')) {
      const restoreBtn = document.createElement('button');
      restoreBtn.id = 'trainai-restore-btn';
      restoreBtn.className = 'trainai-injected';
      restoreBtn.innerText = '⚡ Magic Fill (Restore Data)';
      
      restoreBtn.onclick = (e) => {
        e.preventDefault();
        inputs.forEach(input => {
          const name = input.name || input.id || input.placeholder;
          if (name) {
            chrome.storage.local.get([`trainai_cache_${name}`], (res) => {
              if (res[`trainai_cache_${name}`]) {
                input.value = res[`trainai_cache_${name}`];
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }
            });
          }
        });
        restoreBtn.innerText = '✅ Restored!';
        setTimeout(() => { restoreBtn.innerText = '⚡ Magic Fill (Restore Data)'; }, 2000);
      };
      
      document.body.appendChild(restoreBtn);
    }
  }, 3000);
}

// ----------------------------------------------------
// FEATURE 2: The Context Anchor (Cures AI Date Hallucinations)
// ----------------------------------------------------
function injectContextAnchor() {
  if (document.getElementById('trainai-context-anchor')) return;
  
  const anchor = document.createElement('div');
  anchor.id = 'trainai-context-anchor';
  anchor.className = 'trainai-injected';
  
  anchor.innerHTML = `
    <div class="anchor-header">
      📌 Resume Anchor
      <div>
        <button class="anchor-toggle" id="trainai-anchor-min">_</button>
        <button class="anchor-toggle" id="trainai-anchor-close" style="margin-left: 8px;">×</button>
      </div>
    </div>
    <div class="anchor-body" id="trainai-anchor-body">
      <p class="anchor-desc">Paste your exact resume timeline here. If the AI interviewer gets confused about dates, read directly from here to correct it instantly.</p>
      <textarea id="trainai-anchor-text" placeholder="e.g., 2021-2023: Senior Developer at TechCorp..."></textarea>
    </div>
  `;
  document.body.appendChild(anchor);
  
  chrome.storage.local.get(['trainai_resume_anchor'], (res) => {
    if (res.trainai_resume_anchor) {
      document.getElementById('trainai-anchor-text').value = res.trainai_resume_anchor;
    }
  });
  
  document.getElementById('trainai-anchor-text').addEventListener('input', (e) => {
    chrome.storage.local.set({ trainai_resume_anchor: e.target.value });
  });
  
  // Minimize
  document.getElementById('trainai-anchor-min').onclick = () => {
    const body = document.getElementById('trainai-anchor-body');
    body.style.display = (body.style.display === 'none') ? 'block' : 'none';
  };

  // Close completely
  document.getElementById('trainai-anchor-close').onclick = () => {
    anchor.style.display = 'none';
  };
}

// ----------------------------------------------------
// FEATURE 3: The Network Translator (Cures "Something went wrong")
// ----------------------------------------------------
function injectNetworkTranslator() {
  if (window.trainaiNetworkInjected) return;
  window.trainaiNetworkInjected = true;
  
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      if (!response.ok && isEnabled) {
        showErrorToast(response.status);
      }
      return response;
    } catch (err) {
      if (isEnabled) showErrorToast("Network");
      throw err;
    }
  };
}

function showErrorToast(status) {
  const existing = document.getElementById('trainai-error-toast');
  if (existing) existing.remove();
  
  let msg = "A generic error occurred.";
  if (status === 500) msg = "Mercor Server Error 500: Their system crashed. Do not keep clicking apply. Wait 5 minutes and refresh.";
  if (status === 400) msg = "Mercor Error 400: Bad Request. The platform rejected your submission (likely a parsing loop). Try modifying your resume format.";
  if (status === "Network") msg = "Network Disconnected. Your last action did not save.";
  
  const toast = document.createElement('div');
  toast.id = 'trainai-error-toast';
  toast.className = 'trainai-injected';
  toast.innerHTML = `
    <strong>⚠️ Translator Alert</strong>
    <p>${msg}</p>
    <button onclick="this.parentElement.remove()">Dismiss</button>
  `;
  document.body.appendChild(toast);
}

// ----------------------------------------------------
// FEATURE 4: The "Next Step" Demystifier
// ----------------------------------------------------
function injectDemystifier() {
  if (document.getElementById('trainai-demystifier')) return;
  
  // Wait for React to load dashboard content
  const bodyText = document.body.innerText.toLowerCase();
  
  let advice = "💡 Your apps are in the algorithm. Apply to 3+ more Domain Expert roles to force priority.";
  if (bodyText.includes('incomplete') || bodyText.includes('step 2') || bodyText.includes('step 3')) {
    advice = "🚨 You have incomplete applications. Finish those first (especially Step 3 Video Interviews) before applying to new roles.";
  }

  const demystifier = document.createElement('div');
  demystifier.id = 'trainai-demystifier';
  demystifier.className = 'trainai-injected';
  demystifier.innerHTML = `
    <strong>💡 TrainAIToGain Tip:</strong> ${advice}
    <span class="trainai-close" onclick="this.parentElement.remove()">×</span>
  `;
  document.body.appendChild(demystifier);
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (demystifier.parentElement) {
      demystifier.style.opacity = '0';
      setTimeout(() => demystifier.remove(), 300);
    }
  }, 10000);
}

// ----------------------------------------------------
// FEATURE 5: The Human Support Escalator (SOS Button)
// ----------------------------------------------------
function injectSOSButton() {
  if (document.getElementById('trainai-sos-btn')) return;
  
  const sos = document.createElement('button');
  sos.id = 'trainai-sos-btn';
  sos.className = 'trainai-injected';
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

// ----------------------------------------------------
// FEATURE 6: The ATS Warning
// ----------------------------------------------------
function injectATSWarning() {
  if (document.getElementById('trainai-ats-warning')) return;
  
  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs.length === 0) return;
  
  const warning = document.createElement('div');
  warning.id = 'trainai-ats-warning';
  warning.className = 'trainai-injected';
  warning.innerHTML = `
    <strong>⚠️ WARNING:</strong> Mercor's ATS parser is extremely rigid. If your PDF has columns, graphics, or tables, it will fail and trap you in an infinite "parsing loop." Ensure your resume is a simple, 1-column text document before uploading.
  `;
  
  const input = fileInputs[0];
  input.parentNode.insertBefore(warning, input);
}
