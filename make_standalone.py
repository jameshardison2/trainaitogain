import re

with open("index.html", "r") as f:
    html = f.read()

with open("shared.css", "r") as f:
    css = f.read()

# Replace <link rel="stylesheet" href="shared.css" /> with <style>...</style>
style_tag = f"<style>\n{css}\n</style>"
html = re.sub(r'<link rel="stylesheet" href="shared\.css" />', style_tag, html)

with open("landing_page_v2.html", "w") as f:
    f.write(html)
print("Created landing_page_v2.html with inlined CSS.")
