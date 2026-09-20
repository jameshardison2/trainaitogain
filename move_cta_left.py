import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the escaping issue that broke the button
js_escape_find = r".replace(/'/g, \"\\'\").replace(/\"/g, '&quot;');"
js_escape_replace = r".replace(/'/g, '&#39;').replace(/\"/g, '&quot;');"
if js_escape_find in html:
    html = html.replace(js_escape_find, js_escape_replace)
    print("Fixed prompt escaping!")
else:
    print("Could not find prompt escape string.")

# 2. Add item-4-container in the left column below scan-btn
html_left_find = """    <button class="btn-scan" id="scan-btn">Scan My Resume</button>"""
html_left_replace = """    <button class="btn-scan" id="scan-btn">Scan My Resume</button>
    <div id="item-4-container" style="display:none; margin-top:32px;"></div>"""
if html_left_find in html:
    html = html.replace(html_left_find, html_left_replace)
    print("Added item-4-container to left column!")

# 3. Update nudgeCTA to have the "4. " label and no container borders (since it will just be a natural section)
js_nudge_find = """        const nudgeCTA = `
          <div style="border: 1px solid var(--gray-300); border-radius: 8px; padding: 16px; margin-top: 16px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--black)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               <h4 style="margin:0; color:var(--black); font-weight:700; font-size:14px;">ATS Optimization Payload</h4>
            </div>
            <p style="margin:0 0 16px 0; color:var(--gray-600); font-size:13px; line-height:1.5;">Copy the pre-configured ATS payload to your clipboard and use your preferred external tool (e.g. Claude, ChatGPT) to automatically resolve the missing keywords.</p>
            <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--gray-800); color:white; border-radius:6px; padding:10px 16px; font-weight:600; font-size:13px; border:none; cursor:pointer; width:100%; transition: background 0.2s;" onmouseover="this.style.background='var(--black)';" onmouseout="this.style.background='var(--gray-800)';">
              Copy Optimization Payload
            </button>
            <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin:12px 0 0 0; line-height:1.4; text-align:center;">
              <em>System generates exact match phrasing</em>
            </p>
          </div>
        `;"""

js_nudge_replace = """        const nudgeCTA = `
          <div style="margin-top:0;">
            <label style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">4. ATS Optimization Payload:</label>
            <div style="background: var(--gray-50); border: 1px solid var(--gray-300); border-radius: var(--radius); padding: 16px;">
                <p style="margin:0 0 16px 0; color:var(--gray-600); font-size:13px; line-height:1.5;">Your ATS scan identified missing keywords. Copy the exact ATS payload and run it through your preferred external LLM (e.g. Claude, ChatGPT) to resolve them.</p>
                <button id="copy-prompt-btn" data-prompt='${escapedPrompt}' onclick="window.startAITimer(this);" style="background:var(--gray-800); color:white; border-radius:6px; padding:12px 16px; font-weight:700; font-size:14px; border:none; cursor:pointer; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.1); transition: background 0.2s;" onmouseover="this.style.background='var(--black)';" onmouseout="this.style.background='var(--gray-800)';">
                  Copy Optimization Payload 🪄
                </button>
                <p id="ai-helper-text" style="font-size:12px; color:var(--gray-500); margin:12px 0 0 0; line-height:1.4; text-align:center;">
                  <em>Generates custom exact match phrasing</em>
                </p>
            </div>
          </div>
        `;"""

if js_nudge_find in html:
    html = html.replace(js_nudge_find, js_nudge_replace)
    print("Redesigned nudgeCTA for left column!")

# 4. Inject it into item-4-container instead of ai-fix-container
js_if_find = "const fixContainer = document.getElementById('ai-fix-container');"
js_if_replace = """const fixContainer = document.getElementById('ai-fix-container');
        const item4Container = document.getElementById('item-4-container');
        if(item4Container) item4Container.style.display = 'block';"""
if js_if_find in html:
    html = html.replace(js_if_find, js_if_replace)

html = html.replace("fixContainer.innerHTML = nudgeCTA;", "item4Container.innerHTML = nudgeCTA;")
html = html.replace("fixContainer.innerHTML = '';", "if(item4Container) item4Container.style.display = 'none';")

# 5. Add clear logic on role reset
js_reset_find = "const fixContainer = document.getElementById('ai-fix-container');"
js_reset_replace = """const fixContainer = document.getElementById('ai-fix-container');
        const item4Container = document.getElementById('item-4-container');
        if(item4Container) { item4Container.innerHTML = ''; item4Container.style.display = 'none'; }"""
if js_reset_find in html:
    html = html.replace(js_reset_find, js_reset_replace)

# 6. Remove the old ai-fix-container from the HTML completely
html = html.replace('<div id="ai-fix-container"></div>', '')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)

