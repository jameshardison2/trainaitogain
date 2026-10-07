with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_btn = '<button class="btn btn-primary" onclick="document.getElementById(\'file-input\').click()" style="margin-left:12px; padding:6px 12px; font-size:13px; background:#047857; border:none;">➕ Import CSV</button>'
new_btn = """<button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="margin-left:12px; padding:6px 12px; font-size:13px; background:#047857; border:none; box-shadow:0 4px 10px rgba(4,120,87,0.3);" title="Upload Apollo.io or LinkedIn Connections export">➕ Import Contacts (CSV)</button>
        <button class="btn btn-outline" onclick="document.getElementById('file-input').click()" style="margin-left:8px; padding:6px 12px; font-size:13px; border-color:var(--gray-300); color:var(--gray-600);" title="Upload LinkedIn Messages.csv to attach history">📎 Import Messages</button>"""

content = content.replace(old_btn, new_btn)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Applied button split")
