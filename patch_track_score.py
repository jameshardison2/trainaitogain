import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

old_tracker = """window.trackInterviewScore = function(score, status) {
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
};"""

new_tracker = """window.trackInterviewScore = function(score, status, fillers, isOverall = false, passProbability = '') {
    try {
        console.log("Tracking interview metrics:", { score, status, fillers, isOverall, passProbability });
        let pastScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        pastScores.push({ 
            score: score, 
            status: status, 
            fillers: fillers || 0,
            isOverall: isOverall,
            passProbability: passProbability,
            date: new Date().toISOString() 
        });
        localStorage.setItem('interviewScores', JSON.stringify(pastScores));
        if (typeof gtag === 'function') {
            gtag('event', isOverall ? 'interview_module_complete' : 'interview_scored', { 
                score_value: score, 
                star_status: status,
                fillers: fillers || 0,
                pass_probability: passProbability
            });
        }
    } catch(e) {
        console.error("Error tracking score", e);
    }
};"""

content = content.replace(old_tracker, new_tracker)

old_track_call = "trackInterviewScore(cappedScore, starMatches > 0 ? 'Pass' : 'Fail');"
new_track_call = "trackInterviewScore(cappedScore, starMatches > 0 ? 'Pass' : 'Fail', fillerCount);"
content = content.replace(old_track_call, new_track_call)

# Add the final tracking hook in the NextBtn click handler when the module completes
old_end_tracking = """      else if (avgScore >= 50) { passChance = 'Moderate (50%)'; passColor = '#eab308'; }
      
      let improvement = "Your delivery is crisp. Focus on projecting confidence and maintaining this pacing.";"""

new_end_tracking = """      else if (avgScore >= 50) { passChance = 'Moderate (50%)'; passColor = '#eab308'; }
      
      // Hook: Analytics tracker for post-interview transition state
      if (typeof window.trackInterviewScore === 'function') {
          window.trackInterviewScore(avgScore, passChance, totalFillers, true, passChance);
      }
      
      let improvement = "Your delivery is crisp. Focus on projecting confidence and maintaining this pacing.";"""

content = content.replace(old_end_tracking, new_end_tracking)

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("ai-interview patched with enhanced trackInterviewScore")
