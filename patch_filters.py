import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_filters_regex = re.compile(r'<div class="filters">.*?<span id="queue-stats">0 contacts</span>\s*</div>\s*</div>', re.DOTALL)

new_filters = """<div class="filters" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <button class="btn btn-outline" onclick="location.reload()" title="Refresh Data" style="padding: 8px 12px; font-size:14px; background:white; color:var(--gray-600); border-color:var(--gray-300);">↻ Refresh</button>
      <input type="text" id="filter-name" placeholder="Search by name..." onkeyup="renderTable()" style="padding: 8px 12px; border: 1px solid var(--gray-300); border-radius: 6px; font-size: 14px; outline: none; max-width: 200px;">
      
      <select id="filter-sort" onchange="renderTable()">
        <option value="priority">Sort: Priority</option>
        <option value="newest">Sort: Newest Added</option>
        <option value="oldest">Sort: Oldest Added</option>
        <option value="recent_contact">Sort: Recently Contacted</option>
      </select>

      <select id="filter-status" onchange="renderTable()">
        <option value="ALL">All Statuses</option>
        <option value="READY" selected>Status: READY</option>
        <option value="Contacted">Status: Contacted</option>
        <option value="Replied">Status: Replied</option>
        <option value="No Response">Status: No Response</option>
        <option value="FOLLOWUP">⚠️ Follow-up Due</option>
        <optgroup label="Micro1 Dashboard">
          <option value="Applying">Applying</option>
          <option value="AI interview completed">AI interview completed</option>
          <option value="MCC Met">MCC Met</option>
          <option value="Certified">Certified</option>
          <option value="Matched to project">Matched to project</option>
          <option value="Hired">Hired</option>
          <option value="Reward assigned">Reward assigned</option>
          <option value="Payment released">Payment released</option>
          <option value="Payment sent">Payment sent</option>
          <option value="Paid">Paid</option>
          <option value="Existing micro1 user">Existing micro1 user</option>
          <option value="Invalid">Invalid</option>
        </optgroup>
      </select>
      <select id="filter-domain" onchange="renderTable()">
        <option value="ALL">All Domains</option>
        <option value="medical">Medical</option>
        <option value="aviation">Aviation</option>
        <option value="legal">Legal</option>
        <option value="finance">Finance</option>
        <option value="tech">Tech / General</option>
      </select>
      <div style="flex:1;"></div>
      <div style="display:flex; align-items:center; color:var(--gray-500); font-size:14px;">
        <span id="queue-stats">0 contacts</span>
      </div>
    </div>"""

content = old_filters_regex.sub(new_filters, content)

# Now update renderTable function
old_render_start = """    function renderTable() {
      const statusFilter = document.getElementById('filter-status').value;
      const domainFilter = document.getElementById('filter-domain').value;
      
      let filtered = contacts.filter(c => {"""

new_render_start = """    function renderTable() {
      const statusFilter = document.getElementById('filter-status').value;
      const domainFilter = document.getElementById('filter-domain').value;
      const nameElem = document.getElementById('filter-name');
      const sortElem = document.getElementById('filter-sort');
      const nameFilter = nameElem ? nameElem.value.toLowerCase() : '';
      const sortFilter = sortElem ? sortElem.value : 'priority';
      
      let filtered = contacts.filter(c => {"""
content = content.replace(old_render_start, new_render_start)

old_render_end = """        let matchDomain = domainFilter === 'ALL' || (c.domain && c.domain.toLowerCase() === domainFilter.toLowerCase());
        return matchStatus && matchDomain;
      });

      // Sort by priority_score desc
      filtered.sort((a, b) => (parseFloat(b.priority_score) || 0) - (parseFloat(a.priority_score) || 0));

      const tbody = document.getElementById('table-body');"""

new_render_end = """        let matchDomain = domainFilter === 'ALL' || (c.domain && c.domain.toLowerCase() === domainFilter.toLowerCase());
        let matchName = !nameFilter || (c.name && c.name.toLowerCase().includes(nameFilter));
        return matchStatus && matchDomain && matchName;
      });

      if (sortFilter === 'priority') {
          filtered.sort((a, b) => (parseFloat(b.priority_score) || 0) - (parseFloat(a.priority_score) || 0));
      } else if (sortFilter === 'newest') {
          filtered.sort((a, b) => b._id - a._id);
      } else if (sortFilter === 'oldest') {
          filtered.sort((a, b) => a._id - b._id);
      } else if (sortFilter === 'recent_contact') {
          filtered.sort((a, b) => {
              let da = a.last_updated ? new Date(a.last_updated).getTime() : 0;
              let db = b.last_updated ? new Date(b.last_updated).getTime() : 0;
              return db - da; // Descending dates
          });
      }

      const tbody = document.getElementById('table-body');"""
content = content.replace(old_render_end, new_render_end)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Filters and renderTable updated")
