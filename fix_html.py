import os
import glob

# Find all HTML files
html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Auto-redirect Lead Magnet
    import re
    # We want to replace document.getElementById('navbarLeadModalContent').innerHTML = `...` with window.location.href = 'hiring-blueprint.html';
    # This is tricky because of the multiline backtick string.
    pattern = re.compile(r"document\.getElementById\('navbarLeadModalContent'\)\.innerHTML = `[^`]+`;", re.DOTALL)
    content = pattern.sub("window.location.href = 'hiring-blueprint.html';", content)

    # Fix 2: Add desktop-only class to the first two links in nav-links
    # <li><a href="hiring-pipeline.html" target="_blank" class="nav-link" ...> The Playbook</a></li>
    # <li><a href="apply.html">Opportunities</a></li>
    content = content.replace('<li><a href="hiring-pipeline.html"', '<li class="desktop-only"><a href="hiring-pipeline.html"')
    content = content.replace('<li><a href="apply.html"', '<li class="desktop-only"><a href="apply.html"')
    
    # Wait, some pages might not have it exactly like that.
    # What about the chat bubble? 
    # id="chatbot-container" style="...z-index:9999;"
    content = content.replace('z-index: 9999;', 'z-index: 99999;')
    content = content.replace('z-index:9999;', 'z-index:99999;')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied HTML fixes!")
