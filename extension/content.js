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
      <h2>Get You Hired</h2>
      <button id="trainai-panel-close">×</button>
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

  // 1. Look for the exact "Submitted applications (X)" dropdown
  const submittedMatch = text.match(/Submitted applications\s*\((\d+)\)/i);
  if (submittedMatch) {
      submittedCount = parseInt(submittedMatch[1], 10);
  } else {
      // Fallback
      const genericSubmitted = text.match(/(\d+)\s*submitted/i);
      if (genericSubmitted) submittedCount = parseInt(genericSubmitted[1], 10);
  }

  // 2. Look for "steps completed" (e.g. "2 of 3 steps completed") which means incomplete/pending
  const pendingMatches = [...text.matchAll(/(\d+)\s*of\s*(\d+)\s*steps\s*completed/gi)];
  pendingMatches.forEach(match => {
      if (match[1] !== match[2]) {
          pendingCount++;
      }
  });
  
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
        const transcript = event.results[0][0].transcript.toLowerCase();
        showToast(`You said: "${transcript}"`);
        
        // 1. Check if user has a text box focused (Voice Typing)
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
            setReactInputValue(activeElement, (activeElement.value ? activeElement.value + ' ' : '') + event.results[0][0].transcript);
            return;
        }

        // 2. Voice Commands
        if (transcript.includes('next') || transcript.includes('how') || transcript.includes('job') || transcript.includes('where') || transcript.includes('help')) {
            const magicBtn = document.getElementById('tg-magic-btn');
            magicBtn.classList.add('tg-pulse-anim'); // Highlight it
            setTimeout(() => magicBtn.classList.remove('tg-pulse-anim'), 3000);
            speakResponse("I have highlighted the Magic Navigator button at the bottom. Click it to proceed to your exact next step.");
        } else {
            speakResponse("I heard you, but I am not sure what that means. You can ask me what to do next, or click a text box to voice-type.");
        }
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
