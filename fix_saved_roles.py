with open('saved-roles.html', 'r') as f:
    content = f.read()

auto_heal = """
    // Auto-heal missing links from localStorage
    document.addEventListener("DOMContentLoaded", async function() {
      try {
        const res = await fetch('waves.json');
        const waves = await res.json();
        let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
        let updated = false;
        
        saved.forEach(role => {
          if (!role.applyUrl || role.applyUrl.includes('undefined')) {
            let match = null;
            waves.forEach(w => w.roles.forEach(r => {
              if (r.title === role.title) match = r;
            }));
            if (match && match.linkTarget) {
              role.applyUrl = match.linkTarget;
              updated = true;
            } else {
              role.applyUrl = "https://t.mercor.com/wbPMF";
              updated = true;
            }
          }
        });
        if (updated) {
          localStorage.setItem('savedRoles', JSON.stringify(saved));
          renderSavedRoles();
        }
      } catch(e) {}
    });
"""

content = content.replace("function renderSavedRoles()", auto_heal + "\n    function renderSavedRoles()")

old_apply = """<a href="${role.domain ? 'role-' + role.domain.toLowerCase() + '.html' : '#'}" class="btn btn-primary" style="padding:10px 20px; font-size:14px; text-decoration:none;">Apply Now</a>"""
new_apply = """<a href="${role.applyUrl || 'https://t.mercor.com/wbPMF'}" target="_blank" class="btn btn-primary" style="padding:10px 20px; font-size:14px; text-decoration:none; background: #F59E0B; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">Apply Now</a>"""
content = content.replace(old_apply, new_apply)

with open('saved-roles.html', 'w') as f:
    f.write(content)
print("saved-roles.html fixed")
