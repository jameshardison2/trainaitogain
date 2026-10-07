import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Define trackInterviewScore
tracker_func = """
<script>
// Fix for Uncaught ReferenceError: trackInterviewScore is not defined
window.trackInterviewScore = function(score, status) {
    try {
        console.log("Tracking interview score:", score, status);
        let pastScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        pastScores.push({ score: score, status: status, date: new Date().toISOString() });
        localStorage.setItem('interviewScores', JSON.stringify(pastScores));
        if (typeof gtag === 'function') {
            gtag('event', 'interview_scored', { score_value: score, star_status: status });
        }
    } catch(e) {
        console.error("Error tracking score", e);
    }
};
"""
content = content.replace("<script>", tracker_func, 1)

# 2. Fix the real-time keyword highlighting display
old_listening_state = "      setUIState('listening', 'Waiting for your answer...');\n      let finalTranscript = '';"
new_listening_state = """      setUIState('listening', 'Waiting for your answer...');
      
      // FIX: Activate the Blueprint dynamic keyword highlighting during speech!
      document.getElementById('copilot-status').style.display = 'none';
      document.getElementById('copilot-content').style.display = 'flex';
      document.getElementById('copilot-content').style.flexDirection = 'column';
      document.getElementById('copilot-feedback-container').style.display = 'none';
      
      const kwBox = document.getElementById('copilot-keywords');
      kwBox.innerHTML = '';
      currentQuestions[currentQ].keywords.forEach(kw => {
          const s = document.createElement('span');
          s.className = 'kw-tag kw-' + kw.replace(/\\s+/g, '-');
          s.innerText = kw;
          kwBox.appendChild(s);
      });
      
      let finalTranscript = '';"""

content = content.replace(old_listening_state, new_listening_state)

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("ai-interview patched with trackInterviewScore and keyword highlighting")
