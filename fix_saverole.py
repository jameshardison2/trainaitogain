import re

with open('apply.html', 'r') as f:
    content = f.read()

old_func = """function saveRole(title, domain, pay) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        alert('Role saved! You can view it in the Dashboard in the top menu.');
    } else {
        alert('Role is already in your Pipeline Dashboard.');
    }
}"""

new_func = """function saveRole(title, domain, pay, btn, applyUrl) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, applyUrl: applyUrl, date: new Date().toISOString() });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        if (btn) { btn.innerText = '✅'; }
        alert('Role saved! You can view it in the Dashboard in the top menu.');
    } else {
        alert('Role is already in your Pipeline Dashboard.');
    }
}"""

content = content.replace(old_func, new_func)

with open('apply.html', 'w') as f:
    f.write(content)
print("saveRole fixed")
