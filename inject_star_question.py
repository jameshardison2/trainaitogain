import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_start = """  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('active-view').style.display = 'block';
    
    currentQ = 0;"""

replace_start = """  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('active-view').style.display = 'block';
    
    // Check if we parsed a resume in Step 1
    const candidateResume = localStorage.getItem('candidateResumeText');
    if (candidateResume && currentDomain) {
        let foundSkill = 'your past technical projects';
        const commonSkills = ['Python', 'JavaScript', 'React', 'AWS', 'SQL', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Java', 'C++', 'Marketing', 'Finance'];
        for (const skill of commonSkills) {
            if (candidateResume.toLowerCase().includes(skill.toLowerCase())) {
                foundSkill = skill;
                break;
            }
        }
        
        const starQuestion = {
            q: `I parsed your resume from step 1, and I noticed you have experience with ${foundSkill}. Using the STAR method, can you walk me through a specific challenge you overcame using this?`,
            answer: "Situation: I was tasked with a critical project. Task: The deadline was extremely tight. Action: I implemented a new framework to accelerate development. Result: We delivered on time and exceeded performance metrics by 20%.",
            keywords: ["situation", "task", "action", "result", "metric", "deliver"],
            feedbackMiss: "You didn't structure your answer using the STAR method. AI interviewers strictly parse behavioral answers looking for a clear Situation, Task, Action, and quantifiable Result.",
            feedbackHit: "Excellent response. Using the strict STAR framework and including quantifiable metrics makes your experience highly scorable for the AI evaluator."
        };
        
        // Ensure we don't accidentally duplicate it if they click start multiple times in a weird state
        if (currentQuestions[0].q.indexOf("parsed your resume") === -1) {
            currentQuestions = [starQuestion, ...domainData[currentDomain]];
        }
    }
    
    currentQ = 0;"""

if find_start in html:
    html = html.replace(find_start, replace_start)
else:
    print("Warning: Could not find start-btn listener")

html = html.replace('<!-- CACHE BUST 19', '<!-- CACHE BUST 20')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected dynamic STAR resume question")
