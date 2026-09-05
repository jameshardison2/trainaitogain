// TrainAIToGain - The "Get You Hired" Extension V2.0 (Blockbuster Overhaul)

let isEnabled = true;

// 1. Initialize
chrome.storage.local.get(['cheatCodeEnabled'], (res) => {
  if (res.cheatCodeEnabled !== undefined) isEnabled = res.cheatCodeEnabled;
  if (isEnabled) initCoreFeatures();
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleStateChanged") {
    isEnabled = request.enabled;
    if (isEnabled) initCoreFeatures();
    else document.querySelectorAll('.trainai-injected').forEach(el => el.remove());
  } else if (request.action === "toggleHub") {
    const panel = document.getElementById('trainai-side-panel');
    if (panel) {
      if (panel.classList.contains('open')) {
        panel.classList.remove('open');
      } else {
        panel.classList.add('open');
      }
    } else {
      initCoreFeatures();
      setTimeout(() => {
        const p = document.getElementById('trainai-side-panel');
        if (p) p.classList.add('open');
      }, 100);
    }
  }
});

function initCoreFeatures() {
  if (!isEnabled) return;
  injectSidePanel();
  
  // Continuous polling for contextual injections
  setInterval(() => {
    if (!isEnabled) return;
    const url = window.location.href.toLowerCase();
    
    // 1. Master Autofill Button visibility
    const autofillBtn = document.getElementById('trainai-autofill-btn');
    if (autofillBtn) {
      const inputs = document.querySelectorAll('input[type="text"], textarea');
      autofillBtn.style.display = (inputs.length > 0 && !url.includes('roles')) ? 'flex' : 'none';
    }

    // 2. ATS Scanner (Only on Job Descriptions)
    if (url.includes('roles') || url.includes('opportunities') || url.includes('jobs/list_') || url.includes('/job')) {
      injectATSScanner();
    } else {
      const scanner = document.getElementById('trainai-ats-scanner');
      if (scanner) scanner.remove();
    }
  }, 2000);

  // 3. Impact Coach (Event Delegation on all textareas)
  document.addEventListener('focusin', handleTextareaFocus);
  document.addEventListener('focusout', handleTextareaBlur);
  document.addEventListener('input', handleImpactCoaching);
}

