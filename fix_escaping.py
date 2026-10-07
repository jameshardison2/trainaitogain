with open("apply.html", "r") as f:
    content = f.read()

content = content.replace(r"\'", "'")

with open("apply.html", "w") as f:
    f.write(content)
