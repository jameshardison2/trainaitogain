import re

with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

old_logic = """            const roles = Object.keys(jobDescriptions).join(', ');
            const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles."""

new_logic = """            // Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }
            
            const roles = Object.keys(jobDescriptions).join(', ');
            const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles."""

content = content.replace(old_logic, new_logic)

old_fallback = """                const bestRole = getValidRole(matches[0].role);
                window.topMatches = matches;
                
                // Set the role
                const hiddenSelect = document.getElementById('role-select');
                const customDisplay = document.getElementById('custom-role-text');
                
                if (bestRole && jobDescriptions[bestRole]) {"""

new_fallback = """                let bestRole = getValidRole(matches[0].role);
                if (!bestRole && Object.keys(jobDescriptions).length > 0) {
                    // Ultimate Fallback: just pick the first available role if hallucination was unrecoverable
                    bestRole = Object.keys(jobDescriptions)[0]; 
                }
                window.topMatches = matches;
                
                // Set the role
                const hiddenSelect = document.getElementById('role-select');
                const customDisplay = document.getElementById('custom-role-text');
                
                if (bestRole && jobDescriptions[bestRole]) {"""

content = content.replace(old_fallback, new_fallback)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("race condition and fallback patched")
