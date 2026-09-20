import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Fix the waves.json object mapping bug
apply_html = apply_html.replace(
    "const roleList = waves.map(w => ({ name: w.title, rate: w.hourlyRate, url: w.applyUrl || w.url }));",
    "const roleList = (waves.roles || waves).map(w => ({ name: w.title, rate: w.hourlyRate || w.pay, url: w.applyUrl || w.linkTarget }));"
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Map bug fixed.")
