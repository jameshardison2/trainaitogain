import re
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Remove anything that looks like a quote block in dashboard
    html = re.sub(r'<div style="background:var\(--gray-50\); border-left:4px solid var\(--primary\); padding:24px; border-radius:0 var\(--radius-md\) var\(--radius-md\) 0; margin-top: 48px; text-align: left;">.*?</div>', '', html, flags=re.DOTALL)
    
    # Remove Eric Thomas in resume-ats-guide
    html = re.sub(r'<!-- Motivational Quote -->.*?</div>', '', html, flags=re.DOTALL)

    # Any other leftover James N. Hardison or Eric Thomas
    html = re.sub(r'<div[^>]*>.*?James N\. Hardison.*?</div>', '', html, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

print("Double tapped the quotes")
