import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add class to fileCard
html = html.replace("const fileCard = document.createElement('div');", "const fileCard = document.createElement('div');\n          fileCard.className = 'ats-file-card';")

# 2. Add cleanup logic at the top of the fileInput change handler
find_start = """        const selectedRole = roleSelect.value;
        if (!selectedRole || selectedRole === "") {"""

replace_start = """        document.querySelectorAll('.ats-secondary-actions').forEach(el => el.remove());
        document.querySelectorAll('.ats-file-card').forEach(el => el.remove());

        const selectedRole = roleSelect.value;
        if (!selectedRole || selectedRole === "") {"""

html = html.replace(find_start, replace_start)

# 3. Add cleanup logic to the roleSelect change handler as well (when they switch roles, we reset the UI)
find_reset = """            resumeBox.style.display = 'none';
            resumeBox.value = '';
        }
        
        // Remove the file card if it exists
        const fileCards = document.querySelectorAll('#resume-text');"""
replace_reset = """            resumeBox.style.display = 'none';
            resumeBox.value = '';
        }
        
        document.querySelectorAll('.ats-secondary-actions').forEach(el => el.remove());
        document.querySelectorAll('.ats-file-card').forEach(el => el.remove());
        
        const fileCards = document.querySelectorAll('#resume-text');"""

html = html.replace(find_reset, replace_reset)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed duplicate cards!")

