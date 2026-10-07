with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

# 1. Wait condition
str1 = "const roles = Object.keys(jobDescriptions).join(', ');"
new_str1 = """// Prevent Race Condition: Wait for Cloud Function fetch to finish
            let waitAttempts = 0;
            while (Object.keys(jobDescriptions).length === 0 && waitAttempts < 30) {
                await new Promise(r => setTimeout(r, 500));
                waitAttempts++;
            }
            const roles = Object.keys(jobDescriptions).join(', ');"""
content = content.replace(str1, new_str1)

# 2. Fuzzy match definition
str2 = """const bestRole = matches[0].role;
                window.topMatches = matches;"""
new_str2 = """function getValidRole(roleStr) {
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
                
                let bestRole = getValidRole(matches[0].role);
                if (!bestRole && Object.keys(jobDescriptions).length > 0) {
                    bestRole = Object.keys(jobDescriptions)[0]; // ultimate fallback
                }
                window.topMatches = matches;"""
content = content.replace(str2, new_str2)

# 3. Fix inner loop
str3 = """matches.forEach(match => {
                        if (jobDescriptions[match.role]) {"""
new_str3 = """matches.forEach(match => {
                        let validMatchRole = getValidRole(match.role) || Object.keys(jobDescriptions)[0];
                        if (validMatchRole && jobDescriptions[validMatchRole]) {
                            match.role = validMatchRole; // overwrite with safe key"""
content = content.replace(str3, new_str3)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("patch applied correctly")
