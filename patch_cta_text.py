import re

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace(
    '<p style="color: var(--gray-500); font-size: 14px; margin-top: 20px;">We\'ll email you the exact fill-in-the-blank script to read during your video interview.</p>',
    '<p style="color: #94a3b8; font-size: 15px; margin-top: 24px;">We\'ll email you the exact fill-in-the-blank script to read during your video interview.</p>'
)

with open('index.html', 'w') as f:
    f.write(html)
