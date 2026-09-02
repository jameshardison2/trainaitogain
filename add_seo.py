import os
import re

seo_desc = "Get your Mercor referral, master the AI model training interview, and bypass the waitlist for high-paying RLHF jobs."

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'apply.html' and f != 'index.html']

for f_name in html_files:
    with open(f_name, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if meta description already exists
    if '<meta name="description"' in content:
        # Replace existing
        content = re.sub(
            r'<meta name="description"\s+content="[^"]*"\s*/?>',
            f'<meta name="description" content="{seo_desc}">',
            content
        )
    else:
        # Inject below <title>
        content = re.sub(
            r'(<title>.*?</title>)',
            rf'\1\n  <meta name="description" content="{seo_desc}">',
            content,
            flags=re.IGNORECASE
        )
        
    with open(f_name, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Injected SEO tags into all child HTML files.")
