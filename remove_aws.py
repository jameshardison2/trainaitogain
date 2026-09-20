import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove from initial upload zone
html = html.replace('<div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>', '')

# 2. Remove from JS reset block
html = html.replace('<div style="font-size:12px; color:var(--gray-400);">Powered by AWS Textract</div>', '')

# 3. Remove from successful upload label
find_label = "Your resume has been securely processed by AWS Textract and is ready for ATS scoring."
replace_label = "Your resume has been securely processed and is ready for ATS scoring."
html = html.replace(find_label, replace_label)

# 4. Remove from "Extracting text via AWS..."
find_extracting = "Extracting text via AWS..."
replace_extracting = "Extracting text..."
html = html.replace(find_extracting, replace_extracting)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed AWS Textract references!")

