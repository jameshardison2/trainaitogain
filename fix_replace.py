with open("apply.html", "r") as f:
    content = f.read()

content = content.replace("replace(/'/g, \"'\")", "replace(/'/g, \"\\\\'\")")

with open("apply.html", "w") as f:
    f.write(content)
