import glob
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'prep-hub.html' in file or 'ai-interview.html' in file:
        pass
