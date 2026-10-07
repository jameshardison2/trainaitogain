with open('ai-interview.html', 'r') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    if "errorBox.innerText = 'CRITICAL JS ERROR: ' + msg +" in lines[i]:
        new_lines.append("    errorBox.innerText = 'CRITICAL JS ERROR: ' + msg + '\\nLine: ' + line;\n")
        i += 2 # Skip the current and the "Line: ' + line;" line
    else:
        new_lines.append(lines[i])
        i += 1

with open('ai-interview.html', 'w') as f:
    f.writelines(new_lines)
