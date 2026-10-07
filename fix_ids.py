import re

with open('apply.html', 'r') as f:
    html = f.read()

html = html.replace('id="categoryFilter"', 'id="jobDomainFilter"')
html = html.replace('id="locationFilter"', 'id="jobLocationFilter"')

with open('apply.html', 'w') as f:
    f.write(html)

