with open("apply.html", "r") as f:
    content = f.read()

content = content.replace("matchBtn.onclick = () => window.open('resume-ats-guide.html', '_blank');", "matchBtn.onclick = () => window.open('resume-ats-guide.html?role=' + encodeURIComponent(title), '_blank');")

with open("apply.html", "w") as f:
    f.write(content)
