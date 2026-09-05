let isEnabled = true;
let toast = null;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
  injectUI();
}

function showToast(message) {
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
// UI Injection
// ----------------------------------------------------
function injectUI() {
  if (document.getElementById('trainai-panel-trigger')) return;

  const container = document.createElement('div');
  container.className = 'trainai-injected';
  
  const trigger = document.createElement('button');
  trigger.id = 'trainai-panel-trigger';
  trigger.innerText = 'Get You Hired';

  const panel = document.createElement('div');
  panel.id = 'trainai-panel';
  
  panel.innerHTML = `
    <div class="trainai-panel-header">
      <div class="trainai-panel-header-left">
        <h2>Get You Hired</h2>
      </div>
      <div class="trainai-panel-header-right">
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

      <!-- SECTION 2: ATS Scanner -->
      <div class="tg-section" data-tg-tooltip="Capture the current job description and export it to our powerful Web ATS Scanner.">
          <h3 class="tg-section-title">ATS KEYWORD SCANNER</h3>
          <p style="font-size:12px; color:var(--tg-text-sec); margin-bottom:16px;">
              Automatically capture this job listing and export it to the TrainAIToGain ATS tool to compare it against your resume.
          </p>
          <button id="tg-scan-btn-panel" class="tg-btn-primary" style="width:100%; padding:12px; font-weight:600;">Export to Web ATS ➔</button>
      </div>

    </div>

    <!-- SECTION 3: Magic Navigator -->
    <div class="tg-bottom-bar" data-tg-tooltip="This is the Magic Navigator. It shape-shifts to guide you to your exact next step.">
        <div id="tg-nav-status" class="tg-nav-status">Analyzing Context...</div>
        <div style="display:flex; gap:8px; align-items:center;">
            <button id="tg-magic-btn" style="flex:1;">
              Loading...
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

  // Bind ATS Scanner Button
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

  setInterval(updateSmartNavigator, 1500);
  updateSmartNavigator();

  runTrackerScan();
  setupSPAObserver();
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
                chrome.storage.local.remove('tg_captured_job');
            }
        }
    });
}

// ----------------------------------------------------
// The Magic Navigator
// ----------------------------------------------------
function updateSmartNavigator() {
    const magicBtn = document.getElementById('tg-magic-btn');
    const navStatus = document.getElementById('tg-nav-status');
    
    if (!magicBtn || !navStatus) return;

    const path = window.location.href.toLowerCase();
    
    // State 0: On TrainAIToGain Website
    if (path.includes('trainaitogain.com')) {
        navStatus.innerText = 'Current Step: Choose Your Path';
        magicBtn.innerHTML = 'Explore the Pipelines below!';
        magicBtn.onclick = null;
        return;
    }
    
    // State 1: On Job Board
    if (path.includes('explore') || path.includes('job') || path.includes('role')) {
        navStatus.innerText = 'Current Step: Scan & Apply';
        magicBtn.innerHTML = 'Capture Job for ATS ➔';
        magicBtn.onclick = () => {
            const scanBtn = document.getElementById('tg-scan-btn-panel');
            if (scanBtn) scanBtn.click();
        };
        return;
    }

    // State 1.5: Pending Interviews
    const pendingElem = document.getElementById('tg-stat-pending');
    if (pendingElem && parseInt(pendingElem.innerText) > 0 && !path.includes('interview')) {
        navStatus.innerText = 'Current Step: Finish Interviews';
        magicBtn.innerHTML = 'Go to your Interviews tab ➔';
        magicBtn.style.background = 'var(--tg-warning)';
        magicBtn.style.color = '#fff';
        magicBtn.onclick = () => {
            showToast('Please click on your Interviews tab to finish your pending interviews.');
        };
        return;
    } else {
        magicBtn.style.background = '';
        magicBtn.style.color = '';
    }

    // State 2: On Interview
    if (path.includes('interview')) {
        navStatus.innerText = 'Current Step: Ace the Interview';
        magicBtn.innerHTML = 'Impact Coach is Active ✓';
        magicBtn.style.background = 'var(--tg-success)';
        magicBtn.style.color = '#fff';
        magicBtn.onclick = () => {
            showToast('Click into any text box to see the Live Impact Coach in action!');
        };
        return;
    }

    // State 3: Default (Wandering)
    navStatus.innerText = 'Current Step: Explore Opportunities';
    magicBtn.innerHTML = 'Navigate to the Job Board ➔';
    magicBtn.onclick = () => {
        showToast('Please click on the Jobs/Explore tab in Mercor.');
    };
}

// ----------------------------------------------------
// Pipeline Tracker
// ----------------------------------------------------
function runTrackerScan() {
  const adviceDiv = document.getElementById('trainai-tracker-advice');
  const submittedElem = document.getElementById('tg-stat-submitted');
  const pendingElem = document.getElementById('tg-stat-pending');
  const statusElem = document.getElementById('tg-algo-status');
  if (!adviceDiv || !submittedElem || !pendingElem || !statusElem || !document.body) return;

  const text = document.body.textContent;
  
  let submittedCount = 0;
  let pendingCount = 0;

  // Find Submitted
  const submittedMatch = text.match(/Submitted applications\s*\(?(\d+)\)?/i);
  if (submittedMatch) {
      submittedCount = parseInt(submittedMatch[1], 10);
  } else {
      const genericSubmitted = text.match(/(\d+)\s*submitted/i);
      if (genericSubmitted) submittedCount = parseInt(genericSubmitted[1], 10);
  }

  // Find Pending
  const applicationsTabMatch = text.match(/Applications\s*(\d+)/i);
  if (applicationsTabMatch) {
      pendingCount = parseInt(applicationsTabMatch[1], 10);
  } else {
      const pendingMatches = [...text.matchAll(/(\d+)\s*of\s*(\d+)\s*steps\s*completed/gi)];
      pendingMatches.forEach(match => {
          if (match[1] !== match[2]) pendingCount++;
      });
  }
  
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
// SPA Mutation Observer & Impact Coach
// ----------------------------------------------------
function setupSPAObserver() {
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!isEnabled) return;
            
            runTrackerScan();

            // Broadened selector to catch all types of text inputs
            const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
            inputs.forEach(el => {
                if (!el.dataset.tgCoachAttached) {
                    el.dataset.tgCoachAttached = 'true';
                    el.addEventListener('focus', (e) => injectCoachWidget(e.target));
                    el.addEventListener('blur', () => {
                       setTimeout(() => {
                           const widget = document.getElementById('trainai-impact-coach');
                           if (widget) widget.remove();
                       }, 300);
                    });
                    el.addEventListener('input', (e) => {
                        const val = e.target.value || e.target.innerText;
                        updateCoachScore(val);
                    });
                }
            });
        }, 500);
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function injectCoachWidget(inputElement) {
  if (!inputElement || document.getElementById('trainai-impact-coach')) return;
  
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
  
  const rect = inputElement.getBoundingClientRect();
  widget.style.position = 'absolute';
  widget.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  widget.style.left = (rect.left + window.scrollX) + 'px';
  widget.style.width = Math.max(rect.width, 250) + 'px'; // Ensure minimum width
  widget.style.zIndex = '999999';
  
  if (document.body) document.body.appendChild(widget);
  const initialVal = inputElement.value || inputElement.innerText;
  updateCoachScore(initialVal);
}

function updateCoachScore(text) {
  const widget = document.getElementById('trainai-impact-coach');
  if (!widget) return;
  
  text = text || '';
  const metricsCount = (text.match(/\d+|%|\$|percent/g) || []).length;
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'increased', 'decreased', 'improved', 'optimized', 'engineered', 'designed', 'architected', 'implemented'];
  
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
