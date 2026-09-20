import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Revert boxes
html = html.replace(
    '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">💻</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Software<br>Engineering</div></div>',
    '<div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px;"></div>'
)

html = html.replace(
    '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">⚕️</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Medical<br>&amp; Health</div>',
    '<div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative;">'
)

html = html.replace(
    '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">📈</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Finance<br>&amp; Math</div>',
    '<div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative;">'
)

html = html.replace(
    '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;"><div style="font-size: 48px; margin-bottom: 12px;">⚖️</div><div style="font-size: 20px; font-weight: 800; color: #111; line-height: 1.2;">Legal<br>&amp; Policy</div></div>',
    '<div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px;"></div>'
)

# Remove the entire Bottom CTA
bottom_cta_pattern = r'<!-- ─── Bottom CTA ─────────────────────────────────────────── -->\s*<section.*?</section>'
html = re.sub(bottom_cta_pattern, '', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Reverted boxes and removed bottom CTA.")
