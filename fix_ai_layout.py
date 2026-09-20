import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix layout to stretch
find_prep_hub = ".prep-hub { max-width: 1000px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; align-items: start; }"
replace_prep_hub = ".prep-hub { max-width: 1000px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; align-items: stretch; }"
if find_prep_hub in html:
    html = html.replace(find_prep_hub, replace_prep_hub)

# Hide the dropdown and remove redundancy
find_dropdown = '<select id="domain-selector" class="domain-selector">'
replace_dropdown = '<select id="domain-selector" class="domain-selector" style="display:none;">'
if find_dropdown in html:
    html = html.replace(find_dropdown, replace_dropdown)

# Remove the line in the JS that updates the dropdown text, since we hid it
find_option_text = "option.text = \"Role: \" + atsRole;"
replace_option_text = "// option.text hidden"
if find_option_text in html:
    html = html.replace(find_option_text, replace_option_text)

# Fix cheat-sheet styling to look good when stretching
find_cheat = ".cheat-sheet { background: rgba(255,255,255,0.05); padding: 32px; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.1); }"
replace_cheat = ".cheat-sheet { background: rgba(255,255,255,0.02); padding: 32px; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 0 20px rgba(0,0,0,0.5); display: flex; flex-direction: column; }"
if find_cheat in html:
    html = html.replace(find_cheat, replace_cheat)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed layout and hid dropdown")
