import os
import glob
import re

directory = '/Users/176693/Documents/trainaitogain_site_seo_ready'
files = glob.glob(os.path.join(directory, '*.html'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace em dashes with regular hyphens
    content = content.replace('&mdash;', '-')
    content = content.replace('—', '-')
    
    # Specific fix for index.html text size
    if 'index.html' in file:
        old_p = '<p style="font-size: 18px; color: #666; line-height: 1.6; margin-bottom: 40px; max-width: 480px;">'
        new_p = '<p style="font-size: 22px; color: #555; line-height: 1.6; margin-bottom: 40px; max-width: 520px;">'
        content = content.replace(old_p, new_p)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Dashes removed and text size increased.")
