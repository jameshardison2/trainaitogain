import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_btn = """  <!-- Pipeline Pagination -->
  <div style="display:flex; justify-content:space-between; margin-bottom:64px; padding-top:32px; border-top:1px solid var(--gray-200);">
    <a href="hiring-pipeline.html" class="btn-primary" style="background:var(--gray-100); color:var(--gray-700); border:1px solid var(--gray-200); text-decoration:none;">⬅ Back to Pipeline Overview</a>
    <a href="ai-interview.html" class="btn-primary" style="text-decoration:none;">Next Step: Interview Prep ➔</a>
  </div>"""

replace_btn = """  <!-- Pipeline Pagination -->
  <div style="display:flex; justify-content:space-between; margin-bottom:64px; padding-top:32px; border-top:1px solid var(--gray-200);">
    <a href="hiring-pipeline.html" class="btn-primary" style="background:var(--gray-100); color:var(--gray-700); border:1px solid var(--gray-200); text-decoration:none;">⬅ Back to Pipeline Overview</a>
  </div>"""

if find_btn in html:
    html = html.replace(find_btn, replace_btn)
else:
    print("Warning: Could not find pagination buttons")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed redundant pagination button")
