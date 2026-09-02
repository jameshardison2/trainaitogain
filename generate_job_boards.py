import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

def generate_job_board(title, desc, jobs):
    cards_html = ""
    for job in jobs:
        label = f"job_board_{job['tag']}"
        cards_html += f"""
        <div class="feature-card opp-card" style="background:var(--gray-50); border:1px solid var(--gray-200); padding:24px; display:flex; flex-direction:column; position:relative;">
          {f'<div style="position:absolute; top:-12px; right:20px; background:#ef4444; color:white; font-size:11px; font-weight:800; padding:4px 10px; border-radius:100px; box-shadow:0 4px 12px rgba(239, 68, 68, 0.3);">HOT ROLE</div>' if job.get('hot') else ''}
          <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;">
            <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;" title="Industry Domain Tag">{job['tag']}</div>
            <div style="color:var(--primary); font-weight:800; font-size:18px;">{job['pay']}</div>
          </div>
          <h3 style="font-size:20px; margin-bottom:8px; color:var(--black); line-height:1.2;">{job['title']}</h3>
          <p style="color:var(--gray-500); font-size:14px; margin-bottom:20px; flex-grow:1; line-height:1.6;">{job['desc']}</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:24px;">
            {''.join([f'<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">{skill}</span>' for skill in job['skills']])}
          </div>
          <a href="https://t.mercor.com/wbPMF" target="_blank" style="display:block; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; text-decoration:none;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';" onclick="if(typeof gtag === 'function') gtag('event', 'apply_click', {{'event_category':'referral', 'event_label':'{label}'}});">Apply via Mercor</a>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{title} — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 64px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:48px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">{title}</h1>
    <p style="font-size:18px; color:var(--gray-500);">{desc}</p>
  </div>
</section>

<section class="section" style="padding-top:24px;">
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--gray-200);">
      <h2 style="font-size:20px; font-weight:700;">Open Pipelines</h2>
      <div style="font-size:14px; color:var(--gray-500); font-weight:600;"><span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; margin-right:6px; box-shadow:0 0 8px #10b981;"></span>Actively Hiring</div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
      {cards_html}
    <div id="load-more-container" style="display:none;">
      <button class="btn-load-more" onclick="loadMore()">Load More Opportunities</button>
    </div>
  </div>
</section>

{footer}

<script>
  document.addEventListener("DOMContentLoaded", () => {{
    const cards = document.querySelectorAll('.opp-card');
    const loadMoreContainer = document.getElementById('load-more-container');
    let visibleCount = 4;
    
    if(cards.length > visibleCount) {{
      loadMoreContainer.style.display = 'block';
      for(let i = visibleCount; i < cards.length; i++) {{
        cards[i].style.display = 'none';
      }}
    }}
    
    window.loadMore = function() {{
      const hiddenCards = Array.from(cards).filter(c => c.style.display === 'none');
      for(let i = 0; i < Math.min(4, hiddenCards.length); i++) {{
        hiddenCards[i].style.display = 'flex';
      }}
      if(hiddenCards.length <= 4) {{
        loadMoreContainer.style.display = 'none';
      }}
    }};
  }});
</script>

</body>
</html>
"""

# SOFTWARE
software_jobs = [
    {"title": "Senior Python / ML Evaluator", "pay": "$150/hr", "tag": "SOFTWARE", "hot": True, "desc": "Evaluate complex ML infrastructure code and Python algorithms for next-gen models.", "skills": ["Python", "PyTorch", "System Design"]},
    {"title": "C++ Systems & Performance", "pay": "$130/hr", "tag": "SOFTWARE", "desc": "Review high-performance C++ code, memory management, and concurrency models.", "skills": ["C++", "Memory Profiling", "Algorithms"]},
    {"title": "Frontend / React Architecture", "pay": "$100/hr", "tag": "SOFTWARE", "desc": "Assess complex React applications, state management, and modern TS patterns.", "skills": ["React", "TypeScript", "Next.js"]},
    {"title": "Data Engineering / SQL Architect", "pay": "$120/hr", "tag": "SOFTWARE", "hot": True, "desc": "Evaluate distributed database queries, ETL pipelines, and warehouse structures.", "skills": ["SQL", "Snowflake", "Spark"]},
    {"title": "Security & Cryptography", "pay": "$140/hr", "tag": "SOFTWARE", "desc": "Review codebase vulnerabilities, cryptographic implementations, and secure design.", "skills": ["Cybersecurity", "Rust", "Cryptography"]},
    {"title": "General SWE / Leetcode Master", "pay": "$90/hr", "tag": "SOFTWARE", "desc": "Solve and evaluate advanced algorithmic challenges (competitive programming).", "skills": ["Algorithms", "Data Structures", "Java"]}
]

