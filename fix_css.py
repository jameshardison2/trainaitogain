import re

with open('shared.css', 'r') as f:
    content = f.read()

content = content.replace(
    '''    .desktop-only {
      display: none !important;
    }''',
    ''''''
)
content = content.replace(
    '''.desktop-only {
  display: none !important;
}''',
    ''''''
)

with open('shared.css', 'w') as f:
    f.write(content)
print("CSS fixed")
