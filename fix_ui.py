import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken eyebrow
old_eyebrow = '<div class="section-eyebrow" style="color:var(--primary-dark); background:var(--primary-light);">'
new_eyebrow = '<div class="section-eyebrow" style="display:inline-block; padding:6px 14px; border-radius:100px; color:var(--primary-dark); background:var(--primary-light);">'
content = content.replace(old_eyebrow, new_eyebrow)

# Replace the broken grid
old_grid = '<div class="feature-grid" id="matched-waves-track" style="grid-template-columns: 1fr 1fr; gap: 24px;">'
new_grid = '<div id="matched-waves-track" style="display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px;">'
content = content.replace(old_grid, new_grid)

# Ensure center alignment of the text above the cards if needed
# The image shows "Your Top Qualified Roles" centered.
# Wait, the section itself might need text-align: center? In the image, the eyebrow and H2 are centered.
old_section = '<div id="matched-roles-section" style="display:none; margin-top: 48px;">'
new_section = '<div id="matched-roles-section" style="display:none; margin-top: 48px; text-align: center;">'
content = content.replace(old_section, new_section)

# Also fix the cards to look better in a flex container (let them stretch or be a fixed width, opp-card is already fixed width).
# I'll also add a slight top margin to the cards so the absolute badge doesn't hit the H2.
# Instead of replacing everything, I will just use regex to replace the JS template string.
old_card_start = '<div class="opp-card" style="border: 2px solid var(--primary); box-shadow: 0 8px 24px rgba(52, 211, 153, 0.15);">'
new_card_start = '<div class="opp-card" style="border: 2px solid var(--primary); box-shadow: 0 8px 24px rgba(52, 211, 153, 0.15); margin-top: 16px; text-align: left;">'
content = content.replace(old_card_start, new_card_start)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed!")
