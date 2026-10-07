import re

with open("apply.html", "r", encoding='utf-8') as f:
    content = f.read()

complete_script = """
<script>
function markAsComplete(title, domain, pay) {
    let completed = JSON.parse(localStorage.getItem('completedRoles')) || [];
    const roleId = title + domain;
    if (!completed.some(r => r.id === roleId)) {
        completed.push({ id: roleId, title: title, domain: domain, pay: pay, date: new Date().toISOString() });
        localStorage.setItem('completedRoles', JSON.stringify(completed));
        alert('Role marked as Complete!');
    } else {
        alert('Role is already marked as Complete.');
    }
}
</script>
"""

if "function markAsComplete" not in content:
    content = content.replace("<script>\nfunction saveRole", complete_script + "\n<script>\nfunction saveRole")

# Modify the JS script that adds the save button to also add the complete button!
# find: saveBtn.onclick = () => saveRole(title, domain, pay);
# after it, add the complete button code:

add_button_js = """
          const compBtn = document.createElement('button');
          compBtn.innerHTML = '✅';
          compBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s; margin-left:8px;';
          compBtn.onmouseover = () => { compBtn.style.background = 'var(--primary-light)'; compBtn.style.color = 'var(--primary-dark)'; };
          compBtn.onmouseout = () => { compBtn.style.background = 'var(--gray-100)'; compBtn.style.color = 'var(--gray-700)'; };
          compBtn.onclick = () => markAsComplete(title, domain, pay);
          
          saveBtn.parentNode.insertBefore(compBtn, saveBtn.nextSibling);
"""
if "const compBtn = document.createElement" not in content:
    content = content.replace("applyBtn.parentNode.insertBefore(saveBtn, applyBtn.nextSibling);", 
                              "applyBtn.parentNode.insertBefore(saveBtn, applyBtn.nextSibling);\n" + add_button_js)

with open("apply.html", "w", encoding='utf-8') as f:
    f.write(content)
