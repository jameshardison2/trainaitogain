import glob

html_files = glob.glob('*.html')

for file in html_files:
    if file == 'prep-hub.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # The previous agent did:
    # html = html.replace('prep-hub.html', 'ai-interview.html')
    # html = html.replace('Next Step: AI Interview Prep', 'Next Step: AI Mock Interview')
    # html = html.replace('Enter the Interview Prep Hub', 'Launch Live Simulator')
    
    # Let's restore them where it makes sense. Wait, in what context did they exist?
    pass