with open("role-software.html", "w") as f:
    f.write(generate_job_board("Software & Engineering Roles", "Mercor is actively seeking Senior SWEs to evaluate advanced code and train LLMs. Don't apply as a generalist—target your specific stack below.", software_jobs))

# MEDICAL
medical_jobs = [
    {"title": "Oncology AI Reviewer", "pay": "$120/hr", "tag": "MEDICAL", "hot": True, "desc": "Train models on diagnosing and creating treatment plans for complex oncology cases.", "skills": ["MD", "Oncology", "Diagnostics"]},
    {"title": "Neurology / BCI Annotator", "pay": "$150/hr", "tag": "MEDICAL", "desc": "Evaluate neuro-imaging and diagnostic criteria for Brain-Computer Interface models.", "skills": ["Neurology", "MRI/CT", "Clinical Research"]},
    {"title": "General Practitioner Evaluator", "pay": "$80/hr", "tag": "MEDICAL", "desc": "Assess primary care diagnostic models and patient interaction logic.", "skills": ["MD/DO", "Primary Care", "Triage"]},
    {"title": "Pharmacology Expert", "pay": "$100/hr", "tag": "MEDICAL", "desc": "Review drug interaction models, dosing algorithms, and contraindications.", "skills": ["PharmD", "Pharmacokinetics", "Chemistry"]},
    {"title": "Surgical Methodology", "pay": "$130/hr", "tag": "MEDICAL", "hot": True, "desc": "Evaluate procedural steps and risk assessment models for robotic surgery AI.", "skills": ["Surgeon", "Anatomy", "Risk Models"]}
]

with open("role-medical.html", "w") as f:
    f.write(generate_job_board("Medical & Clinical Roles", "Mercor needs verified MDs, DOs, and clinical specialists to align healthcare AI models safely and accurately.", medical_jobs))

# FINANCE
finance_jobs = [
    {"title": "Quant Dev / Algo Trader", "pay": "$150/hr", "tag": "FINANCE", "hot": True, "desc": "Evaluate complex trading algorithms and quantitative pricing models.", "skills": ["Quantitative Finance", "Python", "Stochastic Calculus"]},
    {"title": "Actuarial Science Reviewer", "pay": "$100/hr", "tag": "FINANCE", "desc": "Assess risk models, life tables, and insurance underwriting logic for AI systems.", "skills": ["FSA/FCAS", "Risk Modeling", "Statistics"]},
    {"title": "Corporate Finance / M&A", "pay": "$80/hr", "tag": "FINANCE", "desc": "Evaluate financial statement analysis and valuation models (DCF, LBO).", "skills": ["M&A", "Financial Modeling", "Accounting"]},
    {"title": "PhD Level Mathematician", "pay": "$120/hr", "tag": "FINANCE", "desc": "Review core mathematical logic, proofs, and theoretical framework generations.", "skills": ["PhD Mathematics", "Proofs", "Logic"]},
    {"title": "Tax Strategy & Compliance", "pay": "$90/hr", "tag": "FINANCE", "desc": "Train models on complex international tax codes and corporate compliance structures.", "skills": ["CPA", "Tax Law", "Auditing"]}
]

with open("role-finance.html", "w") as f:
    f.write(generate_job_board("Finance & Quantitative Roles", "Mercor is recruiting Quants, Actuaries, and Math PhDs to ensure financial AI models are mathematically flawless.", finance_jobs))

print("Successfully generated robust job boards for Software, Medical, and Finance.")
