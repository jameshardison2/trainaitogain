import re

with open('index.html', 'r') as f:
    html = f.read()

# Replace the entire <header> element
old_header_pattern = r'<header style="padding: 60px 0 40px; background-color: var\(--white\); overflow: hidden;">.*?</header>'
new_header = """<header style="padding: 100px 0 80px; background-color: #f8fafc; overflow: hidden; text-align: center;">
    <div class="container" style="max-width: 900px; margin: 0 auto;">
          <div style="color: var(--primary); font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 24px; display: inline-block; background: var(--primary-light); padding: 8px 16px; border-radius: 100px;">
            AI OPPORTUNITIES &middot; REAL PAY
          </div>
          <h1 class="hero-h1" style="font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 24px;">
            Your expertise is worth <br/>
            <span style="color: var(--primary);">$70&ndash;120/hr</span> to the AI labs.
          </h1>
          <p style="font-size: 22px; color: #475569; line-height: 1.6; margin-bottom: 48px; max-width: 700px; margin-left: auto; margin-right: auto;">
            Leading AI labs pay skilled professionals to review and grade AI outputs in their field. Doctors, lawyers, engineers, researchers, coders - remote, flexible, and open globally.
          </p>
          
          <div class="hero-btn-container" style="display: flex; gap: 16px; margin-bottom: 64px; justify-content: center;">
            <a href="hiring-pipeline.html" target="_blank" style="background: var(--primary); color: #fff; text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 40px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 8px 24px rgba(16,185,129,0.25);">
              Let's Get You Hired ➔
            </a>
            <a href="apply.html" style="background: #fff; color: #0f172a; text-decoration: none; font-weight: 700; font-size: 18px; padding: 18px 40px; border-radius: 8px; border: 1px solid #cbd5e1; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              Apply Now
            </a>
          </div>
          
          <div style="display: flex; gap: 40px; padding-top: 40px; border-top: 1px solid #e2e8f0; justify-content: center; flex-wrap: wrap;">
                <div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:4px;">342</div><div style="font-size:14px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Active Roles</div></div>
                <div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:4px;">92%</div><div style="font-size:14px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Invite Rate</div></div>
                <div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:4px;">$95/hr</div><div style="font-size:14px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Avg. Match</div></div>
                <div style="text-align: center;"><div style="font-size:32px; font-weight:800; color:#0f172a; margin-bottom:4px;">10k+</div><div style="font-size:14px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Hires/Year</div></div>
          </div>
    </div>
  </header>"""

html = re.sub(old_header_pattern, new_header, html, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(html)
print("Updated header")
