with open('apply.html', 'r') as f:
    content = f.read()

bad = "saveBtn.onclick = () => saveRole(title, domain, pay, applyUrl);"
good = "saveBtn.onclick = () => saveRole(title, domain, pay, null);"

content = content.replace(bad, good)

with open('apply.html', 'w') as f:
    f.write(content)
print("reference error fixed")
