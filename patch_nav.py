import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_nav = """    <div id="nav-tabs" style="display:none; background:var(--gray-100); padding:4px; border-radius:8px; flex:0 1 auto; position:absolute; left:50%; transform:translateX(-50%);">

        <button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="margin-left:12px; padding:6px 12px; font-size:13px; background:#047857; border:none; box-shadow:0 4px 10px rgba(4,120,87,0.3);" title="Upload Apollo.io or LinkedIn Connections export">➕ Import Contacts (CSV)</button>
        <button class="btn btn-outline" onclick="document.getElementById('file-input').click()" style="margin-left:8px; padding:6px 12px; font-size:13px; border-color:var(--gray-300); color:var(--gray-600);" title="Upload LinkedIn Messages.csv to attach history">📎 Import Messages</button>

    </div>"""

new_nav = """    <div id="nav-tabs" style="display:none; background:var(--gray-100); padding:6px 8px; border-radius:8px; flex:0 1 auto; position:absolute; left:50%; transform:translateX(-50%); align-items:center;">
        <button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="padding:8px 16px; font-size:13px; background:#047857; border:none; box-shadow:0 4px 10px rgba(4,120,87,0.3);" title="Upload Apollo.io or LinkedIn Connections export">➕ Import Contacts (CSV)</button>
        <button class="btn btn-outline" onclick="document.getElementById('file-input').click()" style="margin-left:8px; padding:8px 16px; font-size:13px; border-color:var(--gray-300); color:var(--gray-600); background:white;" title="Upload LinkedIn Messages.csv to attach history">📎 Import Messages</button>
    </div>"""

content = content.replace(old_nav, new_nav)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Nav buttons cleaned")
