const fs = require('fs');
let code = fs.readFileSync('ai-interview.html', 'utf8');

const oldFeedbackLogic = `      setUIState('feedback', 'Feedback generated. Check the AI Copilot panel.');
      document.getElementById('copilot-feedback-container').style.display = 'block';
      
      const stratBox = document.getElementById('copilot-strategy');
      stratBox.innerText = finalFeedback;
      if (cappedScore >= 80) {
          stratBox.style.background = 'rgba(16,185,129,0.1)';
          stratBox.style.borderLeftColor = 'var(--primary)';
      } else {
          stratBox.style.background = 'rgba(239,68,68,0.1)';
          stratBox.style.borderLeftColor = '#ef4444';
      }`;

const newFeedbackLogic = `      setUIState('feedback', 'Feedback generated. Check the AI Copilot panel.');
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
      
      // TRIGGER THE NEW INSTANT SCORECARD MODAL
      const modal = document.getElementById('scorecard-modal');
      if(modal) {
          document.getElementById('modal-conf-score').innerText = cappedScore + "%";
          document.getElementById('modal-conf-score').style.color = (cappedScore >= 80) ? 'var(--primary)' : (cappedScore >= 50 ? '#eab308' : '#ef4444');
          
          document.getElementById('modal-filler-score').innerText = fillerCount + (fillerCount > 0 ? " (e.g. um, like)" : "");
          document.getElementById('modal-filler-score').style.color = (fillerCount === 0) ? 'var(--primary)' : '#ef4444';
          
          document.getElementById('modal-star-score').innerText = starMatches > 0 ? "Pass ✅" : "Fail ❌";
          document.getElementById('modal-star-score').style.color = starMatches > 0 ? 'var(--primary)' : '#ef4444';
          
          document.getElementById('modal-transcript').innerText = transcript;
          document.getElementById('modal-ideal').innerText = qData.answer || ("Try mentioning: " + qData.keywords.join(', '));
          
          document.getElementById('modal-ai-feedback').innerHTML = finalFeedback.replace(/\\n/g, '<br>');
          
          modal.style.display = 'flex';
          
          // Wire up the modal Next Question button to trigger the existing flow
          document.getElementById('modal-next-btn').onclick = () => {
              modal.style.display = 'none';
              document.getElementById('next-btn').click();
          };
          
          // Wire up the Drill Deeper follow up
          document.getElementById('modal-drill-btn').onclick = () => {
              modal.style.display = 'none';
              const followUpQ = {
                  q: "Follow up on that: Defend your architectural decisions. What edge cases did you ignore, and how would this system fail under 10x load?",
                  keywords: ["scale", "bottleneck", "load", "latency", "architecture", "tradeoff", "failure", "cache", "rate limiting"],
                  answer: "When scaling to 10x, the primary bottleneck would shift to the database layer. I intentionally traded off immediate consistency for high availability using a caching layer. To mitigate complete failure, I would implement circuit breakers and rate limiting.",
                  feedbackHit: "Excellent defense. You acknowledged trade-offs and demonstrated senior-level systems thinking.",
                  feedbackMiss: "You failed to identify the architectural limits. Senior engineers always know how their systems break."
              };
              currentQuestions.splice(currentQ + 1, 0, followUpQ);
              document.getElementById('next-btn').click();
          };
      }`;

code = code.replace(oldFeedbackLogic, newFeedbackLogic);
fs.writeFileSync('ai-interview.html', code);
console.log("processAnswer logic updated.");
