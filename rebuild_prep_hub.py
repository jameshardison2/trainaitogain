import re

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AI Interview Tools — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    body { background: var(--gray-50); }
    .hero-section { text-align: center; padding: 64px 24px 32px; max-width: 800px; margin: 0 auto; }
    .hero-title { font-size: 42px; font-weight: 800; color: var(--black); margin-bottom: 16px; letter-spacing: -0.03em; line-height: 1.1; }
    .hero-subtitle { font-size: 18px; color: var(--gray-600); line-height: 1.5; margin-bottom: 48px; }
    
    .section-title { font-size: 24px; font-weight: 800; margin-bottom: 24px; color: var(--black); display: flex; align-items: center; gap: 12px; }
    
    .tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 64px; }
    
    .tool-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 32px; transition: all 0.2s; display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: var(--shadow-sm); }
    .tool-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary); }
    
    .tool-icon { font-size: 32px; margin-bottom: 16px; background: var(--gray-100); width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 16px; }
    .tool-card:hover .tool-icon { background: var(--primary-light); }
    
    .tool-title { font-size: 20px; font-weight: 700; color: var(--black); margin-bottom: 8px; }
    .tool-desc { font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 24px; flex-grow: 1; }
    
    .btn-visit { background: var(--white); color: var(--black); border: 1px solid var(--gray-300); padding: 12px; border-radius: 8px; font-weight: 700; text-align: center; text-decoration: none; transition: all 0.2s; font-size: 14px; }
    .tool-card:hover .btn-visit { background: var(--black); color: var(--white); border-color: var(--black); }
  </style>
</head>
<body>

<nav class="nav" aria-label="Primary Navigation">
    <div class="container">
      <div class="nav-inner">
        <a class="nav-logo" href="index.html" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
          <img src="logo.svg?v=2" alt="TrainAIToGain Logo" style="height:44px; display:block;" />
          <div class="logo-text" style="display:flex; flex-direction:column; line-height:1.1;">
            <span style="color:var(--black); font-weight:800; font-size:18px; letter-spacing:-0.02em;">TrainAIToGain</span>
            <span style="color:var(--primary); font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">We Get You Hired.</span>
          </div>
          </a>
          <input type="checkbox" id="nav-toggle" style="display:none;" />
        <label for="nav-toggle" class="nav-toggle-label">
          <span class="nav-toggle-icon"></span>
        </label>
        <ul class="nav-links">
          <li><a href="hiring-pipeline.html" class="nav-link" style="color:var(--primary); font-weight:700; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> The Hiring Pipeline</a></li>
          <li><a href="apply.html">Opportunities</a></li>
          <li><a href="guide-download.html" style="display:flex; align-items:center; gap:6px;">Blueprint <span style="background:var(--primary); color:var(--white); font-size:10px; padding:2px 6px; border-radius:100px; font-weight:800;">FREE</span></a></li>
        </ul>
      </div>
    </div>
  </nav>

<div class="container" style="max-width:1000px; padding:0 24px;">
    
    <div class="hero-section">
      <h1 class="hero-title">AI Interview Arsenal</h1>
      <p class="hero-subtitle">Don't let interview anxiety stop you from completing your application. Arm yourself with the best AI Copilots and Mock Interview apps on the market to guarantee your success.</p>
    </div>

    <!-- Live Copilots -->
    <h2 class="section-title"><span style="font-size:28px;">⚡</span> Live Interview Copilots (Real-Time)</h2>
    <div class="tool-grid">
        <a href="https://www.finalroundai.com/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">🎯</div>
                <h3 class="tool-title">Final Round AI</h3>
                <p class="tool-desc">Offers live transcription, real-time prompts, and a powerful copilot feature that runs invisibly alongside your actual remote interview.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
        <a href="https://www.lockedinai.com/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">🔒</div>
                <h3 class="tool-title">LockedIn AI</h3>
                <p class="tool-desc">Listens to your live interviews, instantly analyzes the interviewer's questions, and provides real-time answers and coaching overlays directly on your screen.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
        <a href="https://interviewsolver.com/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">💻</div>
                <h3 class="tool-title">Interview Solver</h3>
                <p class="tool-desc">A desktop app designed strictly for technical roles. Provides real-time code solutions for LeetCode-style algorithms and system design diagrams.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
    </div>

    <!-- Practice Apps -->
    <h2 class="section-title"><span style="font-size:28px;">🧠</span> Mock Interview & Practice Apps</h2>
    <div class="tool-grid">
        <a href="https://grow.google/certificates/interview-warmup/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">🇬</div>
                <h3 class="tool-title">Google Interview Warmup</h3>
                <p class="tool-desc">A free tool built by Google that transcribes your spoken answers and uses machine learning to grade your communication skills and keyword usage.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
        <a href="https://career.io/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">💼</div>
                <h3 class="tool-title">Career.io</h3>
                <p class="tool-desc">Provides AI-powered mock interviews strictly tailored to specific industries and job titles, delivering structured feedback on tone and content delivery.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
        <a href="https://interviewsidekick.com/" target="_blank" style="text-decoration:none; display:contents;">
            <div class="tool-card">
                <div class="tool-icon">🤝</div>
                <h3 class="tool-title">Interview Sidekick</h3>
                <p class="tool-desc">Simulates real-time mock interviews with personalized feedback designed to feel exactly like an expensive 1-on-1 human coaching session.</p>
                <div class="btn-visit">View Tool ➔</div>
            </div>
        </a>
    </div>
    
    <!-- Pipeline Pagination -->
    <div style="display:flex; justify-content:space-between; margin-top:32px; padding-top:32px; border-top:1px solid var(--gray-200); padding-bottom: 80px;">
      <a href="resume-ats-guide.html" class="btn-primary" style="background:var(--gray-100); color:var(--gray-700); border:1px solid var(--gray-200); text-decoration:none;">⬅ Step 1: Resume Optimizer</a>
      <a href="post-hire.html" class="btn-primary" style="text-decoration:none;">Step 3: Post-Hire Guide ➔</a>
    </div>

</div>

<footer style="background:var(--gray-100); padding: 64px 0;">
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:32px;">
        <div style="max-width:600px;">
          <p style="color:var(--black); font-weight:800; font-size:16px; margin-bottom:8px;">James Hardison II</p>
          <small style="color:var(--gray-500); font-size:13px; line-height:1.7; display:block; margin-bottom:24px;">
            Independent referral partner. I earn a referral credit when someone I refer is hired. Saying so up front.<br><br>
            Disclaimer: TrainAIToGain is an independent educational platform. We are not officially affiliated with, endorsed by, or sponsored by Mercor. "Mercor" and all related trademarks are the property of Mercor, Inc. Our guides are based on public information and community experiences. We do not guarantee employment or specific hiring outcomes.
          </small>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>
"""

with open('prep-hub.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
