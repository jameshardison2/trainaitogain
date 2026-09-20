import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Make sure waves object is accessible inside the render block
# Currently: const waves = await response.json(); is inside the try block, so it is accessible.
# Let's change the render loop to look up the domain.
old_render = """                  <div class="wave-card" style="width: 320px; text-align: left; background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; align-items:flex-start;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; width:100%;">
                       <span style="background:var(--primary-light); color:var(--primary-dark); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px;">${m.matchScore}% Match</span>
                       <span style="color:var(--gray-500); font-weight:700; font-size:14px;">${m.hourlyRate || 'Market Rate'}</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--black); margin-bottom:12px; line-height:1.3;">${m.roleName}</h3>
                    <p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
<span style="font-weight: 700; color: var(--primary-dark);">🤖 Auto-Routing Enabled:</span><br>
                      Mercor uses a <strong>Universal Talent Network</strong>. You do not need to search for this specific role! Just create your account and their AI will automatically route your profile to the <strong>${m.roleName}</strong> pipeline."""

new_render = """                  <div class="wave-card" style="width: 320px; text-align: left; background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; align-items:flex-start;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; width:100%;">
                       <span style="background:var(--primary-light); color:var(--primary-dark); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px;">${m.matchScore}% Match</span>
                       <span style="color:var(--gray-500); font-weight:700; font-size:14px;">${m.hourlyRate || 'Market Rate'}</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--black); margin-bottom:12px; line-height:1.3;">${m.roleName}</h3>
                    <p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
<span style="font-weight: 700; color: var(--primary-dark);">🔍 How to find this role:</span><br>
                      Click <strong>Filter</strong> -> <strong>Domain</strong> and select <strong>${m.domainFilter}</strong>."""

# Wait, m.domainFilter doesn't exist in `matches`. We need to add it before saving to sessionStorage!
# Inside the try block, right after JSON.parse(text):
# `matches = JSON.parse(text);`
# `matches = matches.map(m => { const r = (waves.roles||waves).find(x => x.title === m.roleName); m.domainFilter = r ? r.domain.charAt(0) + r.domain.slice(1).toLowerCase() : 'Software'; return m; });`

inject_map = """
          let matches = JSON.parse(text);
          matches = matches.map(m => {
              const r = (waves.roles || waves).find(x => x.title === m.roleName);
              m.domainFilter = r && r.domain ? r.domain.charAt(0) + r.domain.slice(1).toLowerCase() : 'Software';
              return m;
          });
"""
apply_html = apply_html.replace("const matches = JSON.parse(text);", inject_map)
apply_html = apply_html.replace(old_render, new_render)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Filter tip injected.")
