with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?cb=' + Date.now())",
    "fetch('https://us-central1-trainaitogain-50c19.cloudfunctions.net/getJobsData?v=3')"
)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
