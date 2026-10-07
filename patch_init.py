with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Make nav-tabs visible by default
content = content.replace('id="nav-tabs" style="display:none; ', 'id="nav-tabs" style="display:flex; ')

# Make exportBtn visible by default
content = content.replace('id="exportBtn" style="display:none;"', 'id="exportBtn" style="display:inline-block;"')

# Make sure showQueue is always called so the table is rendered even if empty
old_init = """      localforage.getItem('outreach_contacts').then((saved) => {
        if (saved) {
          contacts = saved;
          showQueue();
        }
      });"""

new_init = """      localforage.getItem('outreach_contacts').then((saved) => {
        if (saved) {
          contacts = saved;
        }
        showQueue();
      });"""
content = content.replace(old_init, new_init)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Initialization fixed")
