import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_buttons = """          <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <a href="guide-download.html" style="background: #F06A26; color: #fff; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; display: inline-flex; align-items: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(240, 106, 38, 0.2);">
              Download Guide PDF
            </a>
            <a href="hiring-pipeline.html" style="background: #fff; color: #111; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-flex; align-items: center; transition: all 0.2s;">
              Apply Now
            </a>
          </div>"""

new_buttons = """          <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <a href="hiring-pipeline.html" style="background: #F06A26; color: #fff; text-decoration: none; font-weight: 800; font-size: 18px; padding: 16px 36px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(240, 106, 38, 0.2);">
              Let's Get You Hired ➔
            </a>
            <a href="guide-download.html" style="background: #fff; color: #111; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-flex; align-items: center; transition: all 0.2s;">
              Download Guide PDF
            </a>
          </div>"""

if old_buttons in html:
    html = html.replace(old_buttons, new_buttons)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Buttons successfully swapped and styled.")
else:
    print("Could not find old buttons block.")
