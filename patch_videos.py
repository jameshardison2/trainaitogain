import re

with open('video-guides.html', 'r') as f:
    content = f.read()

# 1. Replace the entire video-grid and the back button
new_grid = """
      <div class="video-grid" style="margin-bottom: 80px;">
        <div class="video-card">
          <div class="video-container">
            <iframe src="https://www.youtube.com/embed/h18G7KP4zk8" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div style="padding: 16px;">
            <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:800; color:var(--black);">How to PASS the MICRO1 interview</h3>
            <p style="margin:0; font-size:13px; color:var(--gray-500); line-height:1.4;">Essential walkthrough for candidates targeting Micro1 roles ($70-$140/hr). Watch this real-world breakdown to boost your conversion confidence.</p>
          </div>
        </div>

        <div class="video-card">
          <div class="video-container">
            <iframe src="https://www.youtube.com/embed/NrAdn2lb8Bk" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div style="padding: 16px;">
            <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:800; color:var(--black);">Mercor Expert LIVE Experience</h3>
            <p style="margin:0; font-size:13px; color:var(--gray-500); line-height:1.4;">Highly relevant live interview breakdown. Exact question structures and pacing expectations for the Mercor AI assessment.</p>
          </div>
        </div>

        <div class="video-card">
          <div class="video-container">
            <iframe src="https://www.youtube.com/embed/vC4wlYS2bkY" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div style="padding: 16px;">
            <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:800; color:var(--black);">AI Interview Tips: What to Expect</h3>
            <p style="margin:0; font-size:13px; color:var(--gray-500); line-height:1.4;">Great foundational baseline from Indeed for any candidate who feels intimidated by automated AI video screening systems.</p>
          </div>
        </div>
      </div>
"""

content = re.sub(r'<div class="video-grid">.*?</div>\s*<div style="text-align:center; margin-top:64px;">.*?</div>', new_grid, content, flags=re.DOTALL)

# 2. Add Sticky Footer Navigation
sticky_nav = """
  <!-- Sticky Bottom Navigation -->
  <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: var(--white); border-top: 1px solid var(--gray-200); padding: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 1000; display: flex; justify-content: center; align-items: center; gap: 16px;">
      <a href="hiring-pipeline.html" style="color: var(--gray-500); text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-500)'">⬅ Back to Pipeline</a>
      <a href="ai-interview.html" class="btn-primary" style="text-decoration: none; font-size: 14px; padding: 12px 24px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">Proceed to AI Mock Interview ➔</a>
  </div>
</body>
"""

content = content.replace('</body>', sticky_nav)

with open('video-guides.html', 'w') as f:
    f.write(content)

print("Updated video grid and navigation")
