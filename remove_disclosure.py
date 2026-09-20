import os
import glob
import re

directory = '/Users/176693/Documents/trainaitogain_site_seo_ready'
files = glob.glob(os.path.join(directory, '*.html'))

text1 = "Independent referral partner. I earn a referral credit when someone I refer is hired. Saying so up front.<br><br>"
text2 = "Independent resource. Not affiliated with, authorized by, sponsored by, or endorsed by Mercor."
text3 = "Independent referral partner. I earn a referral credit when someone I refer is hired. Saying so up front."

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if text1 in content or text2 in content or text3 in content:
        content = content.replace(text1, '')
        content = content.replace(text2, '')
        content = content.replace(text3, '')
        
        # Clean up empty <small> tags
        content = re.sub(r'<small[^>]*>\s*</small>', '', content, flags=re.MULTILINE|re.DOTALL)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Disclosure removed from all footers.")
