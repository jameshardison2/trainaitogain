import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the button color from --gray-800 to --gray-900
html = html.replace("background:var(--gray-800)", "background:var(--gray-900)")
html = html.replace("this.style.background='var(--gray-800)'", "this.style.background='var(--gray-900)'")

# Improve the instructions for flow optimization
instruction_find = "run it through your preferred external LLM (e.g. Claude, ChatGPT) to resolve them.</p>"
instruction_replace = "run it through your preferred external LLM (e.g. Claude, ChatGPT). Once generated, click <strong>Paste AI-Updated Text</strong> in Step 3 to rescan.</p>"
html = html.replace(instruction_find, instruction_replace)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed button color and flow instructions!")

