with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

content = content.replace("if (jobDescriptions[bestRole]) {", "if (bestRole && jobDescriptions[bestRole] !== undefined) {")
content = content.replace("if (validMatchRole && jobDescriptions[validMatchRole]) {", "if (validMatchRole && jobDescriptions[validMatchRole] !== undefined) {")

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("falsy logic fixed")
