import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_logic = """    const domainNames = {
        "software": "Software Engineering",
        "medical": "Medical and Clinical",
        "finance": "Finance and Quantitative"
    };
    
    const greeting = 'Welcome to the ' + domainNames[currentDomain] + ' pipeline interview. I will ask you a question. Please speak your answer out loud when prompted.';
    
    setUIState('speaking', "Initializing...");
    
    speakText(greeting, () => {
       askQuestion();
    });"""

replace_logic = """    // Skip the long greeting and immediately start the interview
    setTimeout(() => {
        askQuestion();
    }, 500);"""

html = html.replace(find_logic, replace_logic)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed greeting delay")
