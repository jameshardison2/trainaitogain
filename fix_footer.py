import os
import glob
import re

directory = '/Users/176693/Documents/trainaitogain_site_seo_ready'
files = glob.glob(os.path.join(directory, '*.html'))

old_footer_div = """        <div style="max-width:600px;">
          
        </div>"""

new_footer_div = """        <div style="max-width:600px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="logo.svg" style="height:24px; filter: brightness(0) invert(1);" alt="TrainAIToGain Logo" />
            <span style="color:white; font-weight:800; font-size:18px; letter-spacing:-0.02em;">TrainAIToGain</span>
          </div>
          <p style="color:var(--gray-400); font-size:14px; margin:0;">&copy; 2026 TrainAIToGain. All rights reserved.</p>
          <a href="disclosure.html" style="color:var(--gray-500); text-decoration:none; font-size:13px; font-weight:500; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-500)'">Affiliate Disclosure</a>
        </div>"""

# Fallback pattern if whitespace is different
fallback_pattern = r'<div style="max-width:600px;">\s*</div>'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_footer_div in content:
        content = content.replace(old_footer_div, new_footer_div)
    else:
        content = re.sub(fallback_pattern, new_footer_div, content, flags=re.MULTILINE|re.DOTALL)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Footers populated globally.")
