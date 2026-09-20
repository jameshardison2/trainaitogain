import re

# 1. Update resume-ats-guide.html to save context
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

html_find = """        const score = total > 0 ? Math.round((matches / total) * 100) : 0;"""
html_replace = """        const score = total > 0 ? Math.round((matches / total) * 100) : 0;
        
        // Save to localStorage for the Guide Assistant to use
        localStorage.setItem('atsScore', score);
        localStorage.setItem('atsRole', selectedRole);
        localStorage.setItem('atsMissing', missingKWs.join(', '));"""

if html_find in html:
    html = html.replace(html_find, html_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated resume-ats-guide.html to save context.")
else:
    print("Could not find HTML block.")


# 2. Update chat.js to inject context into the prompt
with open('chat.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_find = """            parts: [{
              text: "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline, helping candidates get hired at Mercor. The user asks: " + text + ". Answer in 1 to 3 short sentences. Be helpful and natural. Do not be overly robotic."
            }]"""

js_replace = """            parts: [{
              text: (function() {
                let context = "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline, helping candidates get hired at Mercor. ";
                const score = localStorage.getItem('atsScore');
                const role = localStorage.getItem('atsRole');
                const missing = localStorage.getItem('atsMissing');
                if (score) {
                   context += `Context: The candidate just used the ATS Scanner. Their target role is '${role}'. They scored ${score}%. They are missing the following keywords: ${missing}. If they ask for help with their resume, give them highly specific tactical advice on how to naturally incorporate these missing keywords into their work experience bullets. `;
                } else {
                   context += "The candidate has not scanned their resume yet. If they ask about resumes, tell them to use the Live ATS Scanner on the left. ";
                }
                context += "The user asks: " + text + ". Answer in 1 to 3 short sentences. Be helpful, specific, and natural. Do not be overly robotic.";
                return context;
              })()
            }]"""

if js_find in js:
    js = js.replace(js_find, js_replace)
    with open('chat.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated chat.js to inject context!")
else:
    print("Could not find JS block.")

