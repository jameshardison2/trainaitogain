import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_start_btn = """    currentQ = 0;
    
    setupView.style.display = 'none';
    
    // Request Camera & Mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })"""

replace_start_btn = """    
    // START HYBRID LLM BATCH GENERATION
    setupView.style.display = 'none';
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'gemini-loading-screen';
    loadingScreen.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:var(--black); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;";
    loadingScreen.innerHTML = `
        <div style="width:48px; height:48px; border:4px solid rgba(16,185,129,0.2); border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite; margin-bottom:24px;"></div>
        <h2 style="font-size:24px; font-weight:800; margin-bottom:12px;">Initializing Gemini AI...</h2>
        <p style="color:#aaa; font-size:15px;" id="gemini-status">Parsing resume and dynamically generating 3 high-pressure Mercor questions.</p>
        <style>@keyframes spin { 100% { transform:rotate(360deg); } }</style>
    `;
    document.querySelector('.sim-container').appendChild(loadingScreen);
    
    const generatePrompt = `You are a high-pressure AI technical interviewer (like Mercor). The candidate's chosen role is ${currentDomain}. Their resume text is: ${candidateResume || 'None provided.'}
    Generate EXACTLY 3 highly specific, difficult interview questions (Edge Cases, Ethical Traps, and Technical deep dives).
    Return ONLY a raw JSON array of objects with this EXACT structure (no markdown, no backticks):
    [{"q": "The question", "answer": "The ideal 3-sentence teleprompter answer", "keywords": ["kw1", "kw2"], "feedbackMiss": "What they missed", "feedbackHit": "Why it's a good answer"}]`;
    
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + firebaseConfig.apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: generatePrompt }] }] })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            if (data.error.code === 403) {
                loadingScreen.innerHTML = `
                    <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
                    <h2 style="font-size:24px; font-weight:800; margin-bottom:12px; color:#ef4444;">Gemini API Disabled</h2>
                    <p style="color:#aaa; font-size:14px; max-width:400px; line-height:1.6; margin-bottom:24px;">
                        The dynamic AI generation requires the Gemini Developer API, which is not currently enabled in your Firebase project.<br><br>
                        <strong>To enable it, run this command in your terminal:</strong><br>
                        <code style="background:#222; padding:8px; border-radius:4px; display:block; margin-top:8px; color:var(--primary);">npx firebase-tools init ailogic</code>
                    </p>
                    <button class="btn-sim" id="fallback-btn" style="padding:12px 24px; font-size:14px;">Fallback to Offline Question Bank</button>
                `;
                document.getElementById('fallback-btn').onclick = () => {
                    loadingScreen.remove();
                    startInterviewEngine();
                };
            } else {
                loadingScreen.innerHTML = `<h2 style="color:red;">Error: ${data.error.message}</h2><button class="btn-sim" onclick="document.getElementById('gemini-loading-screen').remove(); startInterviewEngine();">Fallback</button>`;
            }
        } else {
            try {
                const rawText = data.candidates[0].content.parts[0].text;
                const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                const generatedQuestions = JSON.parse(cleanJson);
                // Prepend STAR resume question if we generated one
                if (currentQuestions.length > 0 && currentQuestions[0].q.includes("parsed your resume")) {
                    currentQuestions = [currentQuestions[0], ...generatedQuestions];
                } else {
                    currentQuestions = generatedQuestions;
                }
                loadingScreen.remove();
                startInterviewEngine();
            } catch (e) {
                console.error("Failed to parse Gemini output:", e);
                loadingScreen.innerHTML = `<h2 style="color:red;">Generation Failed. Using fallback.</h2>`;
                setTimeout(() => { loadingScreen.remove(); startInterviewEngine(); }, 2000);
            }
        }
    })
    .catch(err => {
        console.error(err);
        loadingScreen.innerHTML = `<h2 style="color:red;">Network Error. Using fallback.</h2>`;
        setTimeout(() => { loadingScreen.remove(); startInterviewEngine(); }, 2000);
    });
    
    function startInterviewEngine() {
        currentQ = 0;
        // Request Camera & Mic
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })"""

if find_start_btn in html:
    html = html.replace(find_start_btn, replace_start_btn)
else:
    print("Warning: Could not find start btn replace block")

# Fix currentQ issue in inject logic
html = html.replace('<!-- CACHE BUST 22', '<!-- CACHE BUST 23')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected Gemini dynamic LLM prompt block")
