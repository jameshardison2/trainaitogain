with open('apply.html', 'r') as f:
    content = f.read()

bad_logic = """function saveRole(title, domain, pay) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });"""

good_logic = """function saveRole(title, domain, pay, linkTarget) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, linkTarget: linkTarget, date: new Date().toISOString() });"""

content = content.replace(bad_logic, good_logic)

with open('apply.html', 'w') as f:
    f.write(content)
print("saveRole patched in apply.html")
