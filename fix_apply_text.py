import re

with open('apply.html', 'r') as f:
    content = f.read()

content = content.replace(
    '<p style="font-size:16px; color:var(--gray-500); margin-bottom: 32px;">Select your area of expertise below to browse active hiring waves and start your application.</p>',
    '<p style="font-size:16px; color:var(--gray-500); margin-bottom: 32px;">Click Apply to be directed to the official Mercor application page. Referrals are tracked automatically.</p>'
)

old_resume_text = """          <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">Not sure which role fits you best?</h3>
          <div style="color:var(--gray-700); font-size:15px; margin: 0; line-height:1.6; display:flex; flex-direction:column; gap:6px;">
            <div><strong style="color:var(--primary);">1.</strong> Drop your PDF resume here.</div>
            <div><strong style="color:var(--primary);">2.</strong> Our AI will securely scan your skills in seconds.</div>
            <div><strong style="color:var(--primary);">3.</strong> We will highlight the exact jobs below that you have the highest chance of winning!</div>
          </div>"""

new_resume_text = """          <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">✨ Check if your resume matches these roles</h3>
          <div style="color:var(--gray-700); font-size:15px; margin: 0; line-height:1.6; display:flex; flex-direction:column; gap:6px;">
            <div style="margin-bottom:8px;">Upload your resume to see which roles you have the highest chance of landing.</div>
          </div>"""

content = content.replace(old_resume_text, new_resume_text)

with open('apply.html', 'w') as f:
    f.write(content)
print("apply.html text fixed")
