import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix subtitle
html = html.replace(
    "Paste your resume text below to see if you have the required keywords to pass the filter.",
    "Upload your PDF resume below to see if you have the required keywords to pass the filter."
)

# Fix awaiting scan text
html = html.replace(
    "Paste your resume on the left and click scan to see your results.",
    "Upload your resume on the left and we will automatically scan it for you."
)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed copy!")
