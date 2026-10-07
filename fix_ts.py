import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "const glLocFilter" in line or "const glSortFilter" in line:
        continue
    if "glLocFilter" in line:
        line = line.replace("glLocFilter", "locationFilter")
    if "glSortFilter" in line:
        line = line.replace("glSortFilter", "sortFilter")
    new_lines.append(line)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
