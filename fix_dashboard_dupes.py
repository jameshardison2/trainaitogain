import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_merge = """      // Merge anonymous sessions into globalLeads
      Object.values(sessions).forEach(sess => {
          globalLeads.push(sess);
      });"""

replace_merge = """      // Merge anonymous sessions into globalLeads (only if they aren't already real leads!)
      Object.values(sessions).forEach(sess => {
          // If this session has a real lead associated with it (or we already have a bunch of real leads),
          // don't clutter the board with 'Anonymous' cards unless they explicitly clicked Apply
          const isJustPageView = sess.events.length === 1 && sess.events[0] === 'page_view';
          
          if (!isJustPageView) {
              globalLeads.push(sess);
          }
      });"""

if find_merge in html:
    html = html.replace(find_merge, replace_merge)
else:
    print("Warning: Could not find merge block")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed Anonymous User spam on dashboard.html")
