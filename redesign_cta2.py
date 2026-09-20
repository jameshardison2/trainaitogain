import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We just need to replace the entire if(score < 50) block with the new one.
pattern = re.compile(r'if \(score < 50\) \{.*?\}\n', re.DOTALL)

replacement = """const fixContainer = document.getElementById('ai-fix-container');
        if (score < 50) {
           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords. The automated scanner is highly likely to reject this. Please add the missing keywords highlighted above into your bullet points organically.</p>`;
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 80) {
           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the candidate pool.</p>`;
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply';
           applyBtn.innerText = 'You must score 80%+ to Apply';
        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>';
           fixContainer.innerHTML = nudgeCTA;
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        } else {
           feedbackBox.innerHTML = '<h4>Flawless 100% Match! 🏆</h4><p>Great job! Your resume is absolutely perfect. It is guaranteed to pass the ATS screening. Let\\'s move you along the pipeline to prepare for the AI Interview!</p>';
           fixContainer.innerHTML = '';
           applyBtn.className = 'btn-apply pass';
           applyBtn.innerText = 'Next Step: AI Interview Prep ➔';
           applyBtn.onclick = () => window.location.href='prep-hub.html';
        }\n"""

new_html, count = pattern.subn(replacement, html)

if count > 0:
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Updated if block {count} times!")
else:
    print("Could not find if block with regex.")

