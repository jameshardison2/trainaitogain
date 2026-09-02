import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Pipeline — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
</head>
<body style="background:var(--gray-50); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 64px 0; flex:1;">
  <div class="container">
    <div style="max-width:800px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
        <h1 style="font-size:36px; font-weight:800; color:var(--black); margin:0;">My Pipeline Dashboard</h1>
        <button onclick="clearSavedRoles()" style="background:transparent; color:var(--gray-500); border:none; text-decoration:underline; cursor:pointer; font-size:14px;">Clear All</button>
      </div>
      
      <div id="saved-roles-container" style="display:flex; flex-direction:column; gap:16px;">
        <div style="text-align:center; padding:48px; background:var(--white); border:1px dashed var(--gray-300); border-radius:var(--radius-lg); color:var(--gray-500);">
          Loading your saved pipelines...
        </div>
      </div>
    </div>
  </div>
</section>

{footer}

<script>
function renderSavedRoles() {{
    const container = document.getElementById('saved-roles-container');
    const saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    
    if (saved.length === 0) {{
        container.innerHTML = `
            <div style="text-align:center; padding:48px; background:var(--white); border:1px dashed var(--gray-300); border-radius:var(--radius-lg); color:var(--gray-500);">
                <div style="font-size:32px; margin-bottom:16px;">📂</div>
                <h3 style="font-size:20px; color:var(--black); margin-bottom:8px;">No pipelines saved yet.</h3>
                <p style="margin-bottom:24px;">Browse the opportunities index and bookmark roles to track them here.</p>
                <a href="apply.html" class="btn-primary">Browse Roles</a>
            </div>
        `;
        return;
    }}
    
    container.innerHTML = saved.map(role => `
        <div style="background:var(--white); border:1px solid var(--gray-200); padding:24px; border-radius:var(--radius-lg); display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-sm); flex-wrap:wrap; gap:16px;">
            <div>
                <div style="display:inline-block; padding:4px 8px; background:var(--black); color:var(--white); border-radius:4px; font-size:11px; font-weight:700; margin-bottom:12px; letter-spacing:0.05em; text-transform:uppercase;">${{role.domain}}</div>
                <h3 style="font-size:20px; font-weight:700; color:var(--black); margin-bottom:4px;">${{role.title}}</h3>
                <div style="color:var(--gray-500); font-size:14px;">Saved: ${{new Date(role.date).toLocaleDateString()}}</div>
            </div>
            <div style="text-align:right;">
                <div style="color:var(--primary); font-weight:800; font-size:24px; margin-bottom:12px;">${{role.pay}}</div>
                <div style="display:flex; gap:8px;">
                    <button onclick="removeRole('${{role.id}}')" class="btn-secondary" style="padding:8px 16px;">Remove</button>
                    <a href="https://t.mercor.com/wbPMF" target="_blank" class="btn-primary" style="padding:8px 24px;">Apply</a>
                </div>
            </div>
        </div>
    `).join('');
}}

function clearSavedRoles() {{
    if(confirm('Are you sure you want to clear your pipeline dashboard?')) {{
        localStorage.removeItem('savedRoles');
        renderSavedRoles();
    }}
}}

function removeRole(id) {{
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    saved = saved.filter(r => r.id !== id);
    localStorage.setItem('savedRoles', JSON.stringify(saved));
    renderSavedRoles();
}}

// Run on load
document.addEventListener('DOMContentLoaded', renderSavedRoles);
</script>

</body>
</html>
"""

with open("saved-roles.html", "w") as f:
    f.write(html)
print("Created saved-roles.html")
