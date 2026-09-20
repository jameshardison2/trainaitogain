import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_footer = """  <div style="grid-column: 1 / -1; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
      <p style="color: var(--gray-400); font-size: 14px; margin: 0;">Complete the simulation to unlock Step 3, or skip ahead if you must.</p>
      <a href="post-hire.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">Skip to Post-Hire Guide ➔</a>
  </div>"""

replace_footer = """  <div style="grid-column: 1 / -1; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
      <a href="resume-ats-guide.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">⬅ Back to ATS Scanner</a>
      <a href="post-hire.html" style="color: var(--gray-400); text-decoration: none; font-size: 14px; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-400)'">Skip to Post-Hire Guide ➔</a>
  </div>"""

if find_footer in html:
    html = html.replace(find_footer, replace_footer)
else:
    print("Warning: Could not find pagination footer in ai-interview.html")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed pagination footer in ai-interview.html")
