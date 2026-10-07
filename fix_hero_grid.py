with open('index.html', 'r') as f:
    html = f.read()

# Change the grid container to flex column
html = html.replace(
    '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">',
    '<div style="display: flex; flex-direction: column; gap: 16px; align-items: stretch;">'
)

# Replace the boxy square cards with sleek horizontal cards
html = html.replace(
    '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">',
    '<div style="background: white; border: 1px solid var(--gray-200); box-shadow: 0 12px 30px rgba(0,0,0,0.04); border-radius: 16px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 24px 32px; text-align: left;">'
)

html = html.replace(
    '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">',
    '<div style="background: white; border: 1px solid var(--gray-200); box-shadow: 0 12px 30px rgba(0,0,0,0.04); border-radius: 16px; position: relative; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 24px 32px; text-align: left;">'
)

html = html.replace(
    '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">',
    '<div style="background: white; border: 1px solid var(--gray-200); box-shadow: 0 12px 30px rgba(0,0,0,0.04); border-radius: 16px; position: relative; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 24px 32px; text-align: left;">'
)

html = html.replace(
    '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; text-align: center;">',
    '<div style="background: white; border: 1px solid var(--gray-200); box-shadow: 0 12px 30px rgba(0,0,0,0.04); border-radius: 16px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 24px 32px; text-align: left;">'
)

# Change text alignments and margins for row layout
html = html.replace('<div style="font-size: clamp(32px, 8vw, 48px); font-weight: 800; color: #111; margin-bottom: 8px;">', '<div style="font-size: 32px; font-weight: 800; color: var(--primary-dark);">')
html = html.replace('<div style="font-size: clamp(14px, 4vw, 16px); font-weight: 700; color: #444; line-height: 1.3;">', '<div style="font-size: 16px; font-weight: 700; color: var(--gray-600); line-height: 1.3; max-width: 140px;">')

# Also, there are absolute positioned floating pills inside two of these cards that will now be positioned relative to the new horizontal cards. We should just remove them or hide them, because they clutter the sleek row layout.
# Let's remove the absolute positioning pills to make it super clean.
html = html.replace(
    '<div style="position: absolute; top: 24px; right: -12px;',
    '<div style="display:none; position: absolute; top: 24px; right: -12px;'
)
html = html.replace(
    '<div style="position: absolute; bottom: 24px; left: -12px;',
    '<div style="display:none; position: absolute; bottom: 24px; left: -12px;'
)

with open('index.html', 'w') as f:
    f.write(html)

print("Hero grid redesigned!")
