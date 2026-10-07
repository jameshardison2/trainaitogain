with open('apply.html', 'r') as f:
    content = f.read()

target_block = """          // 3. Prompt Gemini
          const prompt = `You are an expert technical recruiter for Mercor. I will provide a candidate's resume and a JSON list of open job roles.
Analyze the candidate's experience and find the top 3 best matching roles for them. 
Return ONLY a raw JSON array of objects (no markdown, no backticks), where each object has:
'roleName' (exact match from the list), 'matchScore' (integer 0-100), and 'explanation' (1-2 sentences highly personalized explaining why their specific past experience is a fit).

ROLES:
${JSON.stringify(roleList)}

RESUME:
${resumeText.substring(0, 10000)}`;

          const aiResponse = await fetch('/api/generateAiResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.1 }
            })
          });
          
          const aiData = await aiResponse.json();
          if (!aiData.candidates || aiData.candidates.length === 0) {
              console.error("AI Error:", aiData);
              statusDiv.style.animation = 'none';
              statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Scanner Offline: Our AI provider is currently experiencing high load. Please browse and apply to the roles manually below.</span>';
              return;
          }
          let aiText = aiData.candidates[0].content.parts[0].text;
          
          // Clean markdown backticks if present
          aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
          
          const matches = JSON.parse(aiText);"""

new_block = """          // 3. Prompt Gemini OR Check Cache
          let matches = null;
          const cachedMatchesStr = sessionStorage.getItem('ai_matches');
          const cachedResume = sessionStorage.getItem('ai_matches_resume');
          
          if (cachedMatchesStr && cachedResume === resumeText) {
              try {
                  const parsedCache = JSON.parse(cachedMatchesStr);
                  // Ensure format is correct for apply.html
                  if (parsedCache && parsedCache.length > 0 && parsedCache[0].explanation) {
                      matches = parsedCache;
                  }
              } catch(e) { console.error("Cache parse error", e); }
          }
          
          if (!matches) {
              const prompt = `You are an expert technical recruiter for Mercor. I will provide a candidate's resume and a JSON list of open job roles.
              Analyze the candidate's experience and find the top 3 best matching roles for them. 
              Return ONLY a raw JSON array of objects (no markdown, no backticks), where each object has:
              'roleName' (exact match from the list), 'matchScore' (integer 0-100), and 'explanation' (1-2 sentences highly personalized explaining why their specific past experience is a fit).
              
              ROLES:
              ${JSON.stringify(roleList)}
              
              RESUME:
              ${resumeText.substring(0, 10000)}`;

              const aiResponse = await fetch('/api/generateAiResponse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.1 }
                })
              });
              
              const aiData = await aiResponse.json();
              if (!aiData.candidates || aiData.candidates.length === 0) {
                  console.error("AI Error:", aiData);
                  statusDiv.style.animation = 'none';
                  statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Scanner Offline: Our AI provider is currently experiencing high load. Please browse and apply to the roles manually below.</span>';
                  return;
              }
              let aiText = aiData.candidates[0].content.parts[0].text;
              aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
              matches = JSON.parse(aiText);
          }"""

content = content.replace(target_block, new_block)

bad_save = "sessionStorage.setItem('ai_matches', JSON.stringify(matches));"
good_save = """sessionStorage.setItem('ai_matches_resume', resumeText);
          sessionStorage.setItem('ai_matches', JSON.stringify(matches));"""

content = content.replace(bad_save, good_save)

with open('apply.html', 'w') as f:
    f.write(content)
print("apply cache injected")
