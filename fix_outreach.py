with open('outreach-tool.html', 'r') as f:
    content = f.read()

bad_fetch = "fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=12');"
good_fetch = "fetch('/waves.json?v=' + new Date().getTime());"

content = content.replace(bad_fetch, good_fetch)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("outreach fetch reverted to local waves.json")
