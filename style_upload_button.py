import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_btn = """        <button id="btn-upload-instead" type="button" style="background:none; border:none; padding:0; font-size:13px; cursor:pointer; color:var(--gray-500); font-weight:600; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-500)'" onclick="document.getElementById('ats-file-input').click();">"""

replace_btn = """        <button id="btn-upload-instead" type="button" style="background:white; border:1px solid var(--gray-300); border-radius:6px; padding:6px 12px; font-size:13px; cursor:pointer; color:var(--black); font-weight:700; display:flex; align-items:center; gap:6px; transition:all 0.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='var(--primary)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.color='var(--black)';" onclick="document.getElementById('ats-file-input').click();">"""

if find_btn in html:
    html = html.replace(find_btn, replace_btn)
    print("Button styled!")
else:
    print("Could not find button.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
