import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Remove tooltips and Apollo references from buttons
old_btn1 = 'title="Upload Apollo.io or LinkedIn Connections export">➕ Import Contacts (CSV)</button>'
new_btn1 = '>➕ Import Contacts</button>'
content = content.replace(old_btn1, new_btn1)

old_btn2 = 'title="Upload LinkedIn Messages.csv to attach history">📎 Import Messages</button>'
new_btn2 = '>📎 Import Messages</button>'
content = content.replace(old_btn2, new_btn2)

# Fix error toast to remove Apollo
old_error = 'an Apollo.io export, or a Messages.csv file. The system will auto-format it.'
new_error = 'or a Messages.csv file. The system will auto-format it.'
content = content.replace(old_error, new_error)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Buttons and error toast updated")
