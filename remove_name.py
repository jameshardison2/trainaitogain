import os
import glob

directory = '/Users/176693/Documents/trainaitogain_site_seo_ready'
files = glob.glob(os.path.join(directory, '*.html'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the specific <p> tags containing the name
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'James Hardison II' in line:
            # We don't append this line, effectively removing it
            continue
        new_lines.append(line)
        
    new_content = '\n'.join(new_lines)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Removed name from all HTML files.")
