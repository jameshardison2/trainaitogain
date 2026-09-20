import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract the options from the existing <select>
options_match = re.search(r'<select id="domain-selector" class="domain-selector">(.*?)</select>', html, re.DOTALL)
if options_match:
    options_html = options_match.group(1)
    
    # 2. Build the new custom HTML
    custom_html = """
      <div id="custom-domain-selector" style="position:relative; max-width:400px; margin: 0 auto 24px auto; text-align:left;">
          <div id="cds-display" style="width:100%; padding:14px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:var(--white); font-family:inherit; font-size:16px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:border-color 0.2s;">
              <span id="cds-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Role: Senior Python / ML Evaluator</span>
              <span style="font-size:12px; margin-left:12px;">▼</span>
          </div>
          <div id="cds-options" style="display:none; position:absolute; top:100%; left:0; width:100%; background:#1a1a1a; border:1px solid rgba(255,255,255,0.2); border-radius:8px; max-height:280px; overflow-y:auto; z-index:100; margin-top:4px; box-shadow:0 10px 25px rgba(0,0,0,0.8);">
              <!-- Options will be injected by JS -->
          </div>
      </div>
      <!-- Keep the select hidden so existing references (if any) don't crash -->
      <select id="domain-selector" style="display:none;">""" + options_html + "</select>"
      
    html = html.replace(options_match.group(0), custom_html)

# 3. Inject the JavaScript to power it and fix the h2 update bug
js_injection = """
  const cdsDisplay = document.getElementById('cds-display');
  const cdsOptions = document.getElementById('cds-options');
  const cdsText = document.getElementById('cds-text');
  
  // Populate custom options from hidden select
  Array.from(domainSelector.options).forEach(opt => {
      const div = document.createElement('div');
      div.style.padding = '12px 16px';
      div.style.cursor = 'pointer';
      div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      div.style.color = '#ccc';
      div.style.fontSize = '14px';
      div.style.transition = 'background 0.2s, color 0.2s';
      div.innerText = opt.text;
      
      div.onmouseover = () => { div.style.background = 'rgba(255,255,255,0.1)'; div.style.color = 'white'; };
      div.onmouseout = () => { div.style.background = 'transparent'; div.style.color = '#ccc'; };
      
      div.onclick = () => {
          cdsText.innerText = opt.text;
          cdsOptions.style.display = 'none';
          domainSelector.value = opt.value;
          currentDomain = opt.value;
          currentQuestions = domainData[currentDomain];
          
          // FIX UP THE POSITION ABOVE (h2 title)
          const newRole = opt.text.replace("Role: ", "");
          const titleEl = document.querySelector('#setup-view h2');
          if (titleEl) {
              titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + newRole + '</span>';
          }
      };
      cdsOptions.appendChild(div);
  });
  
  cdsDisplay.onclick = () => {
      cdsOptions.style.display = cdsOptions.style.display === 'none' ? 'block' : 'none';
      cdsDisplay.style.borderColor = cdsOptions.style.display === 'block' ? 'var(--primary)' : 'rgba(255,255,255,0.2)';
  };
  
  document.addEventListener('click', (e) => {
      const container = document.getElementById('custom-domain-selector');
      if (container && !container.contains(e.target)) {
          cdsOptions.style.display = 'none';
          cdsDisplay.style.borderColor = 'rgba(255,255,255,0.2)';
      }
  });
  
  // Also update cdsText if atsRole was set on load
  if (atsRole) {
      cdsText.innerText = "Role: " + atsRole;
  }
"""

html = html.replace('const avatarRing = document.getElementById(\'avatar-ring\');', js_injection + '\n  const avatarRing = document.getElementById(\'avatar-ring\');')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Built custom dropdown")
