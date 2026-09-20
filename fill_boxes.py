import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Box 1
html = html.replace(
    '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px;"></div>',
    '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">💻</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Software<br>Engineering</div></div>'
)

# Box 2
html = html.replace(
    '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative;">',
    '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">⚕️</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Medical<br>&amp; Health</div>'
)

# Box 3
html = html.replace(
    '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative;">',
    '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">📈</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Finance<br>&amp; Math</div>'
)

# Box 4
html = html.replace(
    '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px;"></div>',
    '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">⚖️</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Legal<br>&amp; Policy</div></div>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Filled boxes with content.")
