with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

old_fetch = "const response = await fetch('waves.json?v=' + new Date().getTime());"
new_fetch = "const response = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=' + new Date().getTime());"

content = content.replace(old_fetch, new_fetch)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("patched fetch source")
