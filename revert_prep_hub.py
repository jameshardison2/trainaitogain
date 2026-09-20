import re

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AI Interview Prep Hub — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    body { background: var(--gray-50); }
    .hero-section { text-align: center; padding: 64px 24px 32px; max-width: 800px; margin: 0 auto; }
    .hero-title { font-size: 42px; font-weight: 800; color: var(--black); margin-bottom: 16px; letter-spacing: -0.03em; line-height: 1.1; }
    .hero-subtitle { font-size: 18px; color: var(--gray-600); line-height: 1.5; margin-bottom: 48px; }
    
    .tool-card { background: var(--white); border: 2px solid var(--primary); border-radius: var(--radius-lg); padding: 48px; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 600px; margin: 0 auto 64px; box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15); }
    .tool-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(16, 185, 129, 0.25); }
    
    .tool-icon { font-size: 48px; margin-bottom: 24px; background: var(--primary-light); color: var(--primary-dark); width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; border-radius: 24px; }
    
    .tool-title { font-size: 28px; font-weight: 800; color: var(--black); margin-bottom: 16px; }
    .tool-desc { font-size: 16px; color: var(--gray-600); line-height: 1.6; margin-bottom: 32px; }
    
    .btn-visit { background: var(--primary); color: var(--white); border: none; padding: 16px 32px; border-radius: 100px; font-weight: 800; text-decoration: none; font-size: 18px; transition: all 0.2s; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3); display: inline-block; }
    .btn-visit:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5); }
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
      <h1 class="hero-title">Step 2: AI Interview Simulator</h1>
      <p class="hero-subtitle">Don't let interview anxiety stop you from completing your application. Experience a hyper-realistic mock interview right here in your browser to conquer your fears before the real thing.</p>
    </div>

    <!-- Our Custom Tool -->
    <div class="tool-card">
        <div class="tool-icon">📹</div>
        <h3 class="tool-title">Live AI Mock Interviewer</h3>
        <p class="tool-desc">Experience a realistic video interview. Our AI Copilot will ask you questions out loud, transcribe your answers in real-time, and provide instant coaching feedback to guarantee your success.</p>
        <a href="ai-interview.html" class="btn-visit">Launch Live Simulator ➔</a>
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
