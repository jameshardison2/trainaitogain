import glob
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'resume-ats-guide.html' in file or 'dashboard.html' in file:
        pass
