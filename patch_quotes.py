with open('ai-interview.html', 'r') as f:
    content = f.read()

content = content.replace(r"\'", "'")

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("Fixed literal slashes")
