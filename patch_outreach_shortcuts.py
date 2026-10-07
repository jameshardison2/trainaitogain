import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

shortcut_js = r"""
    // Keyboard Shortcut Macros for CRM Drawer
    document.addEventListener('DOMContentLoaded', () => {
        const msgBox = document.getElementById('drawer-message');
        if(msgBox) {
            msgBox.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    copyAndMessage();
                }
            });
        }
        
        // Setup paste event for AI box
"""

# Let's see if the old DOMContentLoaded for AI paste is there.
# It was: document.addEventListener('DOMContentLoaded', () => { \n const ta = document.getElementById('ai-profile-input');
content = re.sub(
    r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const ta = document\.getElementById\('ai-profile-input'\);",
    shortcut_js.replace('\\', '\\\\') + r"const ta = document.getElementById('ai-profile-input');",
    content
)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Added shortcuts")
