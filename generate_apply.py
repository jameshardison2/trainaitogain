import re
import json

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

with open("roles.json", "r") as f:
    roles_data = json.load(f)

carousel_html = ""
domain_icons = {"software": "💻", "medical": "🩺", "finance": "📈", "translation": "🌍", "general": "📋"}
domain_titles = {"software": "Software & Tech", "medical": "Medical & Clinical", "finance": "Finance & Quant", "translation": "Translation & Law", "general": "Generalist & Content"}

for domain, roles in roles_data.items():
    icon = domain_icons.get(domain, "✨")
    title = domain_titles.get(domain, domain.capitalize())
    
    carousel_html += f"""
    <div style="margin-bottom: 48px; position: relative;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
        <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">{icon}</div>
        <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">{title} Pipelines</h2>
      </div>
      
      <button class="carousel-btn" style="left:-20px;" onclick="document.getElementById('carousel-{domain}').scrollBy({{left: -320, behavior: 'smooth'}})">‹</button>
      <button class="carousel-btn" style="right:-20px;" onclick="document.getElementById('carousel-{domain}').scrollBy({{left: 320, behavior: 'smooth'}})">›</button>
      
      <div id="carousel-{domain}" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;">
        <style>
          /* Hide scrollbar for a cleaner look */
          div::-webkit-scrollbar {{ display: none; }}
        </style>
    """
    for job in roles:
        label = f"job_board_{job['tag']}"
        carousel_html += f"""
        <div class="feature-card opp-card" style="scroll-snap-align: start; min-width: 300px; max-width: 300px; flex: 0 0 auto; background:var(--white); border:1px solid var(--gray-200); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
          {f'<div style="position:absolute; top:-12px; right:20px; background:#ef4444; color:white; font-size:11px; font-weight:800; padding:4px 10px; border-radius:100px; box-shadow:0 4px 12px rgba(239, 68, 68, 0.3);">HOT ROLE</div>' if job.get('hot') else ''}
          <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;">
            <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">{job['tag']}</div>
            <div style="color:var(--primary); font-weight:800; font-size:18px;">{job['pay']}</div>
          </div>
          <h3 style="font-size:18px; margin-bottom:8px; color:var(--black); line-height:1.2;">{job['title']}</h3>
          <p style="color:var(--gray-500); font-size:14px; margin-bottom:20px; flex-grow:1; line-height:1.6;">{job['desc']}</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:24px;">
            {''.join([f'<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">{skill}</span>' for skill in job['skills']])}
          </div>
          <div style="display:flex; gap:8px;">
            <button style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';" onclick="openApplyModal('{label}');">Apply via Mercor</button>
            <button onclick="saveRole('{job['title']}', '{domain}', '{job['pay']}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
          </div>
        </div>
        """
    
    carousel_html += """
      </div>
    </div>
    """

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Global Opportunities Index — TrainAIToGain</title>
  <meta name="description" content="Browse live pipelines for Software, Medical, and Finance AI training roles. Bypass the Mercor waitlist with direct referral applications.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .carousel-btn {{
        position: absolute;
        top: 60%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--white);
        border: 1px solid var(--gray-200);
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: var(--black);
        cursor: pointer;
        z-index: 10;
        transition: all 0.2s;
    }}
    .carousel-btn:hover {{ background: var(--primary); color: var(--white); border-color: var(--primary); }}
    @media (max-width: 768px) {{ .carousel-btn {{ display: none; }} }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 48px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">Global Opportunities Index</h1>
    <p style="font-size:16px; color:var(--gray-500); margin-bottom: 32px;">Browse all {sum(len(v) for v in roles_data.values())} active pipelines. Select a domain below to see granular, niche-specific job postings and bypass the generic applicant pool.</p>
    
    <div style="background: var(--primary-light); color: var(--primary-dark); padding: 16px 20px; border-radius: var(--radius); font-size: 14px; display: flex; gap: 12px; align-items: flex-start; text-align: left; line-height: 1.5; border: 1px solid rgba(52, 211, 153, 0.3);">
      <div style="font-size: 20px; line-height: 1;">💡</div>
      <div><strong>Partner Application Notice:</strong> All applications are processed through the Mercor Universal Talent Network. By applying via our verified partner links, your profile will be prioritized and automatically evaluated for your selected pipeline as well as all other open roles.</div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    {carousel_html}
  </div>
</section>

{footer}

<script>
function saveRole(title, domain, pay) {{
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {{
        saved.push({{ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() }});
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        alert('Role saved! You can view it in the Dashboard in the top menu.');
    }} else {{
        alert('Role is already in your Pipeline Dashboard.');
    }}
}}
</script>


</body>
</html>
"""

with open("apply.html", "w") as f:
    f.write(html)
print("Created apply.html with carousels")