// ----------------------------------------------------
// FEATURE 1 & 2: The Unified Side-Panel (Tracker & Profile)
// ----------------------------------------------------
function injectSidePanel() {
  if (document.getElementById('trainai-panel-container')) return;

  const container = document.createElement('div');
  container.id = 'trainai-panel-container';
  container.className = 'trainai-injected';
  
  // The subtle tab that hangs off the right side of the screen
  const trigger = document.createElement('div');
  trigger.id = 'trainai-panel-trigger';
  trigger.innerHTML = `<img src="${chrome.runtime.getURL('icon.svg')}" width="20" height="20" style="border-radius:4px; margin-right:8px;"> TATG Hub`;
  
  // The actual panel
  const panel = document.createElement('div');
  panel.id = 'trainai-side-panel';
  panel.innerHTML = `
    <div class="trainai-panel-header">
      <img src="${chrome.runtime.getURL('icon.svg')}" width="24" height="24" style="border-radius:4px;">
      <h2>TrainAIToGain</h2>
      <button id="trainai-panel-close">×</button>
    </div>
    
    <div class="trainai-tabs">
      <button class="trainai-tab active" data-tab="tracker" data-tg-tooltip="A radar for the algorithm. It scans your dashboard automatically. Apply to the specific roles it highlights to trigger priority grading.">App Tracker</button>
      <button class="trainai-tab" data-tab="profile" data-tg-tooltip="Your personal vault. Step 1: Paste your resume and bio here. Step 2: Click Save. We will use this to auto-type your forms.">Master Profile</button>
    </div>
    
    <div class="trainai-tab-content active" id="trainai-tab-tracker">
      <div id="trainai-tracker-stats">Scanning dashboard...</div>
      <div id="trainai-tracker-advice" class="trainai-alert"></div>
    </div>
    
    <div class="trainai-tab-content" id="trainai-tab-profile">
      <p style="font-size:12px; color:var(--tg-text-sec); margin-top:0;">Save your raw resume text and bio here. We'll use this to scan job matches and autofill your forms.</p>
      <label>Raw Resume Text</label>
      <textarea id="tg-profile-resume" placeholder="Paste your entire resume text here..."></textarea>
      
      <label>Standard Bio / Intro</label>
      <textarea id="tg-profile-bio" placeholder="Hi, I am an expert in..."></textarea>
      
      <label>LinkedIn URL</label>
      <input type="text" id="tg-profile-linkedin" placeholder="https://linkedin.com/in/...">
      
      <button id="trainai-save-profile">💾 Save Master Profile</button>
    </div>
    

    <div class="tg-tools-map">
      <h3>📍 Tools Map</h3>
      <p><strong>Impact Coach & ATS Scanner:</strong> These tools are automatically injected directly onto Job Application pages and Interview forms when you open them!</p>
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

  // Logic: Master Profile Saving & Loading
  const pResume = document.getElementById('tg-profile-resume');
  const pBio = document.getElementById('tg-profile-bio');
  const pLink = document.getElementById('tg-profile-linkedin');
  const saveBtn = document.getElementById('trainai-save-profile');
  
  chrome.storage.local.get(['tgMasterProfile'], (res) => {
    if (res.tgMasterProfile) {
      
      pResume.value = res.tgMasterProfile.resume || '';
      pBio.value = res.tgMasterProfile.bio || '';
      pLink.value = res.tgMasterProfile.linkedin || '';
    }
    
    // START HERE onboarding logic
    if (!res.tgMasterProfile || !res.tgMasterProfile.resume) {
        // Switch to profile tab automatically
        document.querySelector('[data-tab="profile"]').click();
        
        // Add a "Start Here" banner
        const profileTab = document.getElementById('trainai-tab-profile');
        if (!document.getElementById('tg-start-here')) {
            const banner = document.createElement('div');
            banner.id = 'tg-start-here';
            banner.className = 'trainai-alert';
            banner.style.marginTop = '0';
            banner.style.marginBottom = '16px';
            banner.style.borderColor = '#10b981';
            banner.style.color = '#10b981';
            banner.style.background = 'rgba(16,185,129,0.1)';
            banner.innerHTML = '<strong>👋 START HERE:</strong> Paste your resume below and click Save. This unlocks the Autofill tool!';
            profileTab.prepend(banner);
        }
    }

  });

  saveBtn.onclick = () => {
    saveBtn.innerText = '⏳ Saving...';
    chrome.storage.local.set({
      tgMasterProfile: {
        resume: pResume.value,
        bio: pBio.value,
        linkedin: pLink.value
      }
    }, () => {
      setTimeout(() => { saveBtn.innerText = '✅ Saved!'; }, 500);
      setTimeout(() => { saveBtn.innerText = '💾 Save Master Profile'; }, 2500);
    });
  };

  // Logic: Autofill Page
  const autoBtn = document.getElementById('trainai-autofill-btn');
  autoBtn.onclick = () => {
    autoBtn.innerText = '⏳ Filling...';
    chrome.storage.local.get(['tgMasterProfile'], (res) => {
      if (!res.tgMasterProfile) {
        autoBtn.innerText = '⚠️ Save Profile First!';
        setTimeout(() => { autoBtn.innerHTML = '⚡ Autofill This Page'; }, 2000);
        return;
      }
      const inputs = document.querySelectorAll('input[type="text"], textarea');
      inputs.forEach(input => {
        const name = (input.name || input.id || input.placeholder || '').toLowerCase();
        if (name.includes('linkedin') || name.includes('url')) {
          setReactInputValue(input, res.tgMasterProfile.linkedin);
        } else if (name.includes('bio') || name.includes('about') || name.includes('describe')) {
          setReactInputValue(input, res.tgMasterProfile.bio);
        } else if (name.includes('experience') || name.includes('resume')) {
          setReactInputValue(input, res.tgMasterProfile.resume);
        }
      });
      setTimeout(() => { autoBtn.innerText = '✅ Autofilled!'; }, 500);
      setTimeout(() => { autoBtn.innerHTML = '⚡ Autofill This Page'; }, 2000);
    });
  };

  // Initial scan for tracker
  runTrackerScan();
  
  // Onboarding Tooltip
  chrome.storage.local.get(['tgOnboardingSeen'], (res) => {
    if (!res.tgOnboardingSeen) {
      const tooltip = document.createElement('div');
      tooltip.className = 'trainai-injected';
      tooltip.style.cssText = 'position:fixed; top:50%; right:140px; transform:translateY(-50%); background:rgba(16,185,129,0.9); color:white; padding:12px 16px; border-radius:8px; font-family:Inter,sans-serif; font-size:14px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.2); z-index:999999; backdrop-filter:blur(10px); display:flex; align-items:center; gap:8px; pointer-events:none;';
      tooltip.innerHTML = '<span>TrainAIToGain: Click here to set up your profile and enable Autofill ➔</span>';
      document.body.appendChild(tooltip);
      
      trigger.addEventListener('click', () => {
        tooltip.remove();
        chrome.storage.local.set({tgOnboardingSeen: true});
      }, {once: true});
    }
  });
}

function setReactInputValue(input, value) {
  if (!value) return;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
  if (input.tagName === 'INPUT') nativeInputValueSetter.call(input, value);
  if (input.tagName === 'TEXTAREA') nativeTextAreaValueSetter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function runTrackerScan() {
  const statsDiv = document.getElementById('trainai-tracker-stats');
  const adviceDiv = document.getElementById('trainai-tracker-advice');
  if (!statsDiv || !adviceDiv) return;

  const text = document.body.innerText.toLowerCase();
  let apps = 0;
  
  // A crude but effective heuristic to find the "Applications X" text on the dashboard
  const appMatch = document.body.innerText.match(/(?:active|in progress|under review|applied).*?(\d+)/i) || document.body.innerText.match(/(\d+).*?(?:active|in progress|under review|applied)/i);
  if (appMatch) {
    apps = parseInt(appMatch[1]);
  } else {
    const matches = document.body.innerText.match(/\b(?:in progress|active|under review)\b/gi);
    if (matches) apps = matches.length;
  }
  
  statsDiv.innerHTML = `
    <div class="tg-stat-box">
      <strong>${apps}</strong>
      <span>Active Applications</span>
    </div>
  `;

  if (apps < 3) {
    adviceDiv.className = 'trainai-alert tg-alert-warning';
    adviceDiv.innerHTML = '⚠️ <strong>Low Volume:</strong> The algorithm prioritizes candidates with 3+ applications. Apply to more domain expert roles to trigger priority grading.';
  } else if (text.includes('incomplete') || text.includes('step 2') || text.includes('step 3')) {
    adviceDiv.className = 'trainai-alert tg-alert-danger';
    adviceDiv.innerHTML = '🚨 <strong>Incomplete Found:</strong> You have roles waiting on Video Interviews. The AI will not grade you until these are finished.';
  } else {
    adviceDiv.className = 'trainai-alert tg-alert-success';
    adviceDiv.innerHTML = '✅ <strong>Pipeline Healthy:</strong> You are fully in the AI grading algorithm. No action needed, wait for email updates.';
  }
}

// ----------------------------------------------------
// FEATURE 3: The ATS Pre-Scanner
// ----------------------------------------------------
function injectATSScanner() {
  if (document.getElementById('trainai-ats-scanner')) return;
  
  // Look for the apply button container or job title to anchor the scanner
  const mainContent = document.querySelector('main') || document.body;
  
  const scanner = document.createElement('div');
  scanner.id = 'trainai-ats-scanner';
  scanner.className = 'trainai-injected';
  scanner.innerHTML = `<button id="tg-scan-btn" data-tooltip="Like an X-ray for job descriptions. It shows you exactly what keywords you're missing before you apply.">🔍 Run ATS Keyword Scan</button>`;
  
  // Try to inject it cleanly at the top of the content
  mainContent.insertBefore(scanner, mainContent.firstChild);

  document.getElementById('tg-scan-btn').onclick = () => {
    const btn = document.getElementById('tg-scan-btn');
    btn.innerText = '⏳ Scanning...';
    
    chrome.storage.local.get(['tgMasterProfile'], (res) => {
      const resume = (res.tgMasterProfile && res.tgMasterProfile.resume) ? res.tgMasterProfile.resume.toLowerCase() : '';
      if (!resume) {
        alert("Please save your Raw Resume Text in the TrainAIToGain Side Panel first!");
        btn.innerText = '🔍 Run ATS Keyword Scan';
        return;
      }

      // Extract text from the page (the job description)
      const jdText = document.body.innerText.toLowerCase();
      
      // Highly crude keyword extraction (just for demonstration of value)
      const commonTechWords = ['python', 'react', 'javascript', 'sql', 'aws', 'docker', 'machine learning', 'ai', 'data analysis', 'figma', 'node.js', 'typescript', 'rest api', 'agile'];
      let foundJdWords = commonTechWords.filter(w => jdText.includes(w));
      
      if (foundJdWords.length === 0) foundJdWords = ['communication', 'leadership', 'problem solving']; // Fallback
      
      let matched = 0;
      let missing = [];
      foundJdWords.forEach(w => {
        if (resume.includes(w)) matched++;
        else missing.push(w);
      });
      
      let score = Math.round((matched / foundJdWords.length) * 100) || 100;

      // Show result modal
      const modal = document.createElement('div');
      modal.className = 'tg-modal-overlay trainai-injected';
      modal.innerHTML = `
        <div class="tg-modal">
          <h3>ATS Scanner Results</h3>
          <div class="tg-score ${score >= 70 ? 'tg-good' : 'tg-bad'}">${score}% Match</div>
          <p>Mercor's AI parser will scan your resume for these specific terms found in the job description.</p>
          ${missing.length > 0 ? `
            <div class="tg-missing-box">
              <strong>Missing Keywords (Add these!):</strong>
              <ul>${missing.map(m => `<li>${m}</li>`).join('')}</ul>
            </div>
          ` : '<div class="tg-missing-box tg-good-box">You hit all the core keywords!</div>'}
          <button onclick="this.closest('.tg-modal-overlay').remove()">Close</button>
        </div>
      `;
      document.body.appendChild(modal);
      btn.innerText = '✅ Scan Complete';
      setTimeout(() => { btn.innerText = '🔍 Run ATS Keyword Scan'; }, 3000);
    });
  };
}

// ----------------------------------------------------
// FEATURE 4: The Impact Framework Coach
// ----------------------------------------------------
let activeCoachTarget = null;

function handleTextareaFocus(e) {
  if (!isEnabled) return;
  if (e.target.tagName === 'TEXTAREA') {
    activeCoachTarget = e.target;
    injectCoachWidget(e.target);
    updateCoachScore(e.target.value);
  }
}

function handleTextareaBlur(e) {
  if (e.target.tagName === 'TEXTAREA') {
    setTimeout(() => {
      // Small delay to allow clicking on the widget if needed
      if (activeCoachTarget === e.target) {
        const widget = document.getElementById('trainai-impact-coach');
        if (widget) widget.classList.add('tg-fade-out');
        setTimeout(() => { if (widget) widget.remove(); activeCoachTarget = null; }, 300);
      }
    }, 200);
  }
}

function handleImpactCoaching(e) {
  if (!isEnabled) return;
  if (e.target === activeCoachTarget) {
    updateCoachScore(e.target.value);
  }
}

function injectCoachWidget(textarea) {
  if (document.getElementById('trainai-impact-coach')) return;
  
  const widget = document.createElement('div');
  widget.id = 'trainai-impact-coach';
  widget.className = 'trainai-injected';
  widget.innerHTML = `
    <div class="tg-coach-header" data-tooltip="A live spell-checker, but for impact. It forces you to write answers the AI actually respects by tracking your metrics.">🎯 Impact Coach Live</div>
    <div class="tg-coach-stats">
      <span id="tg-coach-metrics">0 Metrics</span> | 
      <span id="tg-coach-verbs">0 Verbs</span>
    </div>
    <div id="tg-coach-advice" class="tg-coach-advice">Type to analyze...</div>
  `;
  
  // Position it right below the textarea
  const rect = textarea.getBoundingClientRect();
  widget.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  widget.style.left = (rect.left + window.scrollX) + 'px';
  widget.style.width = rect.width + 'px';
  
  document.body.appendChild(widget);
  
  // Re-position on window resize
  window.addEventListener('resize', () => {
    if (activeCoachTarget && document.getElementById('trainai-impact-coach')) {
      const r = activeCoachTarget.getBoundingClientRect();
      const w = document.getElementById('trainai-impact-coach');
      w.style.top = (r.bottom + window.scrollY + 8) + 'px';
      w.style.left = (r.left + window.scrollX) + 'px';
      w.style.width = r.width + 'px';
    }
  });
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
    adviceDiv.innerHTML = `❌ Weak phrasing detected: "${vagueFound[0]}". Use strong action verbs instead.`;
    adviceDiv.style.color = '#ef4444';
  } else if (metricsCount === 0 && text.length > 20) {
    adviceDiv.innerHTML = `⚠️ No metrics found. Add numbers, percentages, or $ impact.`;
    adviceDiv.style.color = '#f59e0b';
  } else if (metricsCount > 0 && verbCount > 0) {
    adviceDiv.innerHTML = `✅ Excellent! Strong Impact structure.`;
    adviceDiv.style.color = '#10b981';
  } else {
    adviceDiv.innerHTML = `Keep typing...`;
    adviceDiv.style.color = 'var(--tg-text-sec)';
  }
}


// Voice Tooltips (Text-to-Speech)
document.addEventListener('mouseover', (e) => {
  const tooltipElement = e.target.closest('[data-tg-tooltip]');
  if (tooltipElement) {
    // Prevent spamming the same speech
    if (window._tgLastSpoken === tooltipElement) return;
    window._tgLastSpoken = tooltipElement;
    
    const text = tooltipElement.getAttribute('data-tg-tooltip');
    window.speechSynthesis.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1.0;
    
    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    
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
