import glob
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'chat.js?v=5' in content:
        content = content.replace('chat.js?v=5', 'chat.js?v=6')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Cache busted to v=6!")
