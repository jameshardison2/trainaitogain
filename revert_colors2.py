import re

files_to_clean = ['apply.html', 'video-guides.html', 'hiring-blueprint.html', 'ai-interview.html']

for filename in files_to_clean:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        # Simple string replacement since we know the exact blocks
        if '--primary: #38BDF8 !important;' in content:
            content = re.sub(r'<style>\s*:root {\s*--primary: #38BDF8 !important;\s*--primary-dark: #0284c7 !important;\s*--primary-light: #e0f2fe !important;\s*--accent: #38BDF8 !important;\s*}\s*</style>', '', content)
            print(f"Cleaned apply.html")
            
        if '--primary: #A855F7 !important;' in content:
            content = re.sub(r'<style>\s*:root {\s*--primary: #A855F7 !important;\s*--primary-dark: #7e22ce !important;\s*--primary-light: #f3e8ff !important;\s*--accent: #A855F7 !important;\s*}\s*</style>', '', content)
            print(f"Cleaned purple")
            
        if '--primary: #F59E0B !important;' in content:
            content = re.sub(r'<style>\s*:root {\s*--primary: #F59E0B !important;\s*--primary-dark: #d97706 !important;\s*--primary-light: #fef3c7 !important;\s*--accent: #F59E0B !important;\s*}\s*</style>', '', content)
            print(f"Cleaned orange")

        with open(filename, 'w') as f:
            f.write(content)
    except FileNotFoundError:
        pass
