import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Let's insert the funnel at the top of screen-queue
funnel_html = """
    <!-- Funnel Analytics Bar -->
    <div id="queue-funnel-bar" style="display:flex; justify-content:space-between; align-items:center; background:var(--white); padding:16px 24px; border-radius:12px; box-shadow:var(--shadow-sm); margin-bottom:24px; border:1px solid var(--gray-200);">
        <div style="flex:1; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Total Queue</div>
            <div id="funnel-total" style="font-size:24px; font-weight:800; color:var(--black);">0</div>
        </div>
        <div style="color:var(--gray-300); font-size:20px;">➔</div>
        <div style="flex:1; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Contacted</div>
            <div id="funnel-contacted" style="font-size:24px; font-weight:800; color:#b45309;">0</div>
        </div>
        <div style="color:var(--gray-300); font-size:20px;">➔</div>
        <div style="flex:1; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Replied</div>
            <div id="funnel-replied" style="font-size:24px; font-weight:800; color:#047857;">0</div>
        </div>
        <div style="color:var(--gray-300); font-size:20px;">➔</div>
        <div style="flex:1; text-align:center;">
            <div style="font-size:11px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Hired</div>
            <div id="funnel-hired" style="font-size:24px; font-weight:800; color:var(--primary);">0</div>
        </div>
    </div>
"""

# Find <div id="screen-queue"> and insert after
content = content.replace('<div id="screen-queue" style="display:none; max-width:1200px; margin:0 auto; padding:32px 0;">', '<div id="screen-queue" style="display:none; max-width:1200px; margin:0 auto; padding:32px 0;">' + funnel_html)

# Add logic to update the funnel bar inside updateDashboardStats() or renderTable()
js_update_funnel = r"""
      document.getElementById('dash-total').innerText = stats.total;
      document.getElementById('dash-contacted').innerText = stats.contacted;
      document.getElementById('dash-replied').innerText = stats.replied;
      document.getElementById('dash-hired').innerText = stats.hired;
      
      // Update inline funnel in queue screen
      if(document.getElementById('funnel-total')) {
          document.getElementById('funnel-total').innerText = stats.total;
          document.getElementById('funnel-contacted').innerText = stats.contacted;
          document.getElementById('funnel-replied').innerText = stats.replied;
          document.getElementById('funnel-hired').innerText = stats.hired;
      }
"""
content = re.sub(r'document.getElementById\(\'dash-total\'\).innerText = stats.total;.*?document.getElementById\(\'dash-hired\'\).innerText = stats.hired;', js_update_funnel, content, flags=re.DOTALL)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Added Funnel HTML & JS updates")
