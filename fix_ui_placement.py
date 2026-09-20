import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

reset_find = """        // Let's just find and remove it.
        const parent = resumeBox.parentNode;
        Array.from(parent.children).forEach(child => {
            if (child.innerHTML && child.innerHTML.includes('resume_final.pdf')) {
                child.remove();
            }
        });"""

reset_replace = """        // Let's just find and remove it.
        const parent = resumeBox.parentNode;
        Array.from(parent.children).forEach(child => {
            if (child.innerHTML && child.innerHTML.includes('resume_final.pdf')) {
                child.remove();
            }
            if (child.className === 'ats-secondary-actions') {
                child.remove();
            }
        });"""

if reset_find in html:
    html = html.replace(reset_find, reset_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed UI layout!")
else:
    print("Could not find reset block.")
