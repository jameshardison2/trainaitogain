import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<div id="custom-domain-selector" style="position:relative; max-width:400px; margin: 0 auto 24px auto; text-align:left;">', '<div id="custom-domain-selector" style="position:relative; max-width:400px; margin: 0 auto 24px auto; text-align:left; z-index:1000;">')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed z-index on domain selector")
