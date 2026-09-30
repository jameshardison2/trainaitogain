with open("render_waves.ts", "r") as f:
    content = f.read()

old_select = """<select id="jobDomainFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="ALL">All Categories</option>
            <option value="SOFTWARE">Software & Engineering</option>
            <option value="GENERAL">General & Expert</option>
        </select>"""

new_select = """<select id="jobDomainFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="ALL">All Categories</option>
            <option value="SOFTWARE">Software & Engineering</option>
            <option value="GENERAL">General & Expert</option>
            <option value="MEDICAL">Medical & Clinical</option>
            <option value="FINANCE">Finance & Economics</option>
            <option value="LEGAL">Legal & Compliance</option>
        </select>"""

if "MEDICAL" not in content:
    content = content.replace(old_select, new_select)

with open("render_waves.ts", "w") as f:
    f.write(content)

