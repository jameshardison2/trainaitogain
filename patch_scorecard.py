import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# Replace blue accents in scorecard with amber (--accent)
# In the Confidence Level block: background:#3b82f6; -> background:var(--accent);
content = content.replace('<div style="position:absolute; top:0; left:0; width:4px; height:100%; background:#3b82f6;"></div>', '<div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--accent);"></div>')
# Also the modal-conf-score color logic in analyzeResponse:
# document.getElementById('modal-conf-score').style.color = (cappedScore >= 80) ? 'var(--primary)' : (cappedScore >= 50 ? '#eab308' : '#ef4444');
# Change the yellow to var(--accent)
content = content.replace("(cappedScore >= 50 ? '#eab308' : '#ef4444');", "(cappedScore >= 50 ? 'var(--accent)' : '#ef4444');")

# Also add the gtag function right before analyzeResponse or inside the script block
gtag_func = """
    // Track Mock Interview Question Completion & Scorecard View
    function trackInterviewScore(score, status) {
      if (typeof gtag === 'function') {
        gtag('event', 'mock_interview_completed', {
          'event_category': 'AI Interview',
          'score_percentage': score,
          'pass_fail_status': status,
          'value': 1
        });
      }
    }
"""
if "function trackInterviewScore" not in content:
    content = content.replace("function analyzeResponse", gtag_func + "\n    function analyzeResponse")

# Call the gtag function when the modal is shown
# document.getElementById('modal-star-score').style.color = starMatches > 0 ? 'var(--primary)' : '#ef4444';
gtag_trigger = """          document.getElementById('modal-star-score').style.color = starMatches > 0 ? 'var(--primary)' : '#ef4444';
          
          trackInterviewScore(cappedScore, starMatches > 0 ? 'Pass' : 'Fail');"""
content = content.replace("          document.getElementById('modal-star-score').style.color = starMatches > 0 ? 'var(--primary)' : '#ef4444';", gtag_trigger)

with open('ai-interview.html', 'w') as f:
    f.write(content)
