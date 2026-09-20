with open('apply.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update all the 50 job cards
html = html.replace('Have your PDF resume ready', 'Have your resume ready')

# 2. Update the resume uploader text
html = html.replace('Upload your resume (PDF)', 'Upload your resume')
html = html.replace('Upload PDF Resume', 'Upload Resume')

# 3. If there is a subtext "Max size: 5MB", we can just leave it or change it to "PDF or DOC, Max size: 5MB"
html = html.replace('Max size: 5MB', 'PDF or DOCX (Max: 5MB)')

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Removed strict PDF language from apply.html.")
