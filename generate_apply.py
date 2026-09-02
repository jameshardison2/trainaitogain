import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r"(<header.*?</header>)", index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Global Opportunities Index — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .ticker-wrap {{ width: 100%; overflow: hidden; background: #064e3b; padding: 8px 0; border-bottom: 2px solid var(--primary); }}
    .ticker-content {{ white-space: nowrap; font-size: 13px; font-weight: 600; color: #a7f3d0; animation: ticker 25s linear infinite; display: inline-block; }}
    @keyframes ticker {{ 0% {{ transform: translateX(100%); }} 100% {{ transform: translateX(-100%); }} }}
    .ticker-item {{ display: inline-flex; align-items: center; gap: 8px; margin-right: 48px; }}
    .pulse-dot {{ width: 6px; height: 6px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399; animation: pulse 1.5s infinite; }}
    @keyframes pulse {{ 0% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} 100% {{ opacity: 1; }} }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<div class="ticker-wrap">
  <div class="ticker-content" id="live-ticker">
    <div class="ticker-item"><div class="pulse-dot"></div> <span style="color:#fff;">Sarah T.</span> matched as <span style="color:var(--primary-light);">Medical Annotator</span> 2 mins ago</div>
    <div class="ticker-item"><div class="pulse-dot"></div> <span style="color:#fff;">David K.</span> matched as <span style="color:var(--primary-light);">Python SWE</span> 5 mins ago</div>
    <div class="ticker-item"><div class="pulse-dot"></div> <span style="color:#fff;">Elena M.</span> matched as <span style="color:var(--primary-light);">Data Analyst</span> 12 mins ago</div>
    <div class="ticker-item"><div class="pulse-dot"></div> <span style="color:#fff;">Raj P.</span> matched as <span style="color:var(--primary-light);">Quant Dev</span> 18 mins ago</div>
    <div class="ticker-item"><div class="pulse-dot"></div> <span style="color:#fff;">James L.</span> matched as <span style="color:var(--primary-light);">C++ Systems Engineer</span> 22 mins ago</div>
  </div>
</div>

<section style="padding: 48px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">Global Opportunities Index</h1>
    <p style="font-size:16px; color:var(--gray-500);">Browse all available pipelines. Select a domain below to see granular, niche-specific job postings and bypass the generic applicant pool.</p>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
      
      <!-- Domain Card -->
      <a href="role-software.html" class="feature-card opp-card" style="background:var(--white); border:1px solid var(--gray-200); padding:32px; display:flex; flex-direction:column; text-decoration:none; color:inherit; border-radius:var(--radius-lg); transition:all 0.2s; box-shadow:var(--shadow-sm);">
        <div style="width:48px; height:48px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:20px; font-size:24px;">💻</div>
        <h3 style="font-size:24px; font-weight:800; margin-bottom:8px;">Software & Tech</h3>
        <p style="color:var(--gray-500); font-size:14px; margin-bottom:24px;">Python, React, C++, Rust, Data Engineering, and Cybersecurity.</p>
        <div style="margin-top:auto; color:var(--primary); font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:space-between;">
          <span>6 Open Roles</span>
          <span>Up to $150/hr &rarr;</span>
        </div>
      </a>

      <!-- Domain Card -->
      <a href="role-medical.html" class="feature-card opp-card" style="background:var(--white); border:1px solid var(--gray-200); padding:32px; display:flex; flex-direction:column; text-decoration:none; color:inherit; border-radius:var(--radius-lg); transition:all 0.2s; box-shadow:var(--shadow-sm);">
        <div style="width:48px; height:48px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:20px; font-size:24px;">🩺</div>
        <h3 style="font-size:24px; font-weight:800; margin-bottom:8px;">Medical & Clinical</h3>
        <p style="color:var(--gray-500); font-size:14px; margin-bottom:24px;">Oncology, Neurology, Primary Care, and Pharmacology.</p>
        <div style="margin-top:auto; color:var(--primary); font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:space-between;">
          <span>5 Open Roles</span>
          <span>Up to $150/hr &rarr;</span>
        </div>
      </a>

      <!-- Domain Card -->
      <a href="role-finance.html" class="feature-card opp-card" style="background:var(--white); border:1px solid var(--gray-200); padding:32px; display:flex; flex-direction:column; text-decoration:none; color:inherit; border-radius:var(--radius-lg); transition:all 0.2s; box-shadow:var(--shadow-sm);">
        <div style="width:48px; height:48px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:20px; font-size:24px;">📈</div>
        <h3 style="font-size:24px; font-weight:800; margin-bottom:8px;">Finance & Quant</h3>
        <p style="color:var(--gray-500); font-size:14px; margin-bottom:24px;">Algorithmic Trading, Actuarial Science, M&A, Mathematics.</p>
        <div style="margin-top:auto; color:var(--primary); font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:space-between;">
          <span>5 Open Roles</span>
          <span>Up to $150/hr &rarr;</span>
        </div>
      </a>

      <!-- Domain Card -->
      <a href="https://t.mercor.com/wbPMF" target="_blank" class="feature-card opp-card" style="background:var(--white); border:1px solid var(--gray-200); padding:32px; display:flex; flex-direction:column; text-decoration:none; color:inherit; border-radius:var(--radius-lg); transition:all 0.2s; box-shadow:var(--shadow-sm);">
        <div style="width:48px; height:48px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:12px; margin-bottom:20px; font-size:24px;">🌍</div>
        <h3 style="font-size:24px; font-weight:800; margin-bottom:8px;">Translation & Law</h3>
        <p style="color:var(--gray-500); font-size:14px; margin-bottom:24px;">Legal Review, Multilingual Annotation, Humanities Experts.</p>
        <div style="margin-top:auto; color:var(--primary); font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:space-between;">
          <span>10+ Open Roles</span>
          <span>View on Mercor &rarr;</span>
        </div>
      </a>

    </div>
  </div>
</section>

{footer}

</body>
</html>
"""

with open("apply.html", "w") as f:
    f.write(html)
print("Created apply.html")
