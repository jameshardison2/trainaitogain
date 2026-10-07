import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_fn = """function saveRole(title, domain, pay, btn) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
    }
    if (btn) {
        btn.innerHTML = '★';
        btn.style.background = '#f59e0b';
        btn.style.color = 'white';
        btn.style.borderColor = '#f59e0b';
    }
}"""

new_fn = """function saveRole(title, domain, pay, btn, linkTarget) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString(), linkTarget: linkTarget });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
    }
    if (btn) {
        btn.innerHTML = 'Saved ✓';
        btn.style.background = '#f59e0b';
        btn.style.color = 'white';
        btn.style.borderColor = '#f59e0b';
    }
}"""
content = content.replace(old_fn, new_fn)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
