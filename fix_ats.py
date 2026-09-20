import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to replace the entire DOMContentLoaded block for the ATS scanner with a dynamic fetch.
# The script starts at: document.addEventListener('DOMContentLoaded', function() {
# and ends before: const nudgeCTA = ...

# Let's locate the script block.
script_start_str = "document.addEventListener('DOMContentLoaded', function() {"
script_end_str = "const nudgeCTA ="

# Actually, the entire script block that holds `jobDescriptions` is better to replace.
# Let's write the new dynamic script:
new_script = """
  let jobDescriptions = {};
  let keywordSets = {};
  let resumePlaceholders = {};

  document.addEventListener('DOMContentLoaded', async function() {
    const roleSelect = document.getElementById('role-select');
    const jobDescBox = document.getElementById('job-desc');
    const badge = document.getElementById('import-badge');
    
    // Fetch live data from waves.json
    try {
      const response = await fetch('waves.json');
      const data = await response.json();
      
      // Clear existing hardcoded options
      roleSelect.innerHTML = '<option value="" disabled selected>Select an Active Wave Role...</option>';
      
      data.roles.forEach(role => {
        // Create option
        const opt = document.createElement('option');
        opt.value = role.title;
        opt.textContent = role.title + (role.status === 'ACTIVE' ? ' 🟢' : ' 🔴');
        roleSelect.appendChild(opt);
        
        // Populate dynamic dictionaries
        jobDescriptions[role.title] = role.description;
        
        // Generate ATS keywords (combine tags with some key nouns from description)
        let kws = new Set(role.tags);
        const descWords = role.description.split(' ');
        descWords.forEach(w => {
           // simple heuristic to pull important looking words (capitalized, length > 4)
           const clean = w.replace(/[^a-zA-Z]/g, '');
           if (clean.length > 4 && clean[0] === clean[0].toUpperCase()) {
               kws.add(clean);
           }
        });
        // Ensure at least 6-8 keywords for ATS scanning
        if (kws.size < 6) {
           kws.add("Evaluation");
           kws.add("Accuracy");
           kws.add("Quality");
        }
        keywordSets[role.title] = Array.from(kws);
        
        // Generic placeholder
        resumePlaceholders[role.title] = `John Doe\\nAI Evaluator\\n\\nExperience\\n- Evaluated large models for accuracy\\n- Performed data labeling and quality assurance for ${role.domain} domains...`;
      });
      
    } catch(err) {
      console.error("Failed to load waves.json", err);
    }
    
    const kwListEl = document.getElementById('keyword-list');
    const scanBtn = document.getElementById('scan-btn');
    const resumeBox = document.getElementById('resume-text');
    const meterFill = document.getElementById('meter-fill');
    const scoreText = document.getElementById('score-text');
    const feedbackBox = document.getElementById('feedback-box');
    const applyBtn = document.getElementById('apply-btn');
    
    function renderKeywords(role) {
      kwListEl.innerHTML = '';
      if(!keywordSets[role]) return;
      keywordSets[role].forEach(kw => {
        const chip = document.createElement('div');
        chip.className = 'kw-chip pending';
        chip.innerText = kw;
        kwListEl.appendChild(chip);
      });
    }

    roleSelect.addEventListener('change', function() {
      const selectedRole = this.value;
      if (jobDescriptions[selectedRole]) {
        jobDescBox.innerHTML = `<strong>Live Description:</strong> ${jobDescriptions[selectedRole]}`;
        badge.style.display = 'inline-block';
        badge.innerText = "Synced from Waves DB ✅";
        renderKeywords(selectedRole);
      }
    });

    // Auto-fill template button
    document.getElementById('fill-template-btn').addEventListener('click', function() {
      const selectedRole = roleSelect.value;
      if (!selectedRole || selectedRole === "") {
        alert("Please select a role first.");
        return;
      }
      resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
    });

    scanBtn.addEventListener('click', function() {
      const selectedRole = roleSelect.value;
      if (!selectedRole || selectedRole === "") {
        alert("Please select a target role first!");
        return;
      }
      
      const text = resumeBox.value.toLowerCase();
      if (text.length < 50) {
        alert("Please paste a full resume before scanning.");
        return;
      }

      scanBtn.innerText = 'Scanning...';
      meterFill.style.width = '0%';
      scoreText.innerText = '0%';
      
      const chips = kwListEl.querySelectorAll('.kw-chip');
      chips.forEach(c => c.className = 'kw-chip pending');

      setTimeout(() => {
        let matches = 0;
        let total = keywordSets[selectedRole].length;
        let missingKWs = [];
        
        chips.forEach(chip => {
          const kw = chip.innerText.toLowerCase();
          if (text.includes(kw)) {
            chip.className = 'kw-chip found';
            matches++;
          } else {
            chip.className = 'kw-chip missing';
            missingKWs.push(chip.innerText);
          }
        });
        
        const score = Math.round((matches / total) * 100);
        meterFill.style.width = score + '%';
        scoreText.innerText = score + '%';
        
        let meterColor = '#ef4444';
        if (score >= 50) meterColor = '#eab308';
        if (score >= 80) meterColor = '#10b981';
        meterFill.style.background = meterColor;
        
        const escapedPrompt = `Persona: Act as an expert executive resume writer specializing in AI industry hiring and ATS optimization. \\n\\nTask: Rewrite my current resume bullet points so they organically and professionally include the specific missing keywords required to pass the automated ATS screening for this role. \\n\\nMissing Keywords to Add:\\n${missingKWs.join(', ')}\\n\\nCRITICAL REQUIREMENT: You MUST include every single one of the missing keywords EXACTLY as they are written above. Do not change the tense, do not use synonyms, and do not abbreviate them. Real ATS scanners require exact matches.`.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        if (!window.startAITimer) {
          window.startAITimer = function(btn) {
            navigator.clipboard.writeText(btn.getAttribute('data-prompt'));
            
            if (btn.innerText.includes('Copied')) {
              btn.innerText = 'Copied again! ✅';
              setTimeout(() => {
                if (btn.innerText === 'Copied again! ✅') {
                  btn.innerText = 'Copied! You have 5 minutes ➔';
                }
              }, 1000);
            } else {
              btn.innerText = 'Copied! You have 5 minutes ➔';
            }
            btn.style.color = '#10b981';
            
            const helperText = document.getElementById('ai-helper-text');
            helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ ACTION REQUIRED:</span> Open ChatGPT or your preferred AI now, paste the prompt, and return here in the next <span id="countdown-timer" style="font-weight:800; font-family:monospace; background:#fee2e2; color:#ef4444; padding:2px 4px; border-radius:4px;">05:00</span> minutes to rescan your resume. Let\\'s get you hired!';
            
            let timeLeft = 300; // 5 minutes
            if(window.activeAITimer) clearInterval(window.activeAITimer);
            
            window.activeAITimer = setInterval(() => {
              timeLeft--;
              const timerEl = document.getElementById('countdown-timer');
              if(timerEl) {
                const m = Math.floor(timeLeft / 60);
                const s = timeLeft % 60;
                timerEl.innerText = `0${m}:${s < 10 ? '0' : ''}${s}`;
              }
              
              if (timeLeft <= 0) {
                clearInterval(window.activeAITimer);
                if(timerEl) {
                  helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ Time is up!</span> You\\'ve got this. Paste your new AI-upgraded resume into the box above and hit Scan to verify it passes. Let\\'s get you hired!';
                  btn.innerText = 'Generate New Prompt 🪄';
                  btn.style.color = 'white';
                }
              }
            }, 1000);
          };
        }
        
        const nudgeCTA = `
          <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(0,0,0,0.1);">
            <p style="font-size:13px; color:var(--gray-600); margin-bottom:8px;">Want AI to fix it for you?</p>
            <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--primary); color:white; border:none; padding:8px 12px; border-radius:4px; font-weight:700; font-size:13px; cursor:pointer; font-family:inherit; transition:background 0.2s;">
              Copy Custom AI Prompt 🪄
            </button>
            <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin-top:8px; line-height:1.4;">
              <em>After copying, open ChatGPT, Claude, or Gemini and paste the prompt. It will automatically rewrite your resume to include the missing keywords!</em>
            </p>
          </div>
        `;
        
        if (score < 50) {
           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords. The automated scanner is highly likely to reject this. Please add the missing keywords highlighted above into your bullet points organically.</p> ${nudgeCTA}`;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 80) {
           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a decent foundation, but you are still missing some key terms. To guarantee your resume is flagged for review, try to incorporate a few more of the gray keywords.</p> ${nudgeCTA}`;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>';
           applyBtn.className = 'btn-apply ready';
           applyBtn.innerText = 'Pass: Submit Resume to Mercor Now';
           applyBtn.onclick = function() { window.location.href = 'apply.html'; };
        } else {
           feedbackBox.innerHTML = '<h4>Flawless 100% Match! 🏆</h4><p>Great job! Your resume is absolutely perfect. It is guaranteed to pass the ATS screening. Let\\'s move you along the pipeline to prepare for the AI Interview!</p>';
           applyBtn.className = 'btn-apply ready';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = function() { window.location.href = 'prep-hub.html'; };
        }
        
        scanBtn.innerText = 'Scan Again';
        
      }, 1200);
    });
  });
"""

# Replace the giant hardcoded block with the dynamic one
# We find the start of the `<script>` containing `const jobDescriptions = {`
start_tag = '<script>\n  const jobDescriptions = {'
# We find the end of the script tag
end_tag = '    }, 1200);\n  });\n</script>'

if start_tag in html and end_tag in html:
    start_idx = html.find('<script>\n  const jobDescriptions = {')
    end_idx = html.find('</script>', start_idx) + 9
    
    new_html = html[:start_idx] + '<script>\n' + new_script + '\n</script>' + html[end_idx:]
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("ATS Scanner successfully synced to waves.json!")
else:
    print("Could not find the script block to replace.")
