// TrainAIToGain - Mercor Cheat Code V2 Content Script

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
  
  setInterval(() => {
    if (!isEnabled) return;
    const url = window.location.href.toLowerCase();
    
    if (url.includes('interview') || url.includes('record') || url.includes('assessment')) {
      injectContextAnchor();
    }
  }, 2000);
}

// ----------------------------------------------------
// FEATURE 1: The Auto-Cache Vault (Cures Information Loop)
// ----------------------------------------------------
function injectAutoCacheVault() {
  // Listen to all inputs and save to local storage
  document.addEventListener('input', (e) => {
    if (!isEnabled) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      const name = e.target.name || e.target.id || e.target.placeholder;
      if (name) {
        chrome.storage.local.set({ [`trainai_cache_${name}`]: e.target.value });
      }
    }
  });

  // Inject a glowing "Restore" button if we see empty fields
  setInterval(() => {
    if (!isEnabled) return;
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    if (inputs.length > 2 && !document.getElementById('trainai-restore-btn')) {
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
                // Trigger react synthetic events
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
      <button class="anchor-toggle" id="trainai-anchor-toggle">_</button>
    </div>
    <div class="anchor-body" id="trainai-anchor-body">
      <p class="anchor-desc">Paste your exact resume timeline here. If the AI interviewer gets confused about dates, read directly from here to correct it instantly.</p>
      <textarea id="trainai-anchor-text" placeholder="e.g., 2021-2023: Senior Developer at TechCorp..."></textarea>
    </div>
  `;
  document.body.appendChild(anchor);
  
  // Load saved resume context
  chrome.storage.local.get(['trainai_resume_anchor'], (res) => {
    if (res.trainai_resume_anchor) {
      document.getElementById('trainai-anchor-text').value = res.trainai_resume_anchor;
    }
  });
  
  // Save on type
  document.getElementById('trainai-anchor-text').addEventListener('input', (e) => {
    chrome.storage.local.set({ trainai_resume_anchor: e.target.value });
  });
  
  // Toggle collapse
  document.getElementById('trainai-anchor-toggle').onclick = () => {
    const body = document.getElementById('trainai-anchor-body');
    if (body.style.display === 'none') {
      body.style.display = 'block';
    } else {
      body.style.display = 'none';
    }
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
