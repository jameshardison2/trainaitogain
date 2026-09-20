import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace <select id="role-select"> with a custom dropdown structure
select_html_find = """<select id="role-select" style="width:100%; padding:14px; border-radius:var(--radius); border:2px solid var(--gray-200); font-family:var(--font); font-size:15px; margin-bottom:24px; cursor:pointer;">
      <option value="" disabled selected>Select an Active Wave Role...</option>
      <option value="software">AI Software Engineer (RLHF)</option>
      <option value="medical">Medical Expert (AI Training)</option>
      <option value="finance">Finance & Quantitative Expert (AI Training)</option>
      <option value="legal">Legal & Compliance Expert</option>
      <option value="creative">Creative Writer & Editor</option>
      <option value="data">Data Scientist & Analyst</option>
      <option value="product">Product Manager (Technical)</option>
      <option value="math">Advanced Math & Physics</option>
      <option value="language">Foreign Language Expert</option>
      <option value="general">General AI Training</option>
    </select>"""

if select_html_find in html:
    pass
else:
    # Use regex to find it, since the options might have been changed
    select_html_find = re.search(r'<select id="role-select".*?</select>', html, re.DOTALL).group(0)

custom_dropdown_html = """
    <div id="custom-role-select" style="position:relative; margin-bottom:24px;">
      <div id="custom-role-display" style="width:100%; padding:14px; border-radius:var(--radius); border:2px solid var(--gray-200); font-family:var(--font); font-size:15px; cursor:pointer; background:var(--white); display:flex; justify-content:space-between; align-items:center; box-sizing:border-box;">
        <span id="custom-role-text" style="color:var(--gray-500);">Select an Active Wave Role...</span>
        <span style="font-size:12px; color:var(--gray-500);">▼</span>
      </div>
      <div id="custom-role-options" style="display:none; position:absolute; top:100%; left:0; width:100%; background:var(--white); border:2px solid var(--gray-200); border-top:none; border-radius:0 0 var(--radius) var(--radius); max-height:250px; overflow-y:auto; z-index:100; box-shadow:var(--shadow-lg); box-sizing:border-box;">
        <!-- Options injected by JS -->
      </div>
    </div>
    <!-- Hidden input to store value so existing JS continues to work -->
    <input type="hidden" id="role-select" value="" />
"""

html = html.replace(select_html_find, custom_dropdown_html)

# Update the JS that populates the options
# We need to change:
# roleSelect.innerHTML = '<option value="" disabled selected>Select an Active Wave Role...</option>';
# to populating the custom-role-options div

js_find = """      // Clear existing hardcoded options
      roleSelect.innerHTML = '<option value="" disabled selected>Select an Active Wave Role...</option>';
      
      data.roles.forEach(role => {
        // Create option
        const opt = document.createElement('option');
        opt.value = role.title;
        opt.textContent = role.title + (role.status === 'ACTIVE' ? ' 🟢' : ' 🔴');
        roleSelect.appendChild(opt);
      });"""

js_replace = """
      const customOptionsDiv = document.getElementById('custom-role-options');
      const customDisplayText = document.getElementById('custom-role-text');
      const customDisplay = document.getElementById('custom-role-display');
      const hiddenInput = document.getElementById('role-select');
      
      customOptionsDiv.innerHTML = '';
      
      // Group roles by domain
      const domains = {};
      data.roles.forEach(role => {
          if (!domains[role.domain]) domains[role.domain] = [];
          domains[role.domain].push(role);
      });
      
      for (const [domain, roles] of Object.entries(domains)) {
          const groupHeader = document.createElement('div');
          groupHeader.style.padding = '8px 14px';
          groupHeader.style.background = 'var(--gray-100)';
          groupHeader.style.fontSize = '12px';
          groupHeader.style.fontWeight = '800';
          groupHeader.style.color = 'var(--gray-500)';
          groupHeader.style.textTransform = 'uppercase';
          groupHeader.style.letterSpacing = '0.05em';
          groupHeader.textContent = domain + ' PIPELINE';
          customOptionsDiv.appendChild(groupHeader);
          
          roles.forEach(role => {
            const opt = document.createElement('div');
            opt.style.padding = '12px 14px';
            opt.style.cursor = 'pointer';
            opt.style.borderBottom = '1px solid var(--gray-100)';
            opt.style.display = 'flex';
            opt.style.justifyContent = 'space-between';
            opt.style.alignItems = 'center';
            opt.style.transition = 'background 0.2s';
            
            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = '500';
            titleSpan.style.color = 'var(--black)';
            titleSpan.textContent = role.title;
            
            const badgeSpan = document.createElement('span');
            badgeSpan.style.fontSize = '12px';
            badgeSpan.textContent = role.status === 'ACTIVE' ? '🟢' : '🔴';
            
            opt.appendChild(titleSpan);
            opt.appendChild(badgeSpan);
            
            opt.onmouseover = () => opt.style.background = 'var(--gray-50)';
            opt.onmouseout = () => opt.style.background = 'var(--white)';
            
            opt.onclick = () => {
                hiddenInput.value = role.title;
                customDisplayText.textContent = role.title;
                customDisplayText.style.color = 'var(--black)';
                customDisplayText.style.fontWeight = '700';
                customOptionsDiv.style.display = 'none';
                
                // Trigger change event for existing logic
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
            };
            
            customOptionsDiv.appendChild(opt);
          });
      }
      
      customDisplay.onclick = () => {
          customOptionsDiv.style.display = customOptionsDiv.style.display === 'none' ? 'block' : 'none';
      };
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
          if (!document.getElementById('custom-role-select').contains(e.target)) {
              customOptionsDiv.style.display = 'none';
          }
      });
"""

if js_find in html:
    html = html.replace(js_find, js_replace)
else:
    print("WARNING: Could not find JS replacement string.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced native select with custom searchable dropdown!")
