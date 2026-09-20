import re

with open('apply.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update description
html = html.replace('Our serverless AWS pipeline will instantly match', 'Our local AI pipeline will instantly match')

# 2. Update upload UI text
html = html.replace('Max size: 5MB (S3 Direct)', 'Max size: 5MB')
html = html.replace('Uploading to AWS S3...', 'Analyzing document...')

# 3. Update the mock JS timers
html = html.replace("statusText.innerHTML = '⚙️ Generating pre-signed URL...';", "statusText.innerHTML = '⚙️ Processing PDF locally...';")
html = html.replace("statusText.innerHTML = '☁️ Uploading directly to S3 Bucket...';", "statusText.innerHTML = '🧠 Extracting text...';")
html = html.replace("statusText.innerHTML = '🧠 Triggering AWS Lambda (Textract)...';", "statusText.innerHTML = '🤖 Initializing AI matching model...';")

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Scrubbed AWS references from apply.html!")
