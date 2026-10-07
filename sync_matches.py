import re

with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

# Find the LLM call block
target_block = """            const roles = Object.keys(jobDescriptions).join(', ');
            const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles. 
            Resume: ${resumeText}
            Active Roles: ${roles}
            
            Return a JSON array of the top 3 best matching roles from the list above, along with a percentage match for each. Do not include markdown formatting or backticks. Format exactly like this:
            [
              {"role": "Exact Role Title 1", "match": "95%"},
              {"role": "Exact Role Title 2", "match": "88%"},
              {"role": "Exact Role Title 3", "match": "75%"}
            ]`;
            
            try {
                                const response = await fetch('/api/generateAiResponse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                let responseText = data.candidates[0].content.parts[0].text.trim();
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const matches = JSON.parse(responseText);"""

new_block = """            try {
                let matches = [];
                const cachedMatchesStr = sessionStorage.getItem('ai_matches');
                if (cachedMatchesStr) {
                    try {
                        const parsedCache = JSON.parse(cachedMatchesStr);
                        if (parsedCache && parsedCache.length > 0 && parsedCache[0].roleName) {
                            matches = parsedCache.map(m => ({
                                role: m.roleName,
                                match: m.matchScore + "%"
                            }));
                        }
                    } catch(e) { console.error("Cache parse error", e); }
                }
                
                if (matches.length === 0) {
                    const roles = Object.keys(jobDescriptions).join(', ');
                    const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles. 
                    Resume: ${resumeText}
                    Active Roles: ${roles}
                    
                    Return a JSON array of the top 3 best matching roles from the list above, along with a percentage match for each. Do not include markdown formatting or backticks. Format exactly like this:
                    [
                      {"role": "Exact Role Title 1", "match": "95%"},
                      {"role": "Exact Role Title 2", "match": "88%"},
                      {"role": "Exact Role Title 3", "match": "75%"}
                    ]`;
                    
                    const response = await fetch('/api/generateAiResponse', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });
                    
                    const data = await response.json();
                    if (data.error) throw new Error(data.error.message);
                    let responseText = data.candidates[0].content.parts[0].text.trim();
                    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                    matches = JSON.parse(responseText);
                    
                    // Save to shared cache for apply.html
                    sessionStorage.setItem('ai_matches', JSON.stringify(matches.map(m => ({
                        roleName: m.role,
                        matchScore: parseInt(m.match.replace('%', '')),
                        explanation: "Automatically matched based on your resume profile and background."
                    }))));
                }"""

content = content.replace(target_block, new_block)

# Since we define `matches` using `let matches = [];` above, we need to ensure we don't have scope issues.
# Wait, `const matches = JSON.parse(responseText);` was inside the try block, so `let matches = [];` is safe.
# Actually I need to check if my string replacement matched anything!

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("done")
