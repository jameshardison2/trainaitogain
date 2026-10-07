with open("resume-ats-guide.html", "r") as f:
    content = f.read()

# Replace the Next Step text and onclick
content = content.replace("applyBtn.innerHTML = 'Next Step: AI Mock Interview ➔';", "applyBtn.innerHTML = 'Apply Now ➔';")
content = content.replace("applyBtn.innerText = 'Next Step: AI Mock Interview ➔';", "applyBtn.innerText = 'Apply Now ➔';")
content = content.replace("applyBtn.onclick = () => window.location.href='ai-interview.html';", "applyBtn.onclick = () => openApplyModal('content_button');")

# Also, there's a reference to "Application Next Steps" which was changed from "Apply Now".
# Wait, look at the text: "Now that your resume is perfect, here is the next step: preparing for the live AI Interview."
content = content.replace("here is the next step: preparing for the live AI Interview.", "you are ready to apply for the role.")

with open("resume-ats-guide.html", "w") as f:
    f.write(content)
