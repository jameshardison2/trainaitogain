import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Update Reset Button
old_reset = '<button class="btn btn-outline" onclick="resetData()">Reset</button>'
new_reset = '<button class="btn btn-outline" onclick="resetData()" style="color: #ef4444; border-color: #fca5a5; background: #fef2f2; margin-left: 8px;" title="Permanently delete all contacts">⚠️ Reset</button>'
content = content.replace(old_reset, new_reset)

# 2. Make Funnel Sticky
old_funnel = 'id="queue-funnel-bar" style="display:flex; justify-content:space-between; align-items:center; background:var(--white); padding:16px 24px; border-radius:12px; box-shadow:var(--shadow-sm); margin-bottom:24px; border:1px solid var(--gray-200);"'
new_funnel = 'id="queue-funnel-bar" style="position: sticky; top: 16px; z-index: 100; display:flex; justify-content:space-between; align-items:center; background:var(--white); padding:16px 24px; border-radius:12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom:24px; border:1px solid var(--gray-200);"'
content = content.replace(old_funnel, new_funnel)

# 3. Add Table Responsiveness
old_css = '    td {\n      padding: 16px;\n      border-bottom: 1px solid var(--gray-100);\n      font-size: 14px;\n    }'
new_css = '    td {\n      padding: 16px;\n      border-bottom: 1px solid var(--gray-100);\n      font-size: 14px;\n      white-space: normal;\n      word-break: break-word;\n    }\n    th {\n      white-space: normal;\n      word-break: break-word;\n    }'
content = content.replace(old_css, new_css)

content = content.replace('      overflow-x: auto;', '      overflow-x: auto;\n      -webkit-overflow-scrolling: touch;')

# 4. Add Checkbox to Headers
old_thead = """        <thead>
          <tr>
            <th>Priority</th>"""
new_thead = """        <thead>
          <tr>
            <th style="width: 40px;"><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
            <th>Priority</th>"""
content = content.replace(old_thead, new_thead)

# 5. Add Checkbox to Rows inside renderTable
old_tr = """        tr.innerHTML = `
          <td style="font-weight:700;">${c.priority_score || 0}</td>"""
new_tr = """        tr.innerHTML = `
          <td><input type="checkbox" class="row-checkbox" value="${c._id}" onclick="event.stopPropagation(); window.toggleBulkBtn && window.toggleBulkBtn()"></td>
          <td style="font-weight:700;">${c.priority_score || 0}</td>"""
content = content.replace(old_tr, new_tr)

# 6. Add Bulk Action Button next to Refresh
old_refresh = '<button class="btn btn-outline" onclick="location.reload()" title="Refresh Data" style="padding: 8px 12px; font-size:14px; background:white; color:var(--gray-600); border-color:var(--gray-300);">↻ Refresh</button>'
new_refresh = old_refresh + '\n      <button class="btn btn-outline" id="btn-bulk" style="display:none; padding: 8px 12px; font-size:14px; background:#ecfdf5; color:#047857; border-color:#047857;" onclick="bulkUpdate()">✓ Update Selected</button>'
content = content.replace(old_refresh, new_refresh)

# 7. Add Bulk Action JS
js_bulk = """
    window.toggleSelectAll = function() {
      const isChecked = document.getElementById('selectAll').checked;
      const checkboxes = document.querySelectorAll('.row-checkbox');
      checkboxes.forEach(cb => cb.checked = isChecked);
      if(window.toggleBulkBtn) window.toggleBulkBtn();
    };
    
    window.toggleBulkBtn = function() {
      const anyChecked = document.querySelectorAll('.row-checkbox:checked').length > 0;
      const btn = document.getElementById('btn-bulk');
      if (btn) btn.style.display = anyChecked ? 'inline-block' : 'none';
    };
    
    window.bulkUpdate = function() {
       const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => parseInt(cb.value));
       if (selectedIds.length === 0) return;
       
       let newStatus = prompt("Enter new status for " + selectedIds.length + " contacts\\n(e.g., Contacted, Replied, No Response):");
       if (!newStatus) return;
       
       contacts.forEach(c => {
          if (selectedIds.includes(c._id)) {
             c.outreach_status = newStatus;
             c.last_updated = new Date().toISOString();
          }
       });
       saveData();
       renderTable();
       showToast("Updated " + selectedIds.length + " contacts to " + newStatus + "!", "success");
    };
"""
# inject right before `function parseFile`
content = content.replace("    function parseFile(file) {", js_bulk + "\n    function parseFile(file) {")

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("UX updates applied")
