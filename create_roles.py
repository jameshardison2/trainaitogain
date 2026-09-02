import re

def create_role_page(filename, title, eyebrow, heading, sub, content):
    with open('ai-interview.html', 'r') as f:
        html = f.read()
    
    # Update title
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html)
    html = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{sub}">', html)
    html = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', html)
    html = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{sub}">', html)
    html = re.sub(r'<meta name="twitter:title" content=".*?">', f'<meta name="twitter:title" content="{title}">', html)
    html = re.sub(r'<meta name="twitter:description" content=".*?">', f'<meta name="twitter:description" content="{sub}">', html)
    
    # Update hero
    html = re.sub(r'<p class="hero-eyebrow">.*?</p>', f'<p class="hero-eyebrow">{eyebrow}</p>', html)
    html = re.sub(r'<h1 class="hero-heading">.*?</h1>', f'<h1 class="hero-heading">{heading}</h1>', html)
    html = re.sub(r'<p class="hero-sub">.*?</p>', f'<p class="hero-sub">{sub}</p>', html)
    
    # Replace content between <div class="article-content"> and <div style="text-align:center; margin-top:48px;">
    pattern = r'(<div class="article-content">).*?(<div style="text-align:center; margin-top:48px;">)'
    html = re.sub(pattern, f'\\1\n{content}\n\\2', html, flags=re.DOTALL)
    
    # Remove the "Back to FAQs" link
    html = re.sub(r'<a href="index.html".*?Back to all FAQs</a>', '', html)
    
    with open(filename, 'w') as f:
        f.write(html)
    print(f"Created {filename}")

content_software = """
  <h2>The Reality of the $150/hr SWE Role</h2>
  <p>Competitors like to pretend they have a direct link to this specific job. <strong>They don't.</strong> Mercor uses a single, massive talent pool. You submit your resume, and their AI decides if you are qualified to take the SWE evaluator interview.</p>
  <p>If you just upload a generic resume, you will likely get routed to a lower-paying generic data annotation role.</p>
  
  <h2>The Cheat Code: How to trigger the SWE interview</h2>
  <ul>
    <li><strong>Highlight Advanced Python/C++:</strong> The AI scans for explicit mentions of deep backend languages and algorithms.</li>
    <li><strong>Emphasize Leetcode/Competitive Programming:</strong> If you have experience in competitive programming, state it clearly. The $150/hr roles involve evaluating complex, competitive-level algorithmic solutions.</li>
    <li><strong>Mention AI Model Training:</strong> Use keywords like "RLHF", "Model Evaluation", or "LLM alignment".</li>
  </ul>

  <div class="callout calm">
    <span class="k">What to expect</span>
    <p>If your resume successfully triggers the SWE track, you will be invited to a technical AI interview involving a whiteboard session and complex coding questions. <strong>Make sure your resume is tailored BEFORE you click apply below.</strong></p>
  </div>
"""

content_medical = """
  <h2>The Reality of the $100/hr Medical Role</h2>
  <p>Competitors like to pretend they have a direct link to this specific job. <strong>They don't.</strong> Mercor uses a single, massive talent pool. You submit your resume, and their AI decides if you are qualified to take the clinical evaluator interview.</p>
  <p>If you just upload a generic resume, you will likely get routed to a lower-paying data annotation role.</p>
  
  <h2>The Cheat Code: How to trigger the Medical interview</h2>
  <ul>
    <li><strong>Explicit Board Certifications:</strong> The AI looks for absolute proof of qualification. Explicitly list "MD", "DO", or your specific board certifications at the very top.</li>
    <li><strong>Diagnostic & Clinical Reasoning:</strong> Highlight experience in complex diagnostics. You will be evaluating AI models on their ability to diagnose based on patient data.</li>
    <li><strong>Medical Data Annotation:</strong> Use keywords like "EHR data", "Clinical trial evaluation", or "Medical AI alignment".</li>
  </ul>

  <div class="callout calm">
    <span class="k">What to expect</span>
    <p>If your resume successfully triggers the Medical track, your AI interview will heavily focus on clinical reasoning and ethical medical evaluation. <strong>Make sure your resume is tailored BEFORE you click apply below.</strong></p>
  </div>
"""

content_finance = """
  <h2>The Reality of the $120/hr Finance Role</h2>
  <p>Competitors like to pretend they have a direct link to this specific job. <strong>They don't.</strong> Mercor uses a single, massive talent pool. You submit your resume, and their AI decides if you are qualified to take the Quant/Finance evaluator interview.</p>
  <p>If you just upload a generic resume, you will likely get routed to a lower-paying data annotation role.</p>
  
  <h2>The Cheat Code: How to trigger the Finance interview</h2>
  <ul>
    <li><strong>Highlight Quantitative Analysis:</strong> The AI scans for explicit mentions of algorithmic trading, stochastic calculus, or heavy financial modeling.</li>
    <li><strong>Emphasize Mathematics/Statistics:</strong> State your advanced degrees (Master's or PhD) in Math, Physics, or Financial Engineering clearly.</li>
    <li><strong>Mention AI/Data Science:</strong> Use keywords like "Financial data modeling", "Risk model evaluation", or "Predictive analytics".</li>
  </ul>

  <div class="callout calm">
    <span class="k">What to expect</span>
    <p>If your resume successfully triggers the Finance track, your AI interview will involve complex mathematical reasoning and financial model verification. <strong>Make sure your resume is tailored BEFORE you click apply below.</strong></p>
  </div>
"""

create_role_page('role-software.html', 'How to get the $150/hr SWE Role — TrainAIToGain', 'Software', 'How to get the <em>$150/hr</em> SWE Role.', "Don't fall for fake job links. Here is how to actually format your resume to get flagged for the Senior SWE Evaluator role.", content_software)
create_role_page('role-medical.html', 'How to get the $100/hr Medical Role — TrainAIToGain', 'Medical', 'How to get the <em>$100/hr</em> Medical Role.', "Don't fall for fake job links. Here is how to actually format your resume to get flagged for the MDs & Clinicians role.", content_medical)
create_role_page('role-finance.html', 'How to get the $120/hr Finance Role — TrainAIToGain', 'Finance', 'How to get the <em>$120/hr</em> Finance Role.', "Don't fall for fake job links. Here is how to actually format your resume to get flagged for the Quant & Math Experts role.", content_finance)
