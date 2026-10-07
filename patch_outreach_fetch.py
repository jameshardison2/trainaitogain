with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_fetch = "const res = await fetch('/waves.json');"
new_fetch = "const res = await fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=12');"

content = content.replace(old_fetch, new_fetch)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("patched outreach-tool fetch source")
