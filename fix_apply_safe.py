import re

with open("apply.html", "r", encoding='utf-8') as f:
    content = f.read()

# 1. Add Dashboard link
if '<li><a href="saved-roles.html"' not in content:
    content = content.replace('<li><a href="apply.html">Opportunities</a></li>', 
                              '<li><a href="apply.html">Opportunities</a></li>\n          <li><a href="saved-roles.html" style="display:flex; align-items:center; gap:6px;">Dashboard</a></li>')

# 2. Add saveRole script
save_script = """
<script>
function saveRole(title, domain, pay) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    const roleId = title + domain;
    if (!saved.some(r => r.id === roleId)) {
        saved.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        alert('Role saved! You can view it in the Dashboard in the top menu.');
    } else {
        alert('Role is already in your Pipeline Dashboard.');
    }
}
</script>
"""
if "function saveRole" not in content:
    content = content.replace("</body>", save_script + "\n</body>")

with open("apply.html", "w", encoding='utf-8') as f:
    f.write(content)

