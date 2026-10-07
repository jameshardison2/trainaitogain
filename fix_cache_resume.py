with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

bad_cache = """                let matches = [];
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
                }"""

good_cache = """                let matches = [];
                const cachedMatchesStr = sessionStorage.getItem('ai_matches');
                const cachedResume = sessionStorage.getItem('ai_matches_resume');
                
                // Only reuse cache if the resume text is identical!
                if (cachedMatchesStr && cachedResume === resumeText) {
                    try {
                        const parsedCache = JSON.parse(cachedMatchesStr);
                        if (parsedCache && parsedCache.length > 0 && parsedCache[0].roleName) {
                            matches = parsedCache.map(m => ({
                                role: m.roleName,
                                match: m.matchScore + "%"
                            }));
                        }
                    } catch(e) { console.error("Cache parse error", e); }
                }"""

content = content.replace(bad_cache, good_cache)

bad_save = """                    // Save to shared cache for apply.html
                    sessionStorage.setItem('ai_matches', JSON.stringify(matches.map(m => ({
                        roleName: m.role,
                        matchScore: parseInt(m.match.replace('%', '')),
                        explanation: "Automatically matched based on your resume profile and background."
                    }))));"""

good_save = """                    // Save to shared cache for apply.html
                    sessionStorage.setItem('ai_matches_resume', resumeText);
                    sessionStorage.setItem('ai_matches', JSON.stringify(matches.map(m => ({
                        roleName: m.role,
                        matchScore: parseInt(m.match.replace('%', '')),
                        explanation: "Automatically matched based on your resume profile and background."
                    }))));"""

content = content.replace(bad_save, good_save)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("resume cache applied to ats")
