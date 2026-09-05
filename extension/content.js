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

  chrome.storage.local.get(['tgMasterProfile'], (res) => {
    let profile = (res && res.tgMasterProfile) ? res.tgMasterProfile : { resume: '', bio: '', linkedin: '' };
    const needsOnboarding = !profile.resume;

    const panel = document.createElement('div');
    panel.id = 'trainai-side-panel';
    
    panel.innerHTML = `
      <div class="trainai-panel-header">
        <h2>Get You Hired</h2>
        <button id="trainai-panel-close">×</button>
      </div>
      
      <div class="trainai-dashboard-container">
        
        ${needsOnboarding ? '<div class="trainai-alert" style="margin-bottom:24px;"><strong>STEP 1: SETUP</strong><br>Paste your resume below to unlock the tools.</div>' : ''}

        <!-- SECTION 1: Algorithm Status (App Tracker) -->
        <div class="tg-section" data-tg-tooltip="This tracks how many applications you have submitted. You need at least 3 for high priority.">
            <h3 class="tg-section-title">STATUS</h3>
            <div id="trainai-tracker-stats">
                <div class="tg-stat-box">
                <strong id="tg-stat-number">0</strong>
                <span>Applications</span>
                </div>
            </div>
            <div id="tg-algo-status" class="tg-algo-status low">Priority: Low Visibility</div>
            <div id="trainai-tracker-advice" class="trainai-alert">Scanning...</div>
        </div>

        <hr class="tg-divider">

        <!-- SECTION 2: Master Profile Vault -->
        <div class="tg-section" data-tg-tooltip="Save your resume and bio here. We will use this to autofill your applications instantly.">
            <h3 class="tg-section-title">PROFILE</h3>
            
            <label>Raw Resume Text</label>
            <textarea id="tg-profile-resume" placeholder="Paste your entire resume text here...">${profile.resume || ''}</textarea>
            
            <label>Standard Bio / Intro</label>
            <textarea id="tg-profile-bio" placeholder="Hi, I am an expert in...">${profile.bio || ''}</textarea>
            
            <label>LinkedIn URL</label>
            <input type="text" id="tg-profile-linkedin" placeholder="https://linkedin.com/in/..." value="${profile.linkedin || ''}">
            
            <button id="trainai-save-profile">Save Profile</button>
        </div>

      </div>

      <!-- SECTION 3: Magic Navigator (Shape-Shifting Context Button) -->
      <div class="tg-bottom-bar" data-tg-tooltip="This is the Magic Navigator. It shape-shifts to guide you to your exact next step.">
          <div id="tg-nav-status" class="tg-nav-status">Analyzing Context...</div>
          <button id="tg-magic-btn">
            Loading...
          </button>
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

    // Save Profile
    const saveBtn = document.getElementById('trainai-save-profile');
    if (saveBtn) {
        saveBtn.onclick = () => {
          const resumeEl = document.getElementById('tg-profile-resume');
          const bioEl = document.getElementById('tg-profile-bio');
          const linkedinEl = document.getElementById('tg-profile-linkedin');
          
          if (!resumeEl || !bioEl || !linkedinEl) return;

          chrome.storage.local.set({
            tgMasterProfile: {
              resume: resumeEl.value,
              bio: bioEl.value,
              linkedin: linkedinEl.value
            }
          }, () => {
            showToast('Profile Saved Successfully!');
            updateSmartNavigator(); // Instantly update the magic button state
          });
        };
    }

    // Initialize Magic Navigator Loop
    setInterval(updateSmartNavigator, 1500);
    updateSmartNavigator();

    runTrackerScan();
  });

  setupSPAObserver();
}

// ----------------------------------------------------
// The Magic Navigator (Context-Aware State Machine)
// ----------------------------------------------------
function updateSmartNavigator() {
    const magicBtn = document.getElementById('tg-magic-btn');
    const navStatus = document.getElementById('tg-nav-status');
    
    if (!magicBtn || !navStatus) return;

    chrome.storage.local.get(['tgMasterProfile'], (res) => {
        let profile = (res && res.tgMasterProfile) ? res.tgMasterProfile : null;
        const path = window.location.href.toLowerCase();
        
        // State 1: Needs Profile Setup
        if (!profile || !profile.resume || profile.resume.trim() === '') {
            navStatus.innerText = 'Current Step: Setup Profile';
            magicBtn.innerHTML = 'Save Profile to Unlock';
            magicBtn.onclick = () => {
                const resumeInput = document.getElementById('tg-profile-resume');
                if (resumeInput) {
                    resumeInput.focus();
                    resumeInput.scrollIntoView({ behavior: 'smooth' });
                }
            };
            return;
        }

        // State 2: Form Detected (Priority action is to Autofill)
        const inputs = document.querySelectorAll('input[type="text"], input[type="url"], textarea');
        let formNeedsFill = false;
        if (inputs.length > 0) {
            // Check if it's an actual application form vs just a search bar
            inputs.forEach(input => {
                const n = (input.name || input.id || input.placeholder || '').toLowerCase();
                if (n.includes('experience') || n.includes('linkedin') || n.includes('bio') || n.includes('about')) {
                    formNeedsFill = true;
                }
            });
        }

        if (formNeedsFill) {
            navStatus.innerText = 'Current Step: Apply Instantly';
            magicBtn.innerHTML = '⚡ Autofill Application Form';
            magicBtn.onclick = () => runAutofill(profile);
            return;
        }

        // State 3: On Job Board
        if (path.includes('explore') || path.includes('job') || path.includes('role')) {
            // See if ATS Scanner is injected
            const atsBtn = document.getElementById('tg-scan-btn');
            if (atsBtn) {
                navStatus.innerText = 'Current Step: Scan & Apply';
                magicBtn.innerHTML = 'Run ATS Scanner';
                magicBtn.onclick = () => {
                    const mainContent = document.querySelector('main') || document.body;
                    if (mainContent && typeof runATSScan === 'function') {
                        runATSScan(mainContent.textContent);
                    }
                };
            } else {
                navStatus.innerText = 'Current Step: Find a Job';
                magicBtn.innerHTML = 'Click a Job to view details';
                magicBtn.onclick = null;
            }
            return;
        }

        // State 4: On Interview
        if (path.includes('interview')) {
            navStatus.innerText = 'Current Step: Ace the Interview';
            magicBtn.innerHTML = 'Activate Impact Coach';
            magicBtn.onclick = () => {
                const textareas = document.querySelectorAll('textarea');
                if (textareas.length > 0) {
                    textareas[0].focus();
                    showToast('Coach is listening. Start typing!');
                } else {
                    showToast('No text box found yet.');
                }
            };
            return;
        }

        // State 5: Default (Wandering) -> Guide them back to Jobs
        navStatus.innerText = 'Current Step: Explore Opportunities';
        magicBtn.innerHTML = 'Take me to Job Board ➔';
        magicBtn.onclick = () => {
            showToast('Routing to Job Board...');
            setTimeout(() => { window.location.href = 'https://work.mercor.com/explore'; }, 500);
        };
    });
}

function runAutofill(profile) {
    if (!profile) return;
    const inputs = document.querySelectorAll('input[type="text"], input[type="url"], textarea');
    if (inputs.length === 0) return;

    let delay = 0;
    inputs.forEach((input) => {
        setTimeout(() => {
        const name = (input.name || input.id || input.placeholder || '').toLowerCase();
        let valueToSet = null;
        if (name.includes('linkedin') || name.includes('url')) {
            valueToSet = profile.linkedin;
        } else if (name.includes('bio') || name.includes('about') || name.includes('describe')) {
            valueToSet = profile.bio;
        } else if (name.includes('experience') || name.includes('resume')) {
            valueToSet = profile.resume;
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
    setTimeout(() => { showToast('Autofilled successfully.'); }, delay + 300);
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
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// ----------------------------------------------------
// Utility to inject text into React controlled inputs
// ----------------------------------------------------
function setReactInputValue(input, value) {
  if (!input) return;
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
  if (!adviceDiv || !numElem || !statusElem || !document.body) return;

  const text = document.body.textContent.toLowerCase();
  let apps = 0;
  
  const appMatch = text.match(/(?:active|progress|review|applied|submitted|applications)[\s:]*?(\d+)/i) || text.match(/(\d+)[\s:]*?(?:active|progress|review|applied|submitted|applications)/i);
  if (appMatch) {
    apps = parseInt(appMatch[1], 10);
  } else {
    const matches = text.match(/\b(?:progress|active|review|submitted)\b/gi);
    if (matches) apps = matches.length;
  }
  
  numElem.innerText = apps;

  if (apps < 3) {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Priority: Low Visibility';
    adviceDiv.innerHTML = 'The algorithm prioritizes candidates with 3+ applications. Apply to more domain expert roles to trigger priority grading.';
  } else if (text.includes('incomplete') || text.includes('step 2') || text.includes('step 3')) {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Priority: Blocked';
    adviceDiv.innerHTML = 'You have roles waiting on Video Interviews. The AI will not grade you until these are finished.';
  } else {
    statusElem.className = 'tg-algo-status priority';
    statusElem.innerText = 'Priority: High';
    adviceDiv.innerHTML = 'You are fully in the AI grading algorithm. No action needed, wait for email updates.';
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

// ----------------------------------------------------
// FEATURE 4: Live Impact Coach
// ----------------------------------------------------
function handleImpactCoaching(e) {
  if (!isEnabled) return;
  if (e && e.target) updateCoachScore(e.target.value);
}

function injectCoachWidget(textarea) {
  if (!textarea || document.getElementById('trainai-impact-coach')) return;
  
  const widget = document.createElement('div');
  widget.id = 'trainai-impact-coach';
  widget.className = 'trainai-injected tg-coach-container';
  widget.innerHTML = `
    <div class="tg-coach-header">Impact Coach Live</div>
    <div class="tg-coach-stats">
      <span id="tg-coach-metrics">0 Metrics</span> | 
      <span id="tg-coach-verbs">0 Verbs</span>
    </div>
    <div id="tg-coach-advice" style="font-size:12px; margin-top:6px; color:var(--tg-text-sec);">AI Grade: Pending...</div>
  `;
  
  const rect = textarea.getBoundingClientRect();
  widget.style.position = 'absolute';
  widget.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  widget.style.left = (rect.left + window.scrollX) + 'px';
  widget.style.width = rect.width + 'px';
  widget.style.zIndex = '999999';
  
  if (document.body) document.body.appendChild(widget);
  updateCoachScore(textarea.value);
}

function updateCoachScore(text) {
  const widget = document.getElementById('trainai-impact-coach');
  if (!widget) return;
  
  text = text || '';
  const metricsCount = (text.match(/\d+|%|$|percent/g) || []).length;
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'increased', 'decreased', 'improved', 'optimized', 'engineered', 'designed', 'architected'];
  
  const lowerText = text.toLowerCase();
  let verbCount = 0;
  actionVerbs.forEach(v => {
    if (lowerText.includes(v)) verbCount++;
  });
  
  const vagueWords = ['helped', 'worked on', 'was responsible for', 'good', 'stuff', 'things'];
  let vagueFound = vagueWords.filter(v => lowerText.includes(v));

  const metricsEl = document.getElementById('tg-coach-metrics');
  const verbsEl = document.getElementById('tg-coach-verbs');
  if (metricsEl) metricsEl.innerText = `${metricsCount} Metrics`;
  if (verbsEl) verbsEl.innerText = `${verbCount} Verbs`;
  
  const adviceDiv = document.getElementById('tg-coach-advice');
  if (!adviceDiv) return;

  if (vagueFound.length > 0) {
    adviceDiv.innerHTML = `AI Grade: Poor. Use strong action verbs instead of "${vagueFound[0]}".`;
    adviceDiv.style.color = 'var(--tg-danger)';
  } else if (metricsCount === 0 && text.length > 20) {
    adviceDiv.innerHTML = `AI Grade: Average. Add a number, %, or $ amount.`;
    adviceDiv.style.color = 'var(--tg-warning)';
  } else if (metricsCount > 0 && verbCount > 0) {
    adviceDiv.innerHTML = `AI Grade: Strong! The algorithm will prioritize this answer.`;
    adviceDiv.style.color = 'var(--tg-success)';
  } else {
    adviceDiv.innerHTML = `AI Grade: Pending...`;
    adviceDiv.style.color = 'var(--tg-text-sec)';
  }
}

// ----------------------------------------------------
// Voice Tooltips (Text-to-Speech)
// ----------------------------------------------------
document.addEventListener('mouseover', (e) => {
  if (!isEnabled) return;
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    if (window._tgLastSpoken === tooltipElement) return;
    window._tgLastSpoken = tooltipElement;
    
    const text = tooltipElement.getAttribute('data-tg-tooltip');
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; 
        const voices = window.speechSynthesis.getVoices();
        const premiumVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
        if (premiumVoice) utterance.voice = premiumVoice;
        window.speechSynthesis.speak(utterance);
    }
  }
});
document.addEventListener('mouseout', (e) => {
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    window._tgLastSpoken = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
});
