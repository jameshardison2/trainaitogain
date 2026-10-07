with open("render_waves.ts", "r") as f:
    content = f.read()

# 1. Add options to select
old_options = """<option value="COMPLETED">Completed Roles</option>"""
new_options = """<option value="COMPLETED">Completed Roles</option>
            <option value="MICRO1">Micro1 Roles</option>
            <option value="MERCOR">Mercor Roles</option>"""

if "value=\"MICRO1\"" not in content:
    content = content.replace(old_options, new_options)

# 2. Add logic to filter
old_logic = """      if (currentDomain === 'COMPLETED') {
        let completedRoles = JSON.parse(localStorage.getItem('completedRoles') || '[]');
        filteredRoles = filteredRoles.filter(r => completedRoles.some(cr => cr.id === r.title + r.domain));
      } else if (currentDomain !== 'ALL') {
        filteredRoles = filteredRoles.filter(r => r.domain === currentDomain);
      }"""

new_logic = """      if (currentDomain === 'COMPLETED') {
        let completedRoles = JSON.parse(localStorage.getItem('completedRoles') || '[]');
        filteredRoles = filteredRoles.filter(r => completedRoles.some(cr => cr.id === r.title + r.domain));
      } else if (currentDomain === 'MICRO1') {
        filteredRoles = filteredRoles.filter(r => r.linkTarget && r.linkTarget.toLowerCase().includes('micro1'));
      } else if (currentDomain === 'MERCOR') {
        filteredRoles = filteredRoles.filter(r => r.linkTarget && r.linkTarget.toLowerCase().includes('mercor'));
      } else if (currentDomain !== 'ALL') {
        filteredRoles = filteredRoles.filter(r => r.domain === currentDomain);
      }"""

if "currentDomain === 'MICRO1'" not in content:
    content = content.replace(old_logic, new_logic)

with open("render_waves.ts", "w") as f:
    f.write(content)
