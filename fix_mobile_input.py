import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Fix the input element to be more mobile friendly and accept all word mimetypes
old_input = '<input type="file" id="aws-file-input" accept=".pdf,.docx" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;" />'
new_input = '<input type="file" id="aws-file-input" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 999;" />'

apply_html = apply_html.replace(old_input, new_input)
# Make sure we didn't miss it
apply_html = apply_html.replace('accept=".pdf,.docx"', 'accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"')
apply_html = apply_html.replace('z-index: 10;', 'z-index: 999; display: block;')

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)


with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    ats_html = f.read()

ats_html = ats_html.replace('accept=".pdf,.docx"', 'accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"')
ats_html = ats_html.replace('z-index: 10;', 'z-index: 999; display: block;')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(ats_html)

print("Applied robust file input fix.")
