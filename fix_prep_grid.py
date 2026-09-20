import re

with open('prep-hub.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_css = ".module-card:hover {"
replace_css = """    .module-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
    .module-card:hover {"""

if find_css in html:
    html = html.replace(find_css, replace_css)
    print("Grid CSS fixed!")
else:
    print("Could not find CSS block.")

with open('prep-hub.html', 'w', encoding='utf-8') as f:
    f.write(html)
