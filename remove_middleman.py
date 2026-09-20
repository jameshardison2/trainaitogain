import re
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Change any links to prep-hub.html to point directly to ai-interview.html
    html = html.replace('prep-hub.html', 'ai-interview.html')
    
    # Change "Next Step: AI Interview Prep" -> "Next Step: AI Mock Interview"
    html = html.replace('Next Step: AI Interview Prep', 'Next Step: AI Mock Interview')
    html = html.replace('Enter the Interview Prep Hub', 'Launch Live Simulator')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

print("Removed middleman prep-hub page and linked directly to the simulator.")
