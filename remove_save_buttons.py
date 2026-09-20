import re

with open('apply.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the save button HTML
save_btn_pattern = r'<button onclick="saveRole\([^\)]+\)"[^>]+>💾</button>'
html = re.sub(save_btn_pattern, '', html)

# Remove the function to clean up
save_fn_pattern = r'function saveRole\(title, domain, pay\) \{.*?\n\}'
html = re.sub(save_fn_pattern, '', html, flags=re.DOTALL)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Removed save buttons from apply.html.")
