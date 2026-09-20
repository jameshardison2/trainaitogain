import glob
import re

with open('/Users/176693/Documents/trainaitogain_site/index.html', 'r') as f:
    orig_content = f.read()

# Extract the original nav from trainaitogain_site/index.html
orig_nav_match = re.search(r'(<header.*?</header>)', orig_content, re.DOTALL | re.IGNORECASE)
if not orig_nav_match:
    print("Could not find original nav.")
    exit(1)
    
orig_nav = orig_nav_match.group(1)

html_files = glob.glob('/Users/176693/Documents/trainaitogain_site_seo_ready/*.html')
nav_pattern = re.compile(r'<header class="nav">.*?</header>', re.DOTALL)

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    new_content = nav_pattern.sub(orig_nav, content)
    
    with open(file, 'w') as f:
        f.write(new_content)

print("Restored original nav to all pages.")
