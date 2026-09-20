import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Fix the layout of the track container
apply_html = apply_html.replace(
    '<div id="matched-waves-track" style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">',
    '<div id="matched-waves-track" style="display:flex; flex-direction:column; gap:24px; align-items:center; width:100%;">'
)

# Fix the layout of the individual cards (in both the main script and the sessionStorage script)
apply_html = apply_html.replace(
    '<div class="wave-card" style="width: 320px;',
    '<div class="wave-card" style="width: 100%; max-width: 600px;'
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Layout fixed.")
