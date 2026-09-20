with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('Upload Different PDF', 'Upload New Document')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated button text.")
