with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_end = """      document.getElementById('queue-stats').innerText = `${filtered.length} contacts`;
    }

    function openDrawer(globalId) {"""

new_end = """      document.getElementById('queue-stats').innerText = `${filtered.length} contacts`;
      
      const selectAll = document.getElementById('selectAll');
      if (selectAll) selectAll.checked = false;
      if (window.toggleBulkBtn) window.toggleBulkBtn();
    }

    function openDrawer(globalId) {"""

content = content.replace(old_end, new_end)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("bulk cleanup added")
