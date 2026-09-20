import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the video layout (opacity 1, wider)
html = html.replace('max-width:600px; aspect-ratio:16/9; background:#000; border-radius:12px; margin:0 auto 24px auto; overflow:hidden; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 40px rgba(0,0,0,0.5);', 'max-width:800px; aspect-ratio:16/9; background:#000; border-radius:12px; margin:0 auto 24px auto; overflow:hidden; border:1px solid rgba(255,255,255,0.1); box-shadow:0 20px 40px rgba(0,0,0,0.5);')
html = html.replace('opacity:0.6;', 'opacity:1;')

# 2. Fix the sim-status-box so it acts like a small subtitle bar
html = html.replace('background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); border-radius:8px; padding:16px; border:1px solid rgba(255,255,255,0.1); text-align:center;', 'background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); border-radius:8px; padding:12px; border:1px solid rgba(255,255,255,0.1); text-align:center; max-width:80%; margin:0 auto;')
html = html.replace('font-size:18px; min-height:50px; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);', 'font-size:16px; min-height:24px; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);')

# 3. Change Copilot "Suggested Strategy" to "Coaching Feedback" and hide it initially
find_copilot = """        <div style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Suggested Strategy</div>
        <div id="copilot-strategy" style="font-size:14px; color:var(--white); background:rgba(16,185,129,0.1); border-left:3px solid var(--primary); padding:12px; border-radius:4px; margin-bottom:24px; line-height:1.5;"></div>"""
replace_copilot = """        <div id="copilot-feedback-container" style="display:none;">
            <div style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Coaching Feedback</div>
            <div id="copilot-strategy" style="font-size:14px; color:var(--white); background:rgba(16,185,129,0.1); border-left:3px solid var(--primary); padding:12px; border-radius:4px; margin-bottom:24px; line-height:1.5;"></div>
        </div>"""
html = html.replace(find_copilot, replace_copilot)

# 4. Mute the robotic voice completely
html = html.replace('utterance.pitch = 1.1; // Slightly higher pitch for female voice', 'utterance.pitch = 1.1;\n    utterance.volume = 0; // Mute robotic voice, acts as timer')

# 5. Fix JS logic for showing feedback and keywords
find_copilot_js = """          document.getElementById('copilot-content').style.display = 'block';
          document.getElementById('copilot-strategy').innerText = currentQuestions[currentQ].feedbackHit;"""
replace_copilot_js = """          document.getElementById('copilot-content').style.display = 'block';
          document.getElementById('copilot-feedback-container').style.display = 'none';"""
html = html.replace(find_copilot_js, replace_copilot_js)

find_feedback_js = """      const finalFeedback = feedback + ` (Confidence Score: ${cappedScore}%. Filler words detected: ${fillerCount})`;
      
      setUIState('feedback', finalFeedback);"""
replace_feedback_js = """      const finalFeedback = feedback + `\\n\\n(Confidence Score: ${cappedScore}%. Filler words detected: ${fillerCount})`;
      
      setUIState('feedback', 'Feedback generated. Check the AI Copilot panel.');
      document.getElementById('copilot-feedback-container').style.display = 'block';
      
      const stratBox = document.getElementById('copilot-strategy');
      stratBox.innerText = finalFeedback;
      if (cappedScore >= 80) {
          stratBox.style.background = 'rgba(16,185,129,0.1)';
          stratBox.style.borderLeftColor = 'var(--primary)';
      } else {
          stratBox.style.background = 'rgba(239,68,68,0.1)';
          stratBox.style.borderLeftColor = '#ef4444';
      }
"""
html = html.replace(find_feedback_js, replace_feedback_js)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied UI and voice fixes")
