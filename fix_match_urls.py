import re

# 1. Update render_waves.ts
with open("render_waves.ts", "r") as f:
    content = f.read()

content = content.replace("window.open('resume-ats-guide.html', '_blank')", "window.open('resume-ats-guide.html?role=' + encodeURIComponent('${safeTitle}'), '_blank')")

with open("render_waves.ts", "w") as f:
    f.write(content)

# 2. Update apply.html
with open("apply.html", "r") as f:
    content = f.read()

# Update static cards
content = content.replace("matchBtn.onclick = () => document.getElementById('aws-file-input').click();", "matchBtn.onclick = () => window.open('resume-ats-guide.html?role=' + encodeURIComponent(title), '_blank');")

# Update AI matched cards
# They currently have: onclick="window.open('resume-ats-guide.html', '_blank');"
content = content.replace("onclick=\"window.open('resume-ats-guide.html', '_blank');\"", "onclick=\"window.open('resume-ats-guide.html?role=' + encodeURIComponent('${m.roleName.replace(/'/g, \\\"'\\\")}'), '_blank');\"")

with open("apply.html", "w") as f:
    f.write(content)
