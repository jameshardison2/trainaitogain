import re

with open('prep-hub.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_grid = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; max-width:1000px; margin:0 auto;">'
replace_grid = '<div style="display:flex; justify-content:center; max-width:500px; margin:0 auto;">'
html = html.replace(find_grid, replace_grid)

# Remove the extra cards
start_idx = html.find('<div class="module-card">\n        <div class="module-icon">💻</div>')
end_idx = html.find('</div>\n    \n    <!-- Pipeline Pagination -->')

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + html[end_idx:]
    print("Extra cards removed!")
else:
    print("Could not find extra cards bounds.")

# We should also remove the css rule I just added for nth-child(odd) since there's only 1 card now.
find_css = """    .module-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }"""
html = html.replace(find_css, "")

with open('prep-hub.html', 'w', encoding='utf-8') as f:
    f.write(html)
