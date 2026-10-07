with open('render_waves.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
filter_skip = False

for i, line in enumerate(lines):
    # Remove the HTML block for the search/filter bar
    if line.strip() == 'html += `' and 'jobSearchInput' in ''.join(lines[i:i+5]):
        skip = True
        continue
    if skip and line.strip() == '`;' and '</div>' in lines[i-1]:
        skip = False
        continue
    if skip:
        continue

    # Remove the filterJobs logic at the bottom
    if 'const searchInput = document.getElementById(\'jobSearchInput\')' in line:
        filter_skip = True
        continue
    if filter_skip and '// 2. Synchronize Evergreen Carousels' in line:
        filter_skip = False
        # Do not continue, keep this line
    if filter_skip:
        continue

    new_lines.append(line)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

