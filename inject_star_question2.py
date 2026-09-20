import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_start = """    currentDomain = domainSelector.value;
    currentQuestions = domainData[currentDomain];
    currentQ = 0;"""

replace_start = """    currentDomain = domainSelector.value;
    currentQuestions = [...domainData[currentDomain]]; // Clone array so we don't mutate the global one multiple times
    
    // Resume STAR Method Injection
    const candidateResume = localStorage.getItem('candidateResumeText');
    if (candidateResume) {
        let foundSkill = 'your previous technical projects';
        const commonSkills = ['Python', 'JavaScript', 'React', 'AWS', 'SQL', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Java', 'C++', 'Marketing', 'Finance'];
        for (const skill of commonSkills) {
            if (candidateResume.toLowerCase().includes(skill.toLowerCase())) {
                foundSkill = skill;
                break;
            }
        }
        
        const starQuestion = {
            q: `I parsed your resume from step 1, and I noticed you have experience with ${foundSkill}. Using the STAR method, can walk me through a specific challenge you overcame using this?`,
            answer: "Situation: I was tasked with a critical project. Task: The deadline was extremely tight. Action: I implemented a new framework to accelerate development. Result: We delivered on time and exceeded performance metrics by 20%.",
            keywords: ["situation", "task", "action", "result", "metric", "deliver"],
            feedbackMiss: "You didn't structure your answer using the STAR method. AI interviewers strictly parse behavioral answers looking for a clear Situation, Task, Action, and quantifiable Result.",
            feedbackHit: "Excellent response. Using the strict STAR framework and including quantifiable metrics makes your experience highly scorable for the AI evaluator."
        };
        
        currentQuestions.unshift(starQuestion); // Inject as the very first question!
    }
    
    currentQ = 0;"""

if find_start in html:
    html = html.replace(find_start, replace_start)
else:
    print("Warning: Could not find currentQuestions init")

html = html.replace('<!-- CACHE BUST 20', '<!-- CACHE BUST 21')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected dynamic STAR resume question successfully")
