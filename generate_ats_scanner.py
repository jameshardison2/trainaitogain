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
  <title>Resume Formatter & ATS Scanner — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .ats-container {{ background: var(--white); border-radius: var(--radius-lg); padding: 48px; max-width: 700px; margin: 0 auto; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); }}
    .meter-wrap {{ background: var(--gray-200); height: 24px; border-radius: 100px; overflow: hidden; margin-bottom: 8px; position: relative; }}
    .meter-fill {{ background: #ef4444; height: 100%; width: 0%; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }}
    .meter-text {{ text-align: center; font-weight: 800; font-size: 24px; margin-bottom: 32px; }}
    .meter-text span {{ color: #ef4444; transition: color 0.5s; }}
    
    .check-item {{ display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--gray-100); cursor: pointer; }}
    .check-item:last-child {{ margin-bottom: 0; padding-bottom: 0; border-bottom: none; }}
    .check-box {{ width: 28px; height: 28px; border: 2px solid var(--gray-400); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }}
    .check-item.active .check-box {{ background: var(--primary); border-color: var(--primary); }}
    .check-box svg {{ width: 16px; height: 16px; fill: none; stroke: white; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transform: scale(0.5); transition: all 0.2s; }}
    .check-item.active .check-box svg {{ opacity: 1; transform: scale(1); }}
    
    .check-content h3 {{ font-size: 18px; font-weight: 700; color: var(--black); margin-bottom: 4px; }}
    .check-content p {{ font-size: 14px; color: var(--gray-500); line-height: 1.5; }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 64px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">ATS Resume Scanner</h1>
    <p style="font-size:16px; color:var(--gray-500);">Mercor doesn't have human recruiters reading your resume. An AI parses it instantly. Use this self-audit tool to ensure your formatting won't get you auto-rejected.</p>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    
    <div class="ats-container">
      
      <div class="meter-text">ATS Pass Probability: <span id="score-text">0%</span></div>
      <div class="meter-wrap">
        <div class="meter-fill" id="meter-fill"></div>
      </div>
      <p style="text-align:center; font-size:14px; color:var(--gray-500); margin-bottom:48px;">Check all the boxes that apply to your current resume.</p>

      <div class="check-item" onclick="toggleCheck(this, 20)">
        <div class="check-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="check-content">
          <h3>Single Column Layout</h3>
          <p>Multi-column graphic resumes confuse parsers. Is your resume a simple top-to-bottom document?</p>
        </div>
      </div>

      <div class="check-item" onclick="toggleCheck(this, 20)">
        <div class="check-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="check-content">
          <h3>Standard Typography</h3>
          <p>Did you use standard, system-safe fonts (like Arial, Times New Roman, or Calibri) instead of custom graphic fonts?</p>
        </div>
      </div>

      <div class="check-item" onclick="toggleCheck(this, 20)">
        <div class="check-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="check-content">
          <h3>No Photos or Graphics</h3>
          <p>Did you remove all headshots, logos, icons, and graphic skill bars? (These can break text extraction algorithms).</p>
        </div>
      </div>

      <div class="check-item" onclick="toggleCheck(this, 20)">
        <div class="check-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="check-content">
          <h3>Explicit Skill Keywords</h3>
          <p>Did you explicitly list your tech stack (e.g., Python, C++, React) rather than relying on implied experience?</p>
        </div>
      </div>

      <div class="check-item" onclick="toggleCheck(this, 20)">
        <div class="check-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="check-content">
          <h3>PDF Export</h3>
          <p>Are you uploading your resume as a clean, text-searchable PDF (not a flat image or obscure format)?</p>
        </div>
      </div>

      <div style="text-align:center; margin-top:48px;">
        <a href="https://t.mercor.com/wbPMF" target="_blank" class="btn-primary" id="apply-btn" style="opacity:0.5; pointer-events:none;">Submit Resume to Mercor</a>
        <p style="font-size:12px; color:var(--gray-400); margin-top:12px;">You must score 100% to proceed safely.</p>
      </div>

    </div>

  </div>
</section>

{footer}

<script>
  let score = 0;
  const meterFill = document.getElementById('meter-fill');
  const scoreText = document.getElementById('score-text');
  const applyBtn = document.getElementById('apply-btn');

  function toggleCheck(el, points) {{
    if (el.classList.contains('active')) {{
      el.classList.remove('active');
      score -= points;
    }} else {{
      el.classList.add('active');
      score += points;
    }}
    
    updateMeter();
  }}

  function updateMeter() {{
    meterFill.style.width = score + '%';
    scoreText.innerText = score + '%';
    
    // Color logic
    if (score < 50) {{
      meterFill.style.background = '#ef4444';
      scoreText.style.color = '#ef4444';
    }} else if (score < 100) {{
      meterFill.style.background = '#f59e0b';
      scoreText.style.color = '#f59e0b';
    }} else {{
      meterFill.style.background = '#10b981';
      scoreText.style.color = '#10b981';
    }}

    // Button state
    if (score === 100) {{
      applyBtn.style.opacity = '1';
      applyBtn.style.pointerEvents = 'auto';
      applyBtn.innerText = 'Pass: Submit Resume to Mercor';
    }} else {{
      applyBtn.style.opacity = '0.5';
      applyBtn.style.pointerEvents = 'none';
      applyBtn.innerText = 'Submit Resume to Mercor';
    }}
  }}
</script>

</body>
</html>
"""

with open("resume-ats-guide.html", "w") as f:
    f.write(html)
print("Created resume-ats-guide.html")
