with open('outreach-tool.html', 'r') as f:
    content = f.read()

funnel_html = """
  <!-- Screen 2: Queue -->
  <div id="screen-queue">
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

content = content.replace('  <!-- Screen 2: Queue -->\n  <div id="screen-queue">', funnel_html)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
