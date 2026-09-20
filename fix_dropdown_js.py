import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The JS we want to replace:
# roleSelect.innerHTML = '<option value="" disabled selected>Select an Active Wave Role...</option>';
# data.roles.forEach(role => { ... roleSelect.appendChild(opt); });

start_idx = html.find("roleSelect.innerHTML = '<option value=\"\" disabled selected>Select an Active Wave Role...</option>';")
end_idx = html.find("});", start_idx) + 3

if start_idx != -1 and end_idx != -1:
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
          groupHeader.style.fontSize = '11px';
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
            titleSpan.style.fontWeight = '600';
            titleSpan.style.color = 'var(--black)';
            titleSpan.style.fontSize = '14px';
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
          const selectComponent = document.getElementById('custom-role-select');
          if (selectComponent && !selectComponent.contains(e.target)) {
              customOptionsDiv.style.display = 'none';
          }
      });
"""
    html = html[:start_idx] + js_replace + html[end_idx:]
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed JS logic!")
else:
    print("Could not find JS logic to replace.")
