import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the static Cheat Sheet with a Dynamic Copilot Panel
find_sidebar = """  <!-- Cheat Sheet Sidebar -->
  <div class="cheat-sheet">
    <h3>Masterclass Rules</h3>
    <ul>
      <li><strong>The "Headline First" Rule:</strong> AI labs want direct answers. Never start with "Well, I think..." Start with your core thesis immediately.</li>
      <li><strong>No Empty Jargon:</strong> Anyone can say "Attention Mechanism." You need to be able to explain <em>why</em> it matters in one simple sentence.</li>
      <li><strong>RLHF Formatting:</strong> Always assume the AI model will hallucinate. Emphasize how you structurally constrain prompts to guarantee formatting.</li>
      <li><strong>Conciseness is King:</strong> Stop rambling. If you can't explain it in 60 seconds out loud, you don't know it well enough.</li>
    </ul>
  </div>"""

replace_sidebar = """  <!-- Dynamic Live Copilot Panel -->
  <div class="cheat-sheet" id="copilot-panel" style="display:flex; flex-direction:column; position:relative; overflow:hidden;">
    <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, transparent, var(--primary), transparent); animation: scanline 2s infinite linear; display:none;" id="copilot-scanline"></div>
    <h3 style="margin-bottom:16px;">
        <span style="display:inline-block; width:12px; height:12px; background:var(--primary); border-radius:50%; margin-right:8px; box-shadow:0 0 10px var(--primary); animation:pulse 2s infinite;"></span>
        Live AI Copilot
    </h3>
    <p style="font-size:13px; color:#888; margin-bottom:24px; line-height:1.5;" id="copilot-status">Waiting for interviewer to speak...</p>
    
    <div id="copilot-content" style="display:none; flex-grow:1;">
        <div style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Suggested Strategy</div>
        <div id="copilot-strategy" style="font-size:14px; color:var(--white); background:rgba(16,185,129,0.1); border-left:3px solid var(--primary); padding:12px; border-radius:4px; margin-bottom:24px; line-height:1.5;"></div>
        
        <div style="font-size:12px; font-weight:700; color:var(--gray-400); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Keywords to Hit</div>
        <div id="copilot-keywords" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
    </div>
  </div>
  <style>
    @keyframes scanline { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
    .kw-tag { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:12px; color:#ccc; transition:all 0.2s; }
    .kw-tag.hit { background:rgba(16,185,129,0.2); border-color:var(--primary); color:var(--white); font-weight:700; }
  </style>"""

html = html.replace(find_sidebar, replace_sidebar)

# Now inject the JS to populate the Copilot!
find_js = "simStatus.innerText = 'Listening to you...';"
replace_js = """simStatus.innerText = 'Listening to you...';
      document.getElementById('copilot-status').innerText = "Analyzing question and generating real-time suggestions...";
      document.getElementById('copilot-scanline').style.display = 'block';
      setTimeout(() => {
          document.getElementById('copilot-status').style.display = 'none';
          document.getElementById('copilot-scanline').style.display = 'none';
          document.getElementById('copilot-content').style.display = 'block';
          document.getElementById('copilot-strategy').innerText = currentQuestions[currentQ].feedbackHit;
          
          const kwBox = document.getElementById('copilot-keywords');
          kwBox.innerHTML = '';
          currentQuestions[currentQ].keywords.forEach(kw => {
              const tag = document.createElement('span');
              tag.className = 'kw-tag kw-' + kw.replace(/\\s+/g, '-');
              tag.innerText = kw;
              kwBox.appendChild(tag);
          });
      }, 800); // Simulate processing time"""

html = html.replace(find_js, replace_js)

# And update the JS for when they are speaking to highlight keywords they hit!
find_kw_match = """      qData.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) matches++;
      });"""
replace_kw_match = """      qData.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) {
            matches++;
            // Highlight in Copilot
            const tag = document.querySelector('.kw-' + kw.replace(/\\s+/g, '-'));
            if(tag) tag.classList.add('hit');
        }
      });"""

# Wait, the speech recognition is real-time, so we should highlight them as they talk!
find_onresult = """        userTranscript.innerText = finalTranscript + interim;
      };"""
replace_onresult = """        userTranscript.innerText = finalTranscript + interim;
        
        // Real-time copilot keyword highlighting
        const liveText = (finalTranscript + interim).toLowerCase();
        currentQuestions[currentQ].keywords.forEach(kw => {
            if (liveText.includes(kw.toLowerCase())) {
                const tag = document.querySelector('.kw-' + kw.replace(/\\s+/g, '-'));
                if(tag) tag.classList.add('hit');
            }
        });
      };"""

html = html.replace(find_onresult, replace_onresult)

# Reset Copilot on start
find_ask = "const qText = currentQuestions[currentQ].q;"
replace_ask = """const qText = currentQuestions[currentQ].q;
    document.getElementById('copilot-content').style.display = 'none';
    document.getElementById('copilot-status').style.display = 'block';
    document.getElementById('copilot-status').innerText = "Listening to interviewer...";"""

html = html.replace(find_ask, replace_ask)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Copilot UI added to ai-interview.html")
