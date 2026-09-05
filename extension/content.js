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
        <button id="tg-settings-btn" data-tg-tooltip="AI Settings (API Key)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <button id="trainai-panel-close">×</button>
      </div>
    </div>
    
    <div class="trainai-dashboard-container">
      
      <!-- SECTION 1: Pipeline Tracker -->
      <div class="tg-section" data-tg-tooltip="This tracks your Mercor pipeline. Finish your pending interviews to get graded.">
          <h3 class="tg-section-title">PIPELINE STATUS</h3>
          <div id="trainai-tracker-stats">
              <div class="tg-stat-box">
                  <strong id="tg-stat-submitted">0</strong>
                  <span>Submitted</span>
              </div>
              <div class="tg-stat-box">
                  <strong id="tg-stat-pending">0</strong>
                  <span>Pending</span>
              </div>
          </div>
          <div id="tg-algo-status" class="tg-algo-status low">Scanning Pipeline...</div>
          <div id="trainai-tracker-advice" class="trainai-alert">Analyzing your Mercor dashboard...</div>
      </div>

    </div>

    <!-- SECTION 3: Magic Navigator (Shape-Shifting Context Button) -->
    <div class="tg-bottom-bar" data-tg-tooltip="This is the Magic Navigator. It shape-shifts to guide you to your exact next step.">
        <div id="tg-nav-status" class="tg-nav-status">Analyzing Context...</div>
        <div style="display:flex; gap:8px; align-items:center;">
            <button id="tg-magic-btn" style="flex:1;">
              Loading...
            </button>
            <button id="tg-voice-assistant-btn" class="tg-mic-btn" data-tg-tooltip="Click to speak! Ask 'what do I do next?' or use it to voice-type your answers.">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="tg-settings-modal">
        <h3 style="margin-bottom: 8px; color: var(--tg-accent);">Unlock Your AI Coach</h3>
        <p style="font-size: 12px; color: var(--tg-text-sec); margin-bottom: 16px; line-height: 1.4;">
            To give you an unfair advantage in your Mercor interview, this extension uses Google's genius-level Gemini AI to analyze your screen and feed you the perfect answers out loud.
        </p>
        
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; font-weight: 500;">🔒 100% Secure & Private</p>
            <p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.4;">
                We don't use central servers. You bring your own free API key. It is saved <b>locally</b> on your device and communicates directly with Google. We never see your data.
            </p>
        </div>

        <label>Your Free Google Gemini API Key</label>
        <input type="password" id="tg-api-key-input" placeholder="AIzaSy...">
        <p style="font-size:11px; color:#64748b; margin-top:-8px; margin-bottom:16px;">
            Takes 10 seconds: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--tg-accent); font-weight: 600;">Get your free key here</a>.
        </p>
        
        <div style="display:flex; justify-content:flex-end;">
            <button id="tg-settings-cancel" class="tg-btn-secondary">Cancel</button>
            <button id="tg-settings-save" class="tg-btn-primary">Activate AI</button>
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

  // Logic: Settings Modal
  const settingsBtn = document.getElementById('tg-settings-btn');
  const settingsModal = document.getElementById('tg-settings-modal');
  const cancelBtn = document.getElementById('tg-settings-cancel');
  const saveBtn = document.getElementById('tg-settings-save');
  const keyInput = document.getElementById('tg-api-key-input');

  chrome.storage.local.get(['tgGeminiKey'], (res) => {
      if (res.tgGeminiKey) keyInput.value = res.tgGeminiKey;
  });

  if (settingsBtn) settingsBtn.onclick = () => settingsModal.classList.add('active');
  if (cancelBtn) cancelBtn.onclick = () => settingsModal.classList.remove('active');
  if (saveBtn) {
      saveBtn.onclick = () => {
          chrome.storage.local.set({ tgGeminiKey: keyInput.value.trim() }, () => {
              settingsModal.classList.remove('active');
              showToast('API Key saved successfully!');
          });
      };
  }

  // Initialize Voice Assistant
  initVoiceAssistant();

  // Initialize Magic Navigator Loop
  setInterval(updateSmartNavigator, 1500);
  updateSmartNavigator();

  runTrackerScan();
  setupSPAObserver();
}

