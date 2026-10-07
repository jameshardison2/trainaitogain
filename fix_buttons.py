import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_button_block = """              <button onclick="saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${role.linkTarget || 'https://t.mercor.com/wbPMF'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>

              
            </div>"""

new_button_block = """              <button onclick="saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${role.linkTarget || 'https://t.mercor.com/wbPMF'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
              <button onclick="markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>
              <button onclick="window.open('resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>
            </div>"""

if old_button_block in content:
    content = content.replace(old_button_block, new_button_block)
else:
    print("Could not find the block to replace!")

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)

