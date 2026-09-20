import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add global trackers
html = html.replace("  let currentDomain = \"software\";", "  let totalScore = 0;\n  let totalFillers = 0;\n  let totalQuestionsAnswered = 0;\n  let currentDomain = \"software\";")

# 2. Update trackers in processAnswer
find_score = """      const cappedScore = Math.min(100, Math.max(10, confScore));"""
replace_score = """      const cappedScore = Math.min(100, Math.max(10, confScore));
      totalScore += cappedScore;
      totalFillers += fillerCount;
      totalQuestionsAnswered++;"""
html = html.replace(find_score, replace_score)

# 3. Create the massive Final Results UI overlay at the end
find_next = """    if (currentQ + 1 >= currentQuestions.length) {
      setUIState('feedback', 'Module Complete! You have finished the Voice Evaluator Simulator.');
      simStatus.innerText = 'Module Complete 🏆';
      
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      
      // Prevent duplicate proceed buttons if they somehow click next rapidly
      if (!document.getElementById('proceed-btn')) {
        const proceedBtn = document.createElement('a');
        proceedBtn.id = 'proceed-btn';
        proceedBtn.href = 'post-hire.html';
        proceedBtn.className = 'btn-sim';
        proceedBtn.style.marginTop = '24px';
        proceedBtn.innerHTML = 'Next Step: Post-Hire Guide ➔';
        document.querySelector('.sim-container').appendChild(proceedBtn);
      }"""
replace_next = """    if (currentQ + 1 >= currentQuestions.length) {
      setUIState('feedback', 'Module Complete');
      userTranscript.style.display = 'none';
      nextBtn.style.display = 'none';
      
      const avgScore = totalQuestionsAnswered > 0 ? Math.round(totalScore / totalQuestionsAnswered) : 0;
      let passChance = 'Low (<20%)';
      let passColor = '#ef4444';
      if (avgScore >= 80) { passChance = 'High (85%+)'; passColor = '#10b981'; }
      else if (avgScore >= 50) { passChance = 'Moderate (50%)'; passColor = '#eab308'; }
      
      let improvement = "Your delivery is crisp. Focus on projecting confidence and maintaining this pacing.";
      if (totalFillers > 2) {
          improvement = "You use too many filler words ('um', 'like', 'uh'). Practice speaking slower and embracing silent pauses to sound more authoritative.";
      } else if (avgScore < 80) {
          improvement = "You need to incorporate more domain-specific keywords into your answers. The AI relies heavily on vocabulary density to score you.";
      }
      
      const summaryHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:50; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px; text-align:center; box-sizing:border-box;">
            <h2 style="color:white; font-size:32px; margin-bottom:24px; font-weight:800;">Interview Complete 🏆</h2>
            <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:24px; width:100%; max-width:500px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                <div style="font-size:12px; color:#aaa; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Predicted Pass Probability</div>
                <div style="font-size:42px; font-weight:800; color:${passColor}; margin-bottom:24px;">${passChance}</div>
                
                <div style="display:flex; justify-content:space-between; margin-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:24px;">
                    <div style="flex:1; border-right:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:11px; color:#aaa; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Avg Confidence Score</div>
                        <div style="font-size:24px; color:white; font-weight:700;">${avgScore}%</div>
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:11px; color:#aaa; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Total Filler Words</div>
                        <div style="font-size:24px; color:white; font-weight:700;">${totalFillers}</div>
                    </div>
                </div>
                
                <div style="font-size:12px; color:var(--primary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Priority Action Plan</div>
                <div style="font-size:16px; color:#eee; line-height:1.5;">${improvement}</div>
            </div>
            
            <a href="post-hire.html" class="btn-sim" style="margin-top:32px; text-decoration:none;">Next Step: Post-Hire Guide ➔</a>
        </div>
      `;
      
      const vContainer = document.querySelector('.video-container');
      vContainer.insertAdjacentHTML('beforeend', summaryHTML);
      
      // Stop the camera feed to save battery now that we're done
      const cam = document.getElementById('user-camera');
      if (cam && cam.srcObject) {
          cam.srcObject.getTracks().forEach(t => t.stop());
      }"""
html = html.replace(find_next, replace_next)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Injected final interview stats")
