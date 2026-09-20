import re

with open('dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_script = """</script>
<script src="chat.js?v=9"></script>"""

replace_script = """</script>
<script src="chat.js?v=9"></script>
<script>
    // Hide Guide Assistant on Dashboard to prevent UI overlap with the Kanban board
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            const chatWidget = document.getElementById('chat-widget-container');
            if (chatWidget) chatWidget.style.display = 'none';
            const chatToggle = document.getElementById('chat-widget-toggle');
            if (chatToggle) chatToggle.style.display = 'none';
        }, 500);
    });
</script>"""

if find_script in html:
    html = html.replace(find_script, replace_script)
else:
    print("Warning: Could not find script include in dashboard")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Hid Guide Assistant on existing dashboard.html")
