with open("render_waves.ts", "r") as f:
    content = f.read()

content = content.replace("onclick=\"window.location.href='\\$'{role.linkTarget || 'https://t.mercor.com/wbPMF'}'\"", "onclick=\"window.location.href=role.linkTarget || 'https://t.mercor.com/wbPMF'\"")
content = content.replace("window.location.href='https://t.mercor.com/wbPMF'", "window.location.href=role.linkTarget || 'https://t.mercor.com/wbPMF'")
content = content.replace(">Apply Now</button>", ">Apply on ${role.linkTarget && role.linkTarget.includes('micro1') ? 'Micro1' : 'Mercor'}</button>")

with open("render_waves.ts", "w") as f:
    f.write(content)

with open("tsconfig.json", "w") as f:
    f.write('{"compilerOptions": {"target": "es2015", "lib": ["es2015", "dom"]}}')
