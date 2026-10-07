import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Fix text wrapping on headers
old_thead = """        <thead>
          <tr>
            <th style="width: 40px;"><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
            <th>Priority</th>
            <th>Name</th>
            <th>Title</th>
            <th>Domain</th>
            <th>Status</th>
          </tr>
        </thead>"""

new_thead = """        <thead>
          <tr>
            <th style="width: 40px;"><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
            <th style="white-space: nowrap;">Priority</th>
            <th style="white-space: nowrap;">Name</th>
            <th>Title</th>
            <th style="white-space: nowrap;">Domain</th>
            <th style="white-space: nowrap;">Status</th>
          </tr>
        </thead>"""
content = content.replace(old_thead, new_thead)

# Fix text wrapping on row badges
old_row = """          <td><span style="background:var(--gray-100); padding:2px 8px; border-radius:4px; font-size:12px;">${(c.domain || 'other').toUpperCase()}</span></td>
          <td><span class="badge ${statusClass}">${c.outreach_status}</span></td>"""

new_row = """          <td><span style="background:var(--gray-100); padding:2px 8px; border-radius:4px; font-size:12px; white-space:nowrap; display:inline-block;">${(c.domain || 'other').toUpperCase()}</span></td>
          <td><span class="badge ${statusClass}" style="white-space:nowrap; display:inline-block;">${c.outreach_status}</span></td>"""
content = content.replace(old_row, new_row)

# Fix filters and refresh button styling
old_filters_start = '<div class="filters" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">'
new_filters_start = '<div class="filters" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom: 24px;">'
content = content.replace(old_filters_start, new_filters_start)

# Fix refresh button directly (removing tooltip, fixing height)
old_refresh = '<button class="btn btn-outline" onclick="location.reload()" title="Refresh Data" style="padding: 8px 12px; font-size:14px; background:white; color:var(--gray-600); border-color:var(--gray-300);">↻ Refresh</button>'
new_refresh = '<button class="btn btn-outline" onclick="location.reload()" style="height: 38px; padding: 0 16px; font-size:14px; background:white; color:var(--gray-600); border-color:var(--gray-300); display:inline-flex; align-items:center; justify-content:center; box-sizing: border-box; flex-shrink: 0;">↻ Refresh</button>'
content = content.replace(old_refresh, new_refresh)

# Fix bulk update button directly
old_bulk = '<button class="btn btn-outline" id="btn-bulk" style="display:none; padding: 8px 12px; font-size:14px; background:#ecfdf5; color:#047857; border-color:#047857;" onclick="bulkUpdate()">✓ Update Selected</button>'
new_bulk = '<button class="btn btn-outline" id="btn-bulk" style="display:none; height: 38px; padding: 0 16px; font-size:14px; background:#ecfdf5; color:#047857; border-color:#047857; align-items:center; justify-content:center; box-sizing: border-box; flex-shrink: 0;" onclick="bulkUpdate()">✓ Update Selected</button>'
content = content.replace(old_bulk, new_bulk)

# Add matching styles to input and selects
old_input = '<input type="text" id="filter-name" placeholder="Search by name..." onkeyup="renderTable()" style="padding: 8px 12px; border: 1px solid var(--gray-300); border-radius: 6px; font-size: 14px; outline: none; max-width: 200px;">'
new_input = '<input type="text" id="filter-name" placeholder="Search by name..." onkeyup="renderTable()" style="height: 38px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--gray-300); border-radius: 6px; font-size: 14px; outline: none; width: 220px;">'
content = content.replace(old_input, new_input)

# Since I set height: 38px inline for inputs, I should make sure the inline style of selects is updated or just use a style tag
style_fix = """  <style>
    .filters select, .filters input, .filters button {
        height: 38px !important;
        box-sizing: border-box !important;
    }
  </style>"""
content = content.replace("</head>", style_fix + "\n</head>")

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Styling updated")
