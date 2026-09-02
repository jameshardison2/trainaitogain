import os

old_html = """        <a class="nav-logo" href="index.html" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
          <div style="width:40px; height:40px; border-radius:8px; background:var(--primary); display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h4l3-9 5 18 3-9h5"/>
            </svg>
          </div>
          <div class="logo-text" style="display:flex; align-items:center; line-height:1.1;">
            <span style="color:var(--black); font-weight:800; font-size:18px; letter-spacing:-0.02em;">TrainAIToGain</span>
          </div>
        </a>"""

new_html = """        <a class="nav-logo" href="index.html" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
          <img src="logo.svg" alt="TrainAIToGain Logo" style="height:44px; display:block;" />
          <div class="logo-text" style="display:flex; align-items:center; line-height:1.1;">
            <span style="color:var(--black); font-weight:800; font-size:18px; letter-spacing:-0.02em;">TrainAIToGain</span>
          </div>
        </a>"""

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    if old_html in content:
        content = content.replace(old_html, new_html)
        with open(file, 'w') as f:
            f.write(content)
        print(f"Updated {file}")
    else:
        print(f"Could not find exact block in {file}")
