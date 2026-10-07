with open('outreach-tool.html', 'r') as f:
    content = f.read()

content = content.replace("btn.style.display = anyChecked ? 'inline-block' : 'none';", "btn.style.display = anyChecked ? 'inline-flex' : 'none';")

with open('outreach-tool.html', 'w') as f:
    f.write(content)
