import os
import glob
import re

directory = '/Users/176693/Documents/trainaitogain_site_seo_ready'
files = glob.glob(os.path.join(directory, '*.html'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any chat.js, chat.js?v=X, etc with chat.js?v=12
    new_content = re.sub(r'chat\.js(\?v=\d+)?', 'chat.js?v=12', content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
print("Globally updated all chat.js references to v=12.")
