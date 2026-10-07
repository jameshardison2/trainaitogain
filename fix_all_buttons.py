with open("render_waves.ts", "r") as f:
    content = f.read()

# 1. Add Match button to render_waves.ts
old_btn = """<button onclick="markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>"""
new_btn = old_btn + """\n            <button onclick="document.getElementById('aws-file-input').click();" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>"""

if "🎯" not in content:
    content = content.replace(old_btn, new_btn)

with open("render_waves.ts", "w") as f:
    f.write(content)


with open("apply.html", "r") as f:
    content_html = f.read()

# 2. Add Match button to static cards DOM script
old_js = """          compBtn.onclick = () => markAsComplete(title, domain, pay);
          
          saveBtn.parentNode.insertBefore(compBtn, saveBtn.nextSibling);"""

new_js = """          compBtn.onclick = () => markAsComplete(title, domain, pay);
          
          const matchBtn = document.createElement('button');
          matchBtn.innerHTML = '🎯';
          matchBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s; margin-left:8px;';
          matchBtn.onmouseover = () => { matchBtn.style.background = 'var(--primary-light)'; matchBtn.style.color = 'var(--primary-dark)'; };
          matchBtn.onmouseout = () => { matchBtn.style.background = 'var(--gray-100)'; matchBtn.style.color = 'var(--gray-700)'; };
          matchBtn.onclick = () => document.getElementById('aws-file-input').click();

          saveBtn.parentNode.insertBefore(compBtn, saveBtn.nextSibling);
          compBtn.parentNode.insertBefore(matchBtn, compBtn.nextSibling);"""

if "matchBtn.innerHTML = '🎯'" not in content_html:
    content_html = content_html.replace(old_js, new_js)

# 3. Add Match button to AI Matched cards
old_matched = """<button type="button" onclick="markAsComplete('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>"""
new_matched = old_matched + """\n                      <button type="button" onclick="document.getElementById('aws-file-input').click();" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>"""

if "🎯" not in content_html:
    content_html = content_html.replace(old_matched, new_matched)

with open("apply.html", "w") as f:
    f.write(content_html)
