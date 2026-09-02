import os

old_url = "https://www.linkedin.com/in/hardisonlabs/"
new_url = "https://www.linkedin.com/company/trainaitogain/"

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    if old_url in content:
        content = content.replace(old_url, new_url)
        with open(file, 'w') as f:
            f.write(content)
        print(f"Updated {file}")
    else:
        print(f"URL not found in {file}")
