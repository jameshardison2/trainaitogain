import re

with open('apply.html', 'r') as f:
    content = f.read()

# Replace border color for AI generated matched cards
content = content.replace(
    'border:2px solid var(--primary-light); padding:24px; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); flex:0 0 320px; scroll-snap-align:start; display:flex; flex-direction:column; text-align:left;">',
    'border:2px solid var(--accent); padding:24px; border-radius:var(--radius-lg); box-shadow:var(--shadow-orange); flex:0 0 320px; scroll-snap-align:start; display:flex; flex-direction:column; text-align:left;">'
)

# Replace the pay rate for AI generated matched cards
content = content.replace(
    '<span style="color:var(--gray-500); font-weight:700; font-size:14px;">${m.hourlyRate || \'Market Rate\'}</span>',
    '<span style="color:var(--accent); font-weight:900; font-size:18px;">${m.hourlyRate || \'Market Rate\'}</span>'
)

with open('apply.html', 'w') as f:
    f.write(content)
print("Updated apply.html with accent colors")
