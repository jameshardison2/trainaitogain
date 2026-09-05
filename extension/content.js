let isEnabled = true;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    setupSPAObserver();
    checkContextualOverlay();
    setInterval(checkContextualOverlay, 2000);
}

// ----------------------------------------------------
// 1. Contextual Overlays (The Job Board ATS Export)
// ----------------------------------------------------
function checkContextualOverlay() {
    const path = window.location.href.toLowerCase();
    
    // Feature 1: Auto-populate if they land on our Web ATS
    if (path.includes('trainaitogain.com/resume-ats-guide')) {
        chrome.storage.local.get(['tg_captured_job'], (res) => {
            if (res.tg_captured_job) {
                const jobBox = document.getElementById('job-desc');
                const badge = document.getElementById('import-badge');
                if (jobBox && badge) {
                    jobBox.value = res.tg_captured_job;
                    badge.style.display = 'inline-block';
                    chrome.storage.local.remove('tg_captured_job');
                }
            }
        });
        return;
    }

    // Feature 2: Inject smart floating widget if on a job board
    if (path.includes('explore') || path.includes('job') || path.includes('role') || path.includes('career')) {
        injectATSOverlay();
    } else {
        removeATSOverlay();
    }
}

function injectATSOverlay() {
    if (document.getElementById('tg-ats-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'tg-ats-overlay';
    overlay.className = 'tg-context-overlay';
    overlay.innerHTML = `
        <div class="tg-overlay-content">
            <span class="tg-icon">🎯</span>
            <div class="tg-overlay-text">
                <strong>ATS Scanner</strong>
                <p>Export this job to scan against your resume.</p>
            </div>
            <button id="tg-overlay-scan-btn">Scan Job</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('tg-overlay-scan-btn').onclick = (e) => {
        const btn = e.target;
        btn.innerText = "Exporting...";
        const pageText = document.body.innerText;
        chrome.storage.local.set({ tg_captured_job: pageText }, () => {
            setTimeout(() => {
                window.open('https://trainaitogain.com/resume-ats-guide.html', '_blank');
                btn.innerText = "Scan Job";
            }, 600);
        });
    };
}

function removeATSOverlay() {
    const el = document.getElementById('tg-ats-overlay');
    if (el) el.remove();
}

// ----------------------------------------------------
// 2. Impact Coach (The Interview Overlay)
// ----------------------------------------------------
function setupSPAObserver() {
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (!isEnabled) return;
            
            // Look for any text inputs (this includes React controlled inputs)
            const inputs = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
            inputs.forEach(el => {
                if (!el.dataset.tgCoachAttached) {
                    el.dataset.tgCoachAttached = 'true';
                    el.addEventListener('focus', (e) => injectCoachWidget(e.target));
                    el.addEventListener('blur', () => {
                       // Small delay so if they click the widget itself, it doesn't instantly die
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
  widget.className = 'tg-coach-container';
  widget.innerHTML = `
    <div class="tg-coach-header">AI Impact Coach</div>
    <div class="tg-coach-stats">
      <span id="tg-coach-metrics">0 Metrics</span> <span style="opacity:0.3">|</span> 
      <span id="tg-coach-verbs">0 Verbs</span>
    </div>
    <div id="tg-coach-advice" class="tg-coach-advice pending">AI Grade: Start typing...</div>
  `;
  
  const rect = inputElement.getBoundingClientRect();
  widget.style.position = 'absolute';
  // Anchor to the bottom of the input field
  widget.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  widget.style.left = (rect.left + window.scrollX) + 'px';
  widget.style.width = Math.max(rect.width, 280) + 'px'; 
  
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
    adviceDiv.innerHTML = `<strong>AI Grade: Weak.</strong> Avoid vague phrases like "${vagueFound[0]}".`;
    adviceDiv.className = 'tg-coach-advice danger';
  } else if (metricsCount === 0 && text.length > 20) {
    adviceDiv.innerHTML = `<strong>AI Grade: Average.</strong> Add a number, %, or $ amount to prove scale.`;
    adviceDiv.className = 'tg-coach-advice warning';
  } else if (metricsCount > 0 && verbCount > 0) {
    adviceDiv.innerHTML = `<strong>AI Grade: Strong!</strong> The algorithm will prioritize this response.`;
    adviceDiv.className = 'tg-coach-advice success';
  } else {
    adviceDiv.innerHTML = `<strong>AI Grade: Pending...</strong>`;
    adviceDiv.className = 'tg-coach-advice pending';
  }
}
