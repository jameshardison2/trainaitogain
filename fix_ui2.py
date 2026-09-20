import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_grid = '<div id="matched-waves-track" style="display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px;">'
new_grid = '<div id="matched-waves-track" style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px;">'
content = content.replace(old_grid, new_grid)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added center justification")
