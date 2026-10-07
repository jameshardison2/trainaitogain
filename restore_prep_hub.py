import glob

html_files = glob.glob('*.html')

for file in html_files:
    if file in ['ai-interview.html', 'prep-hub.html']:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # We want to restore links to prep-hub.html.
    # Where were they? "Next Step: AI Mock Interview"
    html = html.replace('ai-interview.html', 'prep-hub.html')
    html = html.replace('Next Step: AI Mock Interview', 'Next Step: AI Interview Prep')
    html = html.replace('Launch Live Simulator', 'Enter the Interview Prep Hub')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
