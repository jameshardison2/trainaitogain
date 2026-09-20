import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I need to modify the JS that builds the custom options
js_find = """      customOptionsDiv.innerHTML = '';
      
      // Group roles by domain"""

js_replace = """      customOptionsDiv.innerHTML = '';
      
      // Add a search input
      const searchContainer = document.createElement('div');
      searchContainer.style.padding = '8px 14px';
      searchContainer.style.background = 'var(--white)';
      searchContainer.style.borderBottom = '1px solid var(--gray-200)';
      searchContainer.style.position = 'sticky';
      searchContainer.style.top = '0';
      searchContainer.style.zIndex = '10';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search 34+ live roles...';
      searchInput.style.width = '100%';
      searchInput.style.padding = '10px';
      searchInput.style.borderRadius = 'var(--radius-sm)';
      searchInput.style.border = '1px solid var(--gray-300)';
      searchInput.style.boxSizing = 'border-box';
      searchInput.style.fontSize = '14px';
      searchInput.style.fontFamily = 'var(--font)';
      
      searchContainer.appendChild(searchInput);
      customOptionsDiv.appendChild(searchContainer);
      
      const optionElements = [];
      
      // Group roles by domain"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    
    # We also need to add search logic and push elements to optionElements
    # In the loop where roles are added:
    
    js_find2 = """            opt.onclick = () => {
                hiddenInput.value = role.title;
                customDisplayText.textContent = role.title;
                customDisplayText.style.color = 'var(--black)';
                customDisplayText.style.fontWeight = '700';
                customOptionsDiv.style.display = 'none';
                
                // Trigger change event for existing logic
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
            };
            
            customOptionsDiv.appendChild(opt);"""
            
    js_replace2 = """            opt.onclick = () => {
                hiddenInput.value = role.title;
                customDisplayText.textContent = role.title;
                customDisplayText.style.color = 'var(--black)';
                customDisplayText.style.fontWeight = '700';
                customOptionsDiv.style.display = 'none';
                searchInput.value = ''; // Reset search
                optionElements.forEach(el => {
                    el.opt.style.display = 'flex';
                    if(el.header) el.header.style.display = 'block';
                });
                
                // Trigger change event for existing logic
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);
            };
            
            customOptionsDiv.appendChild(opt);
            optionElements.push({ opt: opt, title: role.title.toLowerCase(), domain: domain.toLowerCase(), header: groupHeader });"""

    html = html.replace(js_find2, js_replace2)
    
    # And add the search event listener after the domains loop
    js_find3 = """      customDisplay.onclick = () => {"""
    js_replace3 = """
      searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const visibleHeaders = new Set();
          
          optionElements.forEach(el => {
              if (el.title.includes(query) || el.domain.includes(query)) {
                  el.opt.style.display = 'flex';
                  visibleHeaders.add(el.header);
              } else {
                  el.opt.style.display = 'none';
              }
          });
          
          // Hide headers that have no visible children
          optionElements.forEach(el => {
              if (visibleHeaders.has(el.header)) {
                  el.header.style.display = 'block';
              } else {
                  el.header.style.display = 'none';
              }
          });
      });
      
      customDisplay.onclick = () => {"""
      
    html = html.replace(js_find3, js_replace3)
    
    # Wait, the search input needs focus when opened!
    js_find4 = """      customDisplay.onclick = () => {
          customOptionsDiv.style.display = customOptionsDiv.style.display === 'none' ? 'block' : 'none';
      };"""
    js_replace4 = """      customDisplay.onclick = () => {
          if (customOptionsDiv.style.display === 'none') {
              customOptionsDiv.style.display = 'block';
              searchInput.focus();
          } else {
              customOptionsDiv.style.display = 'none';
          }
      };"""
      
    html = html.replace(js_find4, js_replace4)
    
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added search logic!")
else:
    print("Could not find js_find block.")
