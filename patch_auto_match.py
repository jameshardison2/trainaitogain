import re

with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

old_logic = """                let responseText = data.candidates[0].content.parts[0].text.trim();
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const matches = JSON.parse(responseText);
                const bestRole = matches[0].role;
                window.topMatches = matches;
                
                // Set the role
                const hiddenSelect = document.getElementById('role-select');
                const customDisplay = document.getElementById('custom-role-text');
                
                if (jobDescriptions[bestRole]) {
                    hiddenSelect.value = bestRole;
                    customDisplay.innerText = `${bestRole} (${matches[0].match} AI Fit)`;
                    customDisplay.style.color = 'var(--black)';
                    
                    // Inject top matches into the custom dropdown visually
                    const customOptionsDiv = document.getElementById('custom-role-options');
                    
                    const divider = document.createElement('div');
                    divider.style.padding = '8px 14px';
                    divider.style.background = 'rgba(16,185,129,0.1)';
                    divider.style.color = 'var(--primary)';
                    divider.style.fontSize = '11px';
                    divider.style.fontWeight = '800';
                    divider.innerText = 'AI TOP MATCHES';
                    
                    const aiMatchesContainer = document.createElement('div');
                    aiMatchesContainer.appendChild(divider);
                    
                    matches.forEach(match => {
                        if (jobDescriptions[match.role]) {
                            const opt = document.createElement('div');"""

new_logic = """                let responseText = data.candidates[0].content.parts[0].text.trim();
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const matches = JSON.parse(responseText);
                
                function getValidRole(roleStr) {
                    const keys = Object.keys(jobDescriptions);
                    if (keys.includes(roleStr)) return roleStr;
                    let lower = roleStr.toLowerCase();
                    for(let k of keys) { if(k.toLowerCase() === lower) return k; }
                    let words = lower.split(' ').filter(w => w.length > 3);
                    for(let k of keys) { 
                        let kLower = k.toLowerCase();
                        if(kLower.includes(lower) || lower.includes(kLower)) return k;
                        for(let w of words) {
                            if(kLower.includes(w) && (kLower.includes('engineer') || lower.includes('engineer'))) return k;
                        }
                    }
                    return null;
                }
                
                const bestRole = getValidRole(matches[0].role);
                window.topMatches = matches;
                
                // Set the role
                const hiddenSelect = document.getElementById('role-select');
                const customDisplay = document.getElementById('custom-role-text');
                
                if (bestRole && jobDescriptions[bestRole]) {
                    hiddenSelect.value = bestRole;
                    customDisplay.innerText = `${bestRole} (${matches[0].match} AI Fit)`;
                    customDisplay.style.color = 'var(--black)';
                    
                    // Inject top matches into the custom dropdown visually
                    const customOptionsDiv = document.getElementById('custom-role-options');
                    
                    const divider = document.createElement('div');
                    divider.style.padding = '8px 14px';
                    divider.style.background = 'rgba(16,185,129,0.1)';
                    divider.style.color = 'var(--primary)';
                    divider.style.fontSize = '11px';
                    divider.style.fontWeight = '800';
                    divider.innerText = 'AI TOP MATCHES';
                    
                    const aiMatchesContainer = document.createElement('div');
                    aiMatchesContainer.appendChild(divider);
                    
                    matches.forEach(match => {
                        let validMatchRole = getValidRole(match.role);
                        if (validMatchRole && jobDescriptions[validMatchRole]) {
                            const opt = document.createElement('div');"""

content = content.replace(old_logic, new_logic)

# Replace match.role with validMatchRole below in the loop
old_loop_inner = """                            const opt = document.createElement('div');
                            opt.style.padding = '12px 14px';
                            opt.style.cursor = 'pointer';
                            opt.style.borderBottom = '1px solid var(--gray-200)';
                            opt.style.display = 'flex';
                            opt.style.justifyContent = 'space-between';
                            opt.style.alignItems = 'center';
                            opt.style.fontSize = '14px';
                            opt.innerHTML = `<span>${match.role}</span><span style="background:var(--primary); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">${match.match}</span>`;
                            opt.onclick = () => {
                              hiddenSelect.value = match.role;
                              customDisplay.innerText = `${match.role} (${match.match} AI Fit)`;"""

new_loop_inner = """                            const opt = document.createElement('div');
                            opt.style.padding = '12px 14px';
                            opt.style.cursor = 'pointer';
                            opt.style.borderBottom = '1px solid var(--gray-200)';
                            opt.style.display = 'flex';
                            opt.style.justifyContent = 'space-between';
                            opt.style.alignItems = 'center';
                            opt.style.fontSize = '14px';
                            opt.innerHTML = `<span>${validMatchRole}</span><span style="background:var(--primary); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">${match.match}</span>`;
                            opt.onclick = () => {
                              hiddenSelect.value = validMatchRole;
                              customDisplay.innerText = `${validMatchRole} (${match.match} AI Fit)`;"""

content = content.replace(old_loop_inner, new_loop_inner)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("auto-match fuzzy logic injected")