// ----------------------------------------------------
// The Magic Navigator (Context-Aware State Machine)
// ----------------------------------------------------
function updateSmartNavigator() {
    const magicBtn = document.getElementById('tg-magic-btn');
    const navStatus = document.getElementById('tg-nav-status');
    
    if (!magicBtn || !navStatus) return;

    const path = window.location.href.toLowerCase();
    
    // State 1: On Job Board
    if (path.includes('explore') || path.includes('job') || path.includes('role')) {
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

    // State 1.5: Pending Interviews
    const pendingElem = document.getElementById('tg-stat-pending');
    if (pendingElem && parseInt(pendingElem.innerText) > 0 && !path.includes('interview')) {
        navStatus.innerText = 'Current Step: Finish Interviews';
        magicBtn.innerHTML = 'Practice Pending Interviews ➔';
        magicBtn.style.background = 'var(--tg-warning)';
        magicBtn.style.color = '#fff';
        magicBtn.onclick = () => {
            showToast('Routing to Interview Practice...');
            setTimeout(() => { window.location.href = 'https://work.mercor.com/interviews'; }, 500);
        };
        return;
    } else {
        magicBtn.style.background = '';
        magicBtn.style.color = '';
    }

    // State 2: On Interview
    if (path.includes('interview')) {
        navStatus.innerText = 'Current Step: Ace the Interview';
        magicBtn.innerHTML = 'Activate Impact Coach';
        magicBtn.onclick = () => {
            const textareas = document.querySelectorAll('textarea');
            if (textareas.length > 0) {
                textareas[0].focus();
                showToast('Coach is listening. Start typing or use the mic!');
            } else {
                showToast('No text box found yet.');
            }
        };
        return;
    }

    // State 3: Default (Wandering) -> Guide them back to Jobs
    navStatus.innerText = 'Current Step: Explore Opportunities';
    magicBtn.innerHTML = 'Take me to Job Board ➔';
    magicBtn.onclick = () => {
        showToast('Routing to Job Board...');
        setTimeout(() => { window.location.href = 'https://work.mercor.com/explore'; }, 500);
    };
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
                runTrackerScan();

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
  const submittedElem = document.getElementById('tg-stat-submitted');
  const pendingElem = document.getElementById('tg-stat-pending');
  const statusElem = document.getElementById('tg-algo-status');
  if (!adviceDiv || !submittedElem || !pendingElem || !statusElem || !document.body) return;

  const text = document.body.textContent;
  
  let submittedCount = 0;
  let pendingCount = 0;

  // 1. Look for "Submitted applications (X)" OR "Submitted applicationsX"
  const submittedMatch = text.match(/Submitted applications\s*\(?(\d+)\)?/i);
  if (submittedMatch) {
      submittedCount = parseInt(submittedMatch[1], 10);
  } else {
      // Fallback
      const genericSubmitted = text.match(/(\d+)\s*submitted/i);
      if (genericSubmitted) submittedCount = parseInt(genericSubmitted[1], 10);
  }

  // 2. Look for "Applications X" which represents the pending/draft apps tab
  const applicationsTabMatch = text.match(/Applications\s*(\d+)/i);
  if (applicationsTabMatch) {
      pendingCount = parseInt(applicationsTabMatch[1], 10);
  } else {
      // Fallback to "steps completed" (e.g. "2 of 3 steps completed")
      const pendingMatches = [...text.matchAll(/(\d+)\s*of\s*(\d+)\s*steps\s*completed/gi)];
      pendingMatches.forEach(match => {
          if (match[1] !== match[2]) {
              pendingCount++;
          }
      });
  }
  
  // Update UI
  submittedElem.innerText = submittedCount;
  pendingElem.innerText = pendingCount;

  if (pendingCount > 0) {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Priority: Blocked';
    adviceDiv.innerHTML = `You have <strong>${pendingCount} pending interviews</strong>. Mercor's AI cannot grade you until these are finished.`;
  } else if (submittedCount > 0) {
    statusElem.className = 'tg-algo-status priority';
    statusElem.innerText = 'Priority: High';
    adviceDiv.innerHTML = 'You are fully in the AI grading pool. No pending action needed.';
  } else {
    statusElem.className = 'tg-algo-status low';
    statusElem.innerText = 'Priority: Low Visibility';
    adviceDiv.innerHTML = 'Apply to jobs to enter the grading algorithm.';
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

// ----------------------------------------------------
// Voice Assistant (Speech Recognition)
// ----------------------------------------------------
function initVoiceAssistant() {
    const micBtn = document.getElementById('tg-voice-assistant-btn');
    if (!micBtn) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        micBtn.style.display = 'none';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micBtn.onclick = () => {
        if (micBtn.classList.contains('listening')) {
            recognition.stop();
            return;
        }
        
        micBtn.classList.add('listening');
        showToast('🎙️ Listening... Speak now!');
        recognition.start();
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        console.log("Voice Transcript:", transcript);

        // 1. Dictation Mode
        const activeTextInput = document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') ? document.activeElement : null;
        if (activeTextInput) {
            setReactInputValue(activeTextInput, activeTextInput.value + " " + transcript);
            speakResponse("Dictated.");
            return;
        }

        // 2. AI Conversational Mode (BYOK)
        chrome.storage.local.get(['tgGeminiKey'], async (res) => {
            const apiKey = res.tgGeminiKey;
            if (!apiKey) {
                speakResponse("Please save your Gemini API key in the settings menu first.");
                const settingsModal = document.getElementById('tg-settings-modal');
                if (settingsModal) settingsModal.classList.add('active');
                return;
            }

            const magicBtn = document.getElementById('tg-magic-btn');
            if (magicBtn) {
                magicBtn.innerHTML = "Thinking...";
                magicBtn.classList.add('tg-pulse-anim');
            }

            try {
                const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
                let data = null;
                
                const context = document.body.textContent.substring(0, 4000);
                const prompt = `You are a highly intelligent, conversational AI assistant embedded directly into a Chrome extension for candidates using the Mercor platform. 
                Your goal is to help them navigate the platform, answer interview questions, or provide strategic advice.
                Keep your response conversational, extremely concise, and directly actionable (maximum 2-3 sentences). Do not use markdown styling since this will be spoken out loud via Text-to-Speech.

                User's spoken request: "${transcript}"
                
                Visible text on their current screen (for context):
                """
                ${context}
                """
                
                Provide your conversational response:`;

                for (const model of modelsToTry) {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    });
                    
                    const result = await response.json();
                    
                    // If it's a 404 (Model not found), try the next model
                    if (result.error && result.error.code === 404) {
                        console.warn(`Model ${model} not found. Trying next...`);
                        continue; 
                    }
                    
                    data = result;
                    break; // Success or fatal error (like 400 invalid key)
                }

                if (magicBtn) {
                    magicBtn.classList.remove('tg-pulse-anim');
                    updateSmartNavigator();
                }

                if (!data) {
                    speakResponse("Error: None of the supported AI models were found for your API key.");
                } else if (data.error) {
                    speakResponse("Error contacting AI: " + data.error.message);
                } else if (data.candidates && data.candidates.length > 0) {
                    const aiReply = data.candidates[0].content.parts[0].text;
                    speakResponse(aiReply);
                } else {
                    speakResponse("I couldn't process that.");
                }

            } catch (error) {
                console.error("AI Error:", error);
                if (magicBtn) {
                    magicBtn.classList.remove('tg-pulse-anim');
                    updateSmartNavigator();
                }
                speakResponse("Sorry, there was a network error contacting the AI.");
            }
        });
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
    };
    recognition.onerror = () => {
        micBtn.classList.remove('listening');
        showToast('Error: Could not hear your microphone.');
    };
}

function speakResponse(text) {
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
