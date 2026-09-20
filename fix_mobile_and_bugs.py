import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix grid overflowing on mobile by dropping minmax from 400px to 300px
html = html.replace(
    '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 80px; align-items: center;">',
    '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 40px; align-items: center;">'
)

# Fix massive font size on mobile by adding a responsive class to the h1
if '<h1 style="font-size: 56px; font-weight: 800;' in html:
    html = html.replace(
        '<h1 style="font-size: 56px; font-weight: 800;', 
        '<h1 class="hero-h1" style="font-weight: 800;'
    )

# Fix overflowing floating pills by positioning them safely within the boxes on mobile
html = html.replace('right: -24px;', 'right: -12px;')
html = html.replace('left: -24px;', 'left: -12px;')
html = html.replace('padding: 100px 0 80px;', 'padding: 60px 0 40px;')

# Inject CSS for hero-h1
if '<style>' not in html:
    html = html.replace('</head>', '\n<style>\n  .hero-h1 { font-size: 56px; line-height: 1.1; }\n  @media (max-width: 600px) {\n    .hero-h1 { font-size: 40px !important; }\n    .hero-btn-container { flex-direction: column; width: 100%; }\n    .hero-btn-container a { width: 100%; text-align: center; justify-content: center; }\n  }\n</style>\n</head>')

# Add hero-btn-container to the flex div containing the buttons
html = html.replace('<div style="display: flex; gap: 16px; margin-bottom: 32px;">', '<div class="hero-btn-container" style="display: flex; gap: 16px; margin-bottom: 32px;">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Fixed mobile issues on index.html.")
