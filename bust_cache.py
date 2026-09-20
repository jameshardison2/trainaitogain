import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'chat.js?v=2' in content:
        content = content.replace('chat.js?v=2', f'chat.js?v=3')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Cache busted to v=3!")
