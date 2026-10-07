with open("render_waves.ts", "r") as f:
    content = f.read()

old_btn_pattern = "onclick=\"window.location.href='$'{role.linkTarget || 'https://t.mercor.com/wbPMF'}'\">Apply on ${role.linkTarget && role.linkTarget.includes(\"micro1\") ? \"Micro1\" : \"Mercor\"}</button>"

new_btn = "onclick=\"window.open('${role.linkTarget || 'https://t.mercor.com/wbPMF'}', '_blank')\">Apply Now</button>"

if old_btn_pattern in content:
    content = content.replace(old_btn_pattern, new_btn)

with open("render_waves.ts", "w") as f:
    f.write(content)
