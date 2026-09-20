import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the broken fill-template-btn JS
bad_js = """    document.getElementById('fill-template-btn').addEventListener('click', function() {
      const selectedRole = roleSelect.value;
      if (!selectedRole || selectedRole === "") {
        alert("Please select a role first.");
        return;
      }
      resumeBox.value = resumePlaceholders[selectedRole] || resumePlaceholders['general'];
    });"""

if bad_js in html:
    html = html.replace(bad_js, "")
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed fill-template-btn crash!")
else:
    print("Could not find the broken fill-template-btn JS.")
