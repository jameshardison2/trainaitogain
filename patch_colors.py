import re

def inject_style(filename, hex_main, hex_dark, hex_light):
    try:
        with open(filename, 'r') as f:
            content = f.read()
            
        style_block = f"""
<style>
  :root {{
    --primary: {hex_main} !important;
    --primary-dark: {hex_dark} !important;
    --primary-light: {hex_light} !important;
    --accent: {hex_main} !important;
  }}
</style>
"""
        # Remove any previously injected block if running multiple times
        content = re.sub(r'<style>\s*:root {\s*--primary: #[a-fA-F0-9]{6} !important;.*?}</style>', '', content, flags=re.DOTALL)
        
        content = content.replace('</head>', style_block + '</head>')
        
        with open(filename, 'w') as f:
            f.write(content)
            
        print(f"Patched {filename}")
    except FileNotFoundError:
        print(f"Skipped {filename} (not found)")

inject_style('apply.html', '#38BDF8', '#0284c7', '#e0f2fe')
inject_style('video-guides.html', '#A855F7', '#7e22ce', '#f3e8ff')
inject_style('hiring-blueprint.html', '#A855F7', '#7e22ce', '#f3e8ff')
inject_style('ai-interview.html', '#F59E0B', '#d97706', '#fef3c7')
