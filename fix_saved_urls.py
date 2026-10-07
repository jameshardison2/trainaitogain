with open('saved-roles.html', 'r') as f:
    content = f.read()

bad_logic = """// Run on load
document.addEventListener('DOMContentLoaded', renderSavedRoles);"""

good_logic = """// Run on load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/waves.json?v=' + Date.now());
        const data = await response.json();
        const roles = data.roles || data;
        window.liveRolesMap = {};
        roles.forEach(r => {
            window.liveRolesMap[r.title] = r.linkTarget || r.applyUrl;
        });
        
        // Auto-heal the saved roles with the latest accurate live links
        let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
        let updated = false;
        saved.forEach(r => {
            if (window.liveRolesMap[r.title]) {
                if (r.linkTarget !== window.liveRolesMap[r.title]) {
                    r.linkTarget = window.liveRolesMap[r.title];
                    updated = true;
                }
            }
        });
        if (updated) {
            localStorage.setItem('savedRoles', JSON.stringify(saved));
        }
    } catch(err) {
        console.error("Failed to sync live urls", err);
    }
    
    renderSavedRoles();
});"""

content = content.replace(bad_logic, good_logic)

with open('saved-roles.html', 'w') as f:
    f.write(content)
print("applied auto-heal to saved-roles")
