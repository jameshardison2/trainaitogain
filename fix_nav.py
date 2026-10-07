with open("apply.html", "r", encoding='utf-8') as f:
    content = f.read()

if '<li><a href="saved-roles.html"' not in content:
    content = content.replace('<li><a href="apply.html">Opportunities</a></li>', 
                              '<li><a href="apply.html">Opportunities</a></li>\n          <li><a href="saved-roles.html" style="display:flex; align-items:center; gap:6px;">Dashboard</a></li>')

with open("apply.html", "w", encoding='utf-8') as f:
    f.write(content)
