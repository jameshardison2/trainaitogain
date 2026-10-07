import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Remove Queue and Dashboard buttons
old_buttons = """        <button class="btn" id="tab-queue" style="background:var(--white); box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-right:4px;" onclick="switchTab('queue')">Queue</button>
        
        <button class="btn" id="tab-dashboard" style="background:transparent; color:var(--gray-600);" onclick="switchTab('dashboard')">Dashboard</button>"""
new_buttons = ""
content = content.replace(old_buttons, new_buttons)

# 2. Remove screen-dashboard div
dashboard_regex = re.compile(r'<!-- Screen 2b: Dashboard -->\s*<div id="screen-dashboard".*?<!-- AI Generation Modal -->', re.DOTALL)
content = dashboard_regex.sub('<!-- AI Generation Modal -->', content)

# 3. Remove switchTab function
switchtab_regex = re.compile(r'function switchTab\(tab\) \{.*?\}', re.DOTALL)
content = switchtab_regex.sub('', content)

# 4. Remove switchTab('queue') from showQueue()
content = content.replace("switchTab('queue');", "")

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("UI cleaned up")
