import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Interview Prep Hub — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .module-card {{
      background: var(--white);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      padding: 32px;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }}
    .module-card:hover {{
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary);
    }}
    .module-icon {{
      width: 48px; height: 48px;
      border-radius: 12px;
      background: var(--primary-light);
      color: var(--primary-dark);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      margin-bottom: 20px;
    }}
  </style>
</head>
<body style="background:var(--gray-50); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 64px 0 32px; text-align:center;">
  <div class="container">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px;">Interactive Prep Hub</h1>
    <p style="font-size:18px; color:var(--gray-500); max-width:600px; margin:0 auto;">Master the RLHF pipeline. Practice native interview mechanics, live coding, and red-teaming in our browser-based sandboxes.</p>
  </div>
</section>

<section style="padding-bottom: 80px; flex:1;">
  <div class="container">
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; max-width:1000px; margin:0 auto;">
      
      <div class="module-card">
        <div class="module-icon">🎙️</div>
        <h3 style="font-size:22px; font-weight:700; margin-bottom:8px; color:var(--black);">Voice Evaluator Simulator</h3>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:24px; flex-grow:1;">Practice behavioral prompts live. Our Web Speech API analyzes your cadence, filler words, and delivers an instant confidence score.</p>
        <a href="ai-interview.html" class="btn-primary" style="text-align:center;">Launch Module</a>
      </div>

      <div class="module-card">
        <div class="module-icon">💻</div>
        <h3 style="font-size:22px; font-weight:700; margin-bottom:8px; color:var(--black);">Live Coding Sandbox</h3>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:24px; flex-grow:1;">Embedded VS Code Monaco editor. Tackle algorithmic problems and write logic directly in your browser memory.</p>
        <a href="prep-coding.html" class="btn-primary" style="text-align:center;">Launch Module</a>
      </div>

      <div class="module-card">
        <div class="module-icon">⚖️</div>
        <h3 style="font-size:22px; font-weight:700; margin-bottom:8px; color:var(--black);">Case Study Scenarios</h3>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:24px; flex-grow:1;">Interactive branching-logic scenarios for Domain Experts (Medical, Finance, Law) focusing on edge-case resolution.</p>
        <a href="prep-casestudy.html" class="btn-primary" style="text-align:center;">Launch Module</a>
      </div>

      <div class="module-card">
        <div class="module-icon">🚨</div>
        <h3 style="font-size:22px; font-weight:700; margin-bottom:8px; color:var(--black);">Hallucination Gym</h3>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:24px; flex-grow:1;">A timed red-teaming challenge. Catch subtle logic, math, and factual hallucinations in flawed model outputs before the clock runs out.</p>
        <a href="prep-hallucination.html" class="btn-primary" style="text-align:center;">Launch Module</a>
      </div>

      <div class="module-card">
        <div class="module-icon">⚔️</div>
        <h3 style="font-size:22px; font-weight:700; margin-bottom:8px; color:var(--black);">Panel Stress-Test</h3>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:24px; flex-grow:1;">Rapid-fire cross-examination from a mock panel. Defend your evaluation methodology and safety reasoning under pressure.</p>
        <a href="prep-crossexam.html" class="btn-primary" style="text-align:center;">Launch Module</a>
      </div>

    </div>
  </div>
</section>

{footer}

</body>
</html>
"""

with open("prep-hub.html", "w") as f:
    f.write(html)
print("Created prep-hub.html")
