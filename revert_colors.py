import re

files_to_clean = ['apply.html', 'video-guides.html', 'hiring-blueprint.html', 'ai-interview.html']

for filename in files_to_clean:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        # Remove the injected style block
        content = re.sub(r'<style>\s*:root {\s*--primary: #[a-fA-F0-9]{6} !important;.*?}</style>', '', content, flags=re.DOTALL)
        
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Cleaned {filename}")
    except FileNotFoundError:
        pass
