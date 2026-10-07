const fs = require('fs');
let code = fs.readFileSync('ai-interview.html', 'utf8');

// 1. STAR+ Rubric & Subtext Update
const oldButtonArea = `<button class="btn-sim" id="start-btn">
        <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
        Start Voice Interview
      </button>
      <p style="font-size: 12px; color: #666; margin-top: 16px;">(Requires Microphone Permission on Chrome/Safari)</p>`;

const newButtonArea = `<!-- STAR+ Rubric Cheat Sheet -->
      <details style="max-width:600px; margin: 0 auto 24px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:8px; text-align:left; overflow:hidden;">
        <summary style="padding:16px 20px; font-weight:800; font-size:15px; color:var(--white); cursor:pointer; list-style:none; display:flex; justify-content:space-between; align-items:center; outline:none;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
          <span>📋 View STAR+ Interview Rubric</span>
          <span style="color:var(--primary); font-size:18px; font-weight:400;">+</span>
        </summary>
        <div style="padding:0 20px 20px 20px; border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#aaa; font-size:13px; margin-bottom:16px; margin-top:16px;">The AI grades you strictly on this structure. Keep answers under 60 seconds.</p>
          <div style="margin-bottom:10px; line-height:1.4;"><strong style="color:var(--primary);">Situation (10s):</strong> <span style="color:#ddd; font-size:13px;">"In my previous role, we faced a major issue with [Bottleneck]."</span></div>
          <div style="margin-bottom:10px; line-height:1.4;"><strong style="color:var(--primary);">Task (10s):</strong> <span style="color:#ddd; font-size:13px;">"My specific objective was to [Goal] within a strict deadline."</span></div>
          <div style="margin-bottom:10px; line-height:1.4;"><strong style="color:var(--primary);">Action (30s):</strong> <span style="color:#ddd; font-size:13px;">"I spearheaded [Action] using [Key Technical Skill]."</span></div>
          <div style="margin-bottom:10px; line-height:1.4;"><strong style="color:var(--primary);">Result (10s):</strong> <span style="color:#ddd; font-size:13px;">"As a result, we successfully [Quantifiable Metric / % Improvement]."</span></div>
          <div style="line-height:1.4;"><strong style="color:var(--primary);">Plus (10s):</strong> <span style="color:#ddd; font-size:13px;">"This taught me [Takeaway] which I bring to this role."</span></div>
        </div>
      </details>

      <button class="btn-sim" id="start-btn">
        <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
        Start Voice Interview
      </button>
      
      <!-- Pre-Interview Reassurance Subtext -->
      <p style="font-size: 14px; color: #ccc; margin-top: 16px; font-weight:700;">Takes 2 minutes • Real-time AI scoring breakdown after your response</p>
      <p style="font-size: 11px; color: #666; margin-top: 4px;">(Requires Microphone Permission on Chrome/Safari)</p>`;

code = code.replace(oldButtonArea, newButtonArea);

// 2. Curate & Streamline Voice Dropdown
const oldVoiceLogic = `      if (voiceInterval) clearInterval(voiceInterval);
      
      // Only rebuild if we haven't already
      if (availableVoices.length === voices.length) return;
      
      availableVoices = voices;
      
      if (voiceSelect) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              option.textContent = v.name + " (" + (v.lang) + ")";
              option.value = i;
              
              if (v.name === 'Google US English' || v.name === 'Ava' || v.name === 'Allison' || v.name === 'Samantha') {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }`;

const newVoiceLogic = `      if (voiceInterval) clearInterval(voiceInterval);
      
      // Filter for clean, premium human-sounding voices
      const premiumNames = ['Samantha', 'Ava', 'Allison', 'Susan', 'Alex', 'Tom', 'Daniel', 'Serena', 'Google US English', 'Google UK English Female', 'Google UK English Male', 'Microsoft Aria', 'Microsoft Guy'];
      let filteredVoices = voices.filter(v => v.lang.startsWith('en') && premiumNames.some(p => v.name.includes(p)));
      
      // Fallback if none of the premiums are found (e.g. Linux or custom browser)
      if(filteredVoices.length === 0) {
          filteredVoices = voices.filter(v => v.lang.startsWith('en') && !v.name.includes('Bells') && !v.name.includes('Bad News') && !v.name.includes('Boing') && !v.name.includes('Cellos')).slice(0, 5);
      }
      
      // Enforce max 5 choices to prevent choice fatigue
      filteredVoices = filteredVoices.slice(0, 5);
      
      // If we already have the exact same list, skip redraw
      if (availableVoices.length === filteredVoices.length && availableVoices.every((v,i) => v.name === filteredVoices[i].name)) return;
      
      availableVoices = filteredVoices;
      
      if (voiceSelect) {
          voiceSelect.innerHTML = '';
          availableVoices.forEach((v, i) => {
              const option = document.createElement('option');
              // Clean up the name for the UI (remove "Online (Natural) - English (United States)", etc)
              let cleanName = v.name.replace(/ Online \\(Natural\\).*| \\(en-[A-Z]+\\)/g, '').trim();
              option.textContent = cleanName;
              
              // We need to map the value back to the ORIGINAL voice array index so the synth engine finds it
              const originalIndex = voices.indexOf(v);
              option.value = originalIndex;
              
              if (cleanName.includes('Google US English') || cleanName.includes('Ava') || cleanName.includes('Samantha') || i === 0) {
                  option.selected = true;
              }
              
              voiceSelect.appendChild(option);
          });
      }`;

code = code.replace(oldVoiceLogic, newVoiceLogic);

// Write changes
fs.writeFileSync('ai-interview.html', code);
console.log("ai-interview.html updated successfully!");
