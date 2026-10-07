import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Hero Block
hero_regex = re.compile(r'<!-- ─── Pipeline Hero ─────────────────────────────────────────── -->.*?<!-- Pipeline Steps -->', re.DOTALL)
new_hero = """<!-- ─── Pipeline Hero ─────────────────────────────────────────── -->
  <header style="padding: 40px 0 40px; background-color: var(--white); border-bottom:1px solid var(--gray-200); text-align:center;">
    <div class="container" style="max-width: 800px;">
      
      <h1 style="font-size:32px; font-weight:800; color:var(--black); letter-spacing:-0.02em; line-height:1.2; margin-bottom:16px;">
        The AI Hiring Playbook
      </h1>
      <p style="font-size:18px; color:var(--gray-700); line-height:1.6; margin-bottom:24px; max-width:600px; margin-left:auto; margin-right:auto;">
        Reverse-engineered from thousands of successful applications. Follow these 3 steps to bypass the AI filters and secure your contract.
      </p>
      
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <a href="apply.html" style="display:inline-flex; align-items:center; gap:8px; padding:14px 28px; font-size:16px; text-decoration:none; color:var(--gray-700); background:var(--gray-100); border:1px solid var(--gray-200); border-radius:8px; font-weight:700; transition:all 0.2s;" onmouseover="this.style.background='var(--gray-200)'; this.style.color='var(--black)'" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)'">
          Skip prep and view open opportunities ➔
        </a>
      </div>
    </div>
  </header>

  <!-- Pipeline Steps -->"""
content = hero_regex.sub(new_hero, content)

# 2. Update the Steps
steps_regex = re.compile(r'<!-- Step 1 -->.*<div style="text-align:center; margin-top: 80px; padding: 48px; background: rgba\(16,185,129,0\.05\); border: 1px solid var\(--primary\); border-radius: 16px;">.*?</div>', re.DOTALL)

new_steps = """<!-- Step 1: Profile & Resume -->
      <div class="pipeline-step" id="step1">
        <div class="step-number">1</div>
        <div class="step-content">
          <div style="display:inline-block; background:var(--gray-100); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Time: 6 Mins</div>
          <h2>Create Profiles & Optimize Resume</h2>
          <p>Before you practice the AI interview, secure your spot in the hiring networks by creating your free applicant profiles. AI labs filter out 90% of applicants instantly—make sure to run your resume through our live scanner so you have the exact "keyword density matrix" they scan for.</p>
          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:24px;">
              <a href="post-hire.html" class="btn-step" style="margin-top:0;">1. Create Free Profiles ➔</a>
              <a href="resume-ats-guide" class="btn-step" style="margin-top:0; background:var(--gray-700);">2. Launch AI Resume Optimizer ➔</a>
          </div>
        </div>
      </div>

      <!-- Step 2: AI Interview -->
      <div class="pipeline-step" id="step2">
        <div class="step-number">2</div>
        <div class="step-content">
          <div style="display:inline-block; background:var(--gray-100); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Time: 15 Mins</div>
          <h2>Ace the AI Interview</h2>
          <p>Once your resume passes, you're invited to a one-way recorded video interview evaluated entirely by an AI model. Master the "uncanny valley" of talking to a bot. Inside the Prep Hub, we break down exactly what the AI looks for in your eye contact, audio cadence, and technical reasoning.</p>
          <a href="prep-hub.html" class="btn-step">Enter the Interview Prep Hub ➔</a>
          
          <div style="margin-top:24px; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; display:flex; align-items:flex-start; gap:12px;">
            <div style="font-size:16px; flex-shrink:0;">💡</div>
            <div>
              <p style="margin:0 0 8px 0; font-size:14px; color:var(--gray-700); line-height:1.5;"><strong>Pro Tip:</strong> 84% of candidates fail here because the AI portal is glitchy. We highly recommend installing our <a href="hiring-blueprint.html" style="color:var(--primary); font-weight:700; text-decoration:none;">Free Hiring Blueprint ➔</a> so you are fully prepared for the AI before you start.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: FAQ & CTA -->
      <div class="pipeline-step" id="step3" style="background:#f8fafc; border-color:#e2e8f0; margin-top:64px;">
        <div class="step-number" style="background:var(--primary); color:white; border-color:var(--primary); box-shadow:0 0 0 1px var(--primary-dark);">3</div>
        <div class="step-content">
          <div style="display:inline-block; background:var(--gray-200); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Final Step</div>
          <h2>Review FAQ & Start Earning</h2>
          <p>Read our comprehensive FAQ to get clarity on payment structures and expectations, then choose your domain to enter the hiring pipeline!</p>
          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:24px;">
              <a href="is-it-worth-it.html" class="btn-step" style="margin-top:0; background:var(--gray-600);">1. View FAQ & Expectations ➔</a>
              <a href="apply.html" class="btn-step" style="margin-top:0; background:var(--primary);">2. View Opportunities ➔</a>
          </div>
        </div>
      </div>"""

content = steps_regex.sub(new_steps, content)

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(content)
