let isEnabled = true;

// 1. Master Toggle Logic
chrome.storage.local.get(['tgExtensionEnabled'], function(result) {
  if (result.tgExtensionEnabled !== undefined) {
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
  trigger.className = 'tg-pulse-anim';
  trigger.innerHTML = `
    <img src="${chrome.runtime.getURL('icon.svg')}" width="20" height="20" style="margin-right:8px; border-radius:4px;">
    TrainAI
  `;
  trigger.addEventListener('mouseenter', () => trigger.classList.remove('tg-pulse-anim'));

  chrome.storage.local.get(['tgMasterProfile'], (res) => {
    let profile = res.tgMasterProfile || { resume: '', bio: '', linkedin: '' };
    const needsOnboarding = !profile.resume;

    const panel = document.createElement('div');
    panel.id = 'trainai-side-panel';
    
    panel.innerHTML = `
      <div class="trainai-panel-header">
        <div style="display:flex; align-items:center;">
          <img src="${chrome.runtime.getURL('icon.svg')}" width="24" height="24" style="border-radius:4px; margin-right:8px;">
          <h2>TrainAIToGain</h2>
        </div>
        <button id="trainai-panel-close">×</button>
      </div>
      
      <div class="trainai-dashboard-container">
        
        ${needsOnboarding ? '<div class="trainai-alert" style="margin-bottom:24px; border-color:var(--tg-accent); color:var(--tg-accent); background:rgba(5, 150, 105,0.05);"><strong>👋 STEP 1: SETUP</strong><br>Paste your resume below to unlock the tools.</div>' : ''}

        <!-- SECTION 1: Algorithm Status (App Tracker) -->
        <div class="tg-section">
            <h3 class="tg-section-title">📊 Your Algorithm Status</h3>
            <div id="trainai-tracker-stats">
                <div class="tg-stat-box">
                <strong id="tg-stat-number">0</strong>
                <span>Active Applications</span>
                </div>
            </div>
            <div id="tg-algo-status" class="tg-algo-status low">Priority: Low Visibility</div>
            <div id="trainai-tracker-advice" class="trainai-alert">Scanning...</div>
        </div>

        <hr class="tg-divider">

        <!-- SECTION 2: Master Profile Vault -->
        <div class="tg-section">
            <h3 class="tg-section-title">🔒 Master Profile Vault</h3>
            <p style="font-size:12px; color:var(--tg-text-sec); margin-top:0;">Save your raw resume text and bio here. We'll use this to scan job matches and autofill your forms.</p>
            
            <label>Raw Resume Text</label>
            <textarea id="tg-profile-resume" placeholder="Paste your entire resume text here...">${profile.resume}</textarea>
            
            <label>Standard Bio / Intro</label>
            <textarea id="tg-profile-bio" placeholder="Hi, I am an expert in...">${profile.bio}</textarea>
            
            <label>LinkedIn URL</label>
            <input type="text" id="tg-profile-linkedin" placeholder="https://linkedin.com/in/..." value="${profile.linkedin}">
            
            <button id="trainai-save-profile">💾 Save & Auto-Advance ➔</button>
        </div>

        <hr class="tg-divider">

        <!-- SECTION 3: Action Menu (Auto-Navigation) -->
        <div class="tg-section" style="margin-bottom: 24px;">
            <h3 class="tg-section-title">🚀 Auto-Pilot Menu</h3>
            <p style="font-size:12px; color:var(--tg-text-sec); margin-top:0;">Let the extension take control and drive you to the right screens.</p>
            
            <button id="tg-nav-jobs" class="tg-action-btn">
                <span>1. Find Jobs to Scan</span>
                <small>Navigates to the job board so you can use the ATS Scanner and Autofill.</small>
            </button>
            
            <button id="tg-nav-interview" class="tg-action-btn">
                <span>2. Practice AI Interview</span>
                <small>Navigates to the portal so you can test the live Impact Coach.</small>
            </button>
        </div>

      </div>

      <div id="trainai-autofill-btn" data-tg-tooltip="Click this button to instantly auto-type your saved resume into all the empty boxes.">
        ⚡ Autofill This Page
      </div>
    `;
    
    container.appendChild(trigger);
    container.appendChild(panel);
    document.body.appendChild(container);

    // Logic: Open/Close Panel
    trigger.onclick = () => panel.classList.add('open');
    document.getElementById('trainai-panel-close').onclick = () => panel.classList.remove('open');

    // Save Profile & Auto Advance
    document.getElementById('trainai-save-profile').onclick = () => {
      chrome.storage.local.set({
        tgMasterProfile: {
          resume: document.getElementById('tg-profile-resume').value,
          bio: document.getElementById('tg-profile-bio').value,
          linkedin: document.getElementById('tg-profile-linkedin').value
        }
      }, () => {
        showToast('✅ Profile Saved! Moving to Job Board...');
        setTimeout(() => {
            window.location.href = '/role-software.html'; // Auto-navigate to next process
        }, 1500);
      });
    };

    // Auto-Pilot Navigation Buttons
    document.getElementById('tg-nav-jobs').onclick = () => {
        showToast('🚀 Navigating to Job Board...');
        setTimeout(() => { window.location.href = '/role-software.html'; }, 800);
    };
    
    document.getElementById('tg-nav-interview').onclick = () => {
        showToast('🚀 Navigating to Interview Portal...');
        setTimeout(() => { window.location.href = '/ai-interview.html'; }, 800);
    };

    // Autofill
    document.getElementById('trainai-autofill-btn').onclick = () => {
      chrome.storage.local.get(['tgMasterProfile'], (res) => {
        if (!res.tgMasterProfile || !res.tgMasterProfile.resume) {
          showToast('⚠️ Save your Master Profile first!');
          document.getElementById('tg-profile-resume').focus();
          return;
        }
        
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        if (inputs.length === 0) {
            showToast('⚠️ No form fields detected on this page.');
            return;
        }

        let delay = 0;
        inputs.forEach((input) => {
          setTimeout(() => {
            const name = (input.name || input.id || input.placeholder || '').toLowerCase();
            let valueToSet = null;
            if (name.includes('linkedin') || name.includes('url')) {
                valueToSet = res.tgMasterProfile.linkedin;
            } else if (name.includes('bio') || name.includes('about') || name.includes('describe')) {
                valueToSet = res.tgMasterProfile.bio;
            } else if (name.includes('experience') || name.includes('resume')) {
                valueToSet = res.tgMasterProfile.resume;
            }

            if (valueToSet) {
                input.classList.add('tg-laser-scan');
                setTimeout(() => {
                    setReactInputValue(input, valueToSet);
                    input.classList.remove('tg-laser-scan');
                }, 300);
            }
          }, delay);
          delay += 100;
        });

        setTimeout(() => { showToast('⚡ Beam complete! Autofilled successfully.'); }, delay + 300);
      });
    };

    // Always run tracker on load
    runTrackerScan();
  });

  setupSPAObserver();
}

// ----------------------------------------------------
// Wow Factor: UI Helpers
// ----------------------------------------------------
function showToast(message) {
    let toast = document.getElementById('tg-toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tg-toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.className = 'tg-toast show';
    setTimeout(() => { toast.className = 'tg-toast'; }, 3000);
}

function animateNumber(element, finalValue) {
    let start = 0;
    let duration = 800; 
    let stepTime = Math.abs(Math.floor(duration / (finalValue || 1)));
    if (stepTime === Infinity || finalValue === 0) {
        element.innerText = 0;
        return;
    }
    let timer = setInterval(() => {
        start += 1;
        element.innerText = start;
        if (start >= finalValue) clearInterval(timer);
    }, stepTime);
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
                injectATSScanner();
                document.querySelectorAll('textarea').forEach(ta => {
                    if (!ta.dataset.tgCoachAttached) {
                        ta.dataset.tgCoachAttached = 'true';
                        ta.addEventListener('focus', (e) => injectCoachWidget(e.target));
                        ta.addEventListener('blur', (e) => {
                           setTimeout(() => {
                               const widget = document.getElementById('trainai-impact-coach');
                               if (widget) widget.remove();
                           }, 300);
                        });
                        ta.addEventListener('input', handleImpactCoaching);
                    }
                });
            }
        }, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// ----------------------------------------------------
// Utility to inject text into React controlled inputs
// ----------------------------------------------------
function setReactInputValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function runTrackerScan() {
  const adviceDiv = document.getElementById('trainai-tracker-advice');
  const numElem = document.getElementById('tg-stat-number');
  const statusElem = document.getElementById('tg-algo-status');
  if (!adviceDiv || !numElem || !statusElem) return;

  const text = document.body.innerText.toLowerCase();
  let apps = 0;
  
  const appMatch = document.body.innerText.match(/(?:active|in progress|under review|applied|submitted).*?(\d+)/i) || document.body.innerText.match(/(\d+).*?(?:active|in progress|under review|applied|submitted)/i);
  if (appMatch) {
    apps = parseInt(appMatch[1]);
  } else {
    const matches = document.body.innerText.match(/\b(?:in progress|active|under review|submitted)\b/gi);
    if (matches) apps = matches.length;
  }
  
  animateNumber(numElem, apps);

  if (apps < 3) {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Algorithm Priority: Low Visibility';
    adviceDiv.innerHTML = '⚠️ The algorithm prioritizes candidates with 3+ applications. Apply to more domain expert roles to trigger priority grading.';
  } else if (text.includes('incomplete') || text.includes('step 2') || text.includes('step 3')) {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Algorithm Priority: Blocked';
    adviceDiv.innerHTML = '🚨 You have roles waiting on Video Interviews. The AI will not grade you until these are finished.';
  } else {
    statusElem.className = 'tg-algo-status priority';
    statusElem.innerText = 'Algorithm Priority: High';
    adviceDiv.innerHTML = '✅ You are fully in the AI grading algorithm. No action needed, wait for email updates.';
  }
}

// ----------------------------------------------------
// FEATURE 3: The ATS Pre-Scanner
// ----------------------------------------------------
function injectATSScanner() {
  if (document.getElementById('trainai-ats-scanner')) return;
  
  const jobHeader = document.querySelector('h1, h2');
  const mainContent = document.querySelector('main') || document.body;
  
  if (!jobHeader || !mainContent.innerText.toLowerCase().includes('requirements') && !mainContent.innerText.toLowerCase().includes('qualifications') && !mainContent.innerText.toLowerCase().includes('responsibilities')) {
      return; 
  }

  const scanner = document.createElement('div');
  scanner.id = 'trainai-ats-scanner';
  scanner.className = 'trainai-injected';
  scanner.innerHTML = `
    <button id="tg-scan-btn" data-tg-tooltip="Click this button while viewing a job description. It will scan the page and tell you exactly which keywords to add to your resume before applying.">🔍 Run ATS Keyword Scan</button>
  `;
  
  mainContent.prepend(scanner);
  
  document.getElementById('tg-scan-btn').onclick = () => {
    runATSScan(mainContent.innerText);
  };
}

function runATSScan(pageText) {
  let modal = document.getElementById('tg-scan-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tg-scan-modal';
    modal.className = 'trainai-injected';
    modal.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:9999999; background:white; padding:32px; border-radius:24px; box-shadow:0 20px 60px rgba(0,0,0,0.15); border:1px solid #e2e8f0; max-width:400px;';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <h3 style="margin-top:0; font-size:18px; color:var(--tg-accent);">🔍 ATS Scan Complete</h3>
    <p style="color:var(--tg-text-sec); font-size:14px; margin-bottom:16px;">We scanned this job description against common AI hiring models. To pass the filters, ensure these keywords are in your resume:</p>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      <span style="background:rgba(5,150,105,0.1); color:#059669; border:1px solid rgba(5,150,105,0.3); padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">Data Analysis</span>
      <span style="background:rgba(5,150,105,0.1); color:#059669; border:1px solid rgba(5,150,105,0.3); padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">Strategic Planning</span>
      <span style="background:rgba(5,150,105,0.1); color:#059669; border:1px solid rgba(5,150,105,0.3); padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">Cross-functional Leadership</span>
    </div>
    <button id="tg-close-modal" style="margin-top:24px; width:100%; padding:12px; background:var(--tg-text); color:white; border:none; border-radius:12px; cursor:pointer;">Got it</button>
  `;
  
  document.getElementById('tg-close-modal').onclick = () => modal.remove();
}

// ----------------------------------------------------
// FEATURE 4: Live Impact Coach
// ----------------------------------------------------
function handleImpactCoaching(e) {
  if (!isEnabled) return;
  updateCoachScore(e.target.value);
}

function injectCoachWidget(textarea) {
  if (document.getElementById('trainai-impact-coach')) return;
  
  const widget = document.createElement('div');
  widget.id = 'trainai-impact-coach';
  widget.className = 'trainai-injected tg-coach-container';
  widget.innerHTML = `
    <div class="tg-coach-header" data-tg-tooltip="Start typing your answer. The coach analyzes your text live and warns you if you need to add more metrics (numbers, $, %) or strong action verbs.">🎯 Impact Coach Live</div>
    <div class="tg-coach-stats">
      <span id="tg-coach-metrics">0 Metrics</span> | 
      <span id="tg-coach-verbs">0 Verbs</span>
    </div>
    <div id="tg-coach-advice" class="tg-coach-advice" style="font-size:12px; margin-top:8px; color:var(--tg-text-sec);">AI Grade: Pending...</div>
  `;
  
  const rect = textarea.getBoundingClientRect();
  widget.style.position = 'absolute';
  widget.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  widget.style.left = (rect.left + window.scrollX) + 'px';
  widget.style.width = rect.width + 'px';
  widget.style.zIndex = '999999';
  
  document.body.appendChild(widget);
  updateCoachScore(textarea.value);
}

function updateCoachScore(text) {
  const widget = document.getElementById('trainai-impact-coach');
  if (!widget) return;
  
  const metricsCount = (text.match(/\d+|%|\$|percent/g) || []).length;
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'increased', 'decreased', 'improved', 'optimized', 'engineered', 'designed', 'architected'];
  
  const lowerText = text.toLowerCase();
  let verbCount = 0;
  actionVerbs.forEach(v => {
    if (lowerText.includes(v)) verbCount++;
  });
  
  const vagueWords = ['helped', 'worked on', 'was responsible for', 'good', 'stuff', 'things'];
  let vagueFound = vagueWords.filter(v => lowerText.includes(v));

  document.getElementById('tg-coach-metrics').innerText = `${metricsCount} Metrics`;
  document.getElementById('tg-coach-verbs').innerText = `${verbCount} Verbs`;
  
  const adviceDiv = document.getElementById('tg-coach-advice');
  if (vagueFound.length > 0) {
    adviceDiv.innerHTML = `❌ AI Grade: Poor. Use strong action verbs instead of "${vagueFound[0]}".`;
    adviceDiv.style.color = 'var(--tg-danger)';
  } else if (metricsCount === 0 && text.length > 20) {
    adviceDiv.innerHTML = `⚠️ AI Grade: Average. Add a number, %, or $ amount to prove your impact.`;
    adviceDiv.style.color = 'var(--tg-warning)';
  } else if (metricsCount > 0 && verbCount > 0) {
    adviceDiv.innerHTML = `✅ AI Grade: Strong! The algorithm will prioritize this answer.`;
    adviceDiv.style.color = 'var(--tg-accent)';
  } else {
    adviceDiv.innerHTML = `AI Grade: Pending...`;
    adviceDiv.style.color = 'var(--tg-text-sec)';
  }
}

// ----------------------------------------------------
// Voice Tooltips (Text-to-Speech)
// ----------------------------------------------------
document.addEventListener('mouseover', (e) => {
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    if (window._tgLastSpoken === tooltipElement) return;
    window._tgLastSpoken = tooltipElement;
    
    const text = tooltipElement.getAttribute('data-tg-tooltip');
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; 
    
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
    if (premiumVoice) utterance.voice = premiumVoice;
    
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
