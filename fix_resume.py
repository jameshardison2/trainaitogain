with open("temp_apply.html", "r") as f:
    lines = f.readlines()

resume_block = ""
capture = False
for line in lines:
    if "<!-- AWS Serverless Resume Processor -->" in line:
        capture = True
    if capture:
        resume_block += line
    if "<!-- AWS Frontend Integration Script -->" in line:
        capture = False

with open("apply.html", "r") as f:
    content = f.read()

# I will insert it right before `<div id="carousels" style="margin-top:48px;">`
if "<!-- AWS Serverless Resume Processor -->" not in content:
    content = content.replace('<div id="carousels" style="margin-top:48px;">', resume_block + '\n    <div id="carousels" style="margin-top:48px;">')

with open("apply.html", "w") as f:
    f.write(content)

