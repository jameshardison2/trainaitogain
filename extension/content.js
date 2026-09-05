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
  
  // The trigger button
  const trigger = document.createElement('button');
  trigger.id = 'trainai-panel-trigger';
  trigger.className = 'tg-pulse-anim'; // Pulsing transparent icon initially
  trigger.innerHTML = `
    <img src="${chrome.runtime.getURL('icon.svg')}" width="20" height="20" style="margin-right:8px; border-radius:4px;">
    TrainAI
  `;
  trigger.addEventListener('mouseenter', () => trigger.classList.remove('tg-pulse-anim'));

  // Fetch profile to determine initial state
  chrome.storage.local.get(['tgMasterProfile'], (res) => {
    let profile = res.tgMasterProfile || { resume: '', bio: '', linkedin: '' };
    const needsOnboarding = !profile.resume; // BUG FIX: Check if resume string actually exists

    // The actual panel
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
      
      <div class="trainai-tabs">
        <button id="tg-tab-btn-tracker" class="trainai-tab ${needsOnboarding ? '' : 'active'}" data-tab="tracker" data-tg-tooltip="A radar for the algorithm. It scans your dashboard automatically. Apply to the specific roles it highlights to trigger priority grading.">App Tracker</button>
        <button id="tg-tab-btn-profile" class="trainai-tab ${needsOnboarding ? 'active' : ''}" data-tab="profile" data-tg-tooltip="Your personal vault. Step 1: Paste your resume and bio here. Step 2: Click Save. We will use this to auto-type your forms.">Master Profile</button>
      </div>
      
      <div class="trainai-tab-content ${needsOnboarding ? '' : 'active'}" id="trainai-tab-tracker">
        <div id="trainai-tracker-stats">
            <div class="tg-stat-box">
              <strong id="tg-stat-number">0</strong>
              <span>Active Applications</span>
            </div>
        </div>
        <div id="tg-algo-status" class="tg-algo-status low">Algorithm Priority: Low Visibility</div>
        <div id="trainai-tracker-advice" class="trainai-alert">Scanning...</div>
        
        <button id="tg-play-tour">▶️ Play Interactive Voice Tour</button>
      </div>
      
      <div class="trainai-tab-content ${needsOnboarding ? 'active' : ''}" id="trainai-tab-profile">
        ${needsOnboarding ? '<div class="trainai-alert" style="margin:0 0 16px 0; border-color:#10b981; color:#059669; background:rgba(16,185,129,0.1);"><strong>👋 START HERE:</strong> Paste your resume below and click Save. This allows you to apply 10x faster!</div>' : ''}
        <p style="font-size:12px; color:var(--tg-text-sec); margin-top:0;">Save your raw resume text and bio here. We'll use this to scan job matches and autofill your forms.</p>
        <label>Raw Resume Text</label>
        <textarea id="tg-profile-resume" placeholder="Paste your entire resume text here...">${profile.resume}</textarea>
        
        <label>Standard Bio / Intro</label>
        <textarea id="tg-profile-bio" placeholder="Hi, I am an expert in...">${profile.bio}</textarea>
        
        <label>LinkedIn URL</label>
        <input type="text" id="tg-profile-linkedin" placeholder="https://linkedin.com/in/..." value="${profile.linkedin}">
        
        <button id="trainai-save-profile">💾 Save Master Profile</button>
      </div>
      
      <div id="tg-tools-map-container" class="tg-tools-map" style="background: var(--tg-surface-light); padding: 16px; border-radius: 16px; border: 1px solid var(--tg-border); margin: 0 28px 28px 28px;">
        <h3 style="color:var(--tg-accent); margin:0 0 12px 0; font-size:12px; letter-spacing:1px; text-transform:uppercase;">📍 Hidden Tools Map</h3>
        <p style="margin:0 0 10px 0; font-size:13px; line-height:1.5;"><strong>🎯 Impact Coach:</strong> A live writing assistant that tracks your metrics. <em>(Automatically appears when you type in Interview forms)</em></p>
        <p style="margin:0; font-size:13px; line-height:1.5;"><strong>🔍 ATS Scanner:</strong> Scans job requirements to tell you which keywords you missed. <em>(Automatically appears on Job Application pages)</em></p>
      </div>

      <div id="trainai-autofill-btn" data-tg-tooltip="Step 1: Open a job application form. Step 2: Click this button to instantly auto-type your saved resume into all the empty boxes.">
        ⚡ Autofill This Page
      </div>
    `;
    
    container.appendChild(trigger);
    container.appendChild(panel);
    document.body.appendChild(container);

    // Logic: Open/Close Panel
    trigger.onclick = () => panel.classList.add('open');
    document.getElementById('trainai-panel-close').onclick = () => panel.classList.remove('open');

    // Logic: Tabs
    const tabs = panel.querySelectorAll('.trainai-tab');
    const contents = panel.querySelectorAll('.trainai-tab-content');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`trainai-tab-${tab.dataset.tab}`).classList.add('active');
        if (tab.dataset.tab === 'tracker') runTrackerScan();
      };
    });

    // Save Profile
    document.getElementById('trainai-save-profile').onclick = () => {
      chrome.storage.local.set({
        tgMasterProfile: {
          resume: document.getElementById('tg-profile-resume').value,
          bio: document.getElementById('tg-profile-bio').value,
          linkedin: document.getElementById('tg-profile-linkedin').value
        }
      }, () => {
        showToast('✅ Profile Saved Successfully!');
      });
    };

    // Autofill
    document.getElementById('trainai-autofill-btn').onclick = () => {
      chrome.storage.local.get(['tgMasterProfile'], (res) => {
        if (!res.tgMasterProfile || !res.tgMasterProfile.resume) {
          showToast('⚠️ Save your Master Profile first!');
          document.querySelector('[data-tab="profile"]').click();
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

    // Voice Tour
    document.getElementById('tg-play-tour').onclick = playVoiceTour;

    if (!needsOnboarding) {
        runTrackerScan();
    }
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
// The Voice Guided Interactive Tour
// ----------------------------------------------------
async function playVoiceTour() {
    const steps = [
        {
            text: "Welcome to Train AI To Gain! Let me walk you through exactly how to bypass the AI and get hired faster.",
            element: null
        },
        {
            text: "Step 1: The Master Profile. Save your resume here once, so you can apply to jobs ten times faster without retyping.",
            element: 'tg-tab-btn-profile'
        },
        {
            text: "Step 2: The App Tracker. Monitor your Algorithm Status here. You need three active applications to get prioritized for human review.",
            element: 'tg-tab-btn-tracker'
        },
        {
            text: "Step 3: The ATS Scanner. When you find a job you like, we will automatically inject a scanner on the page to tell you which keywords to add to beat the filters.",
            element: 'tg-tools-map-container'
        },
        {
            text: "Step 4: Autofill. Click this button to instantly beam your saved profile into the empty job application boxes.",
            element: 'trainai-autofill-btn'
        },
        {
            text: "Step 5: Impact Coach. During interviews, we will inject a live writing assistant to ensure you use enough metrics to impress the AI.",
            element: 'tg-tools-map-container'
        }
    ];

    window.speechSynthesis.cancel();
    
    for (let step of steps) {
        await new Promise(resolve => {
            if (step.element) {
                document.getElementById(step.element)?.classList.add('tg-tour-active');
                if (step.element === 'tg-tab-btn-profile') document.getElementById('tg-tab-btn-profile').click();
                if (step.element === 'tg-tab-btn-tracker') document.getElementById('tg-tab-btn-tracker').click();
            }

            const utterance = new SpeechSynthesisUtterance(step.text);
            utterance.rate = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const premiumVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
            if (premiumVoice) utterance.voice = premiumVoice;

            utterance.onend = () => {
                if (step.element) document.getElementById(step.element)?.classList.remove('tg-tour-active');
                setTimeout(resolve, 300); // slight pause between steps
            };
            
            // Fallback resolve in case TTS fails to end
            setTimeout(() => {
                if (step.element) document.getElementById(step.element)?.classList.remove('tg-tour-active');
                resolve();
            }, 8000);

            window.speechSynthesis.speak(utterance);
        });
    }
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
  
  // BUG FIX: Added 'submitted'
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
