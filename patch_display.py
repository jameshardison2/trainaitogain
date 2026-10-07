import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Fix CSS display
content = content.replace("#screen-queue {\n      display: none;", "#screen-queue {\n      display: block;")

# 2. Add renderTable() to showQueue()
old_showQueue = """    function showQueue() {
      
      document.getElementById('nav-tabs').style.display = 'flex';
      document.getElementById('exportBtn').style.display = 'inline-block';
      
    }"""

new_showQueue = """    function showQueue() {
      document.getElementById('nav-tabs').style.display = 'flex';
      document.getElementById('exportBtn').style.display = 'inline-block';
      renderTable();
    }"""

content = content.replace(old_showQueue, new_showQueue)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Display and renderTable fixed")
