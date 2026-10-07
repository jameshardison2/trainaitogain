with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_header = """            <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;">
              <div style="display:flex; gap:8px;">
                <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
                <div style="padding:6px 10px; background:${bg}; color:white; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.status}</div>
              </div>
              <div style="color:var(--primary); font-weight:800; font-size:18px;">${role.pay}</div>
            </div>"""

new_header = """            <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:flex-start; gap:8px;">
              <div style="display:flex; gap:8px; flex-wrap:wrap; flex:1;">
                <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
                <div style="padding:6px 10px; background:${bg}; color:white; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.status}</div>
              </div>
              <div style="color:var(--primary); font-weight:800; font-size:16px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}</div>
            </div>"""

content = content.replace(old_header, new_header)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
