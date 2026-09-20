import re

# Part 1: Update resume-ats-guide.html to save the domain and role
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    ats = f.read()

find_click = "hiddenInput.value = role.title;"
replace_click = "hiddenInput.value = role.title;\\n                hiddenInput.setAttribute('data-domain', domain);"
if find_click in ats:
    ats = ats.replace(find_click, replace_click)

find_save = "localStorage.setItem('atsRole', selectedRole);"
replace_save = "localStorage.setItem('atsRole', selectedRole);\\n        const selectedDomain = document.getElementById('role-select').getAttribute('data-domain') || 'Software Engineering';\\n        localStorage.setItem('atsDomain', selectedDomain);"
if find_save in ats:
    ats = ats.replace(find_save, replace_save)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(ats)
print("Updated ATS Scanner to save domain.")


# Part 2: Update ai-interview.html to use the saved role and domain
with open('ai-interview.html', 'r', encoding='utf-8') as f:
    ai = f.read()

find_script = "const domainSelector = document.getElementById('domain-selector');"
replace_script = """const domainSelector = document.getElementById('domain-selector');
  
  // Auto-fill from ATS Scanner
  const atsRole = localStorage.getItem('atsRole');
  const atsDomain = localStorage.getItem('atsDomain');
  
  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
  }
  
  if (atsDomain) {
      const domLow = atsDomain.toLowerCase();
      let matchedValue = 'software';
      if (domLow.includes('medical') || domLow.includes('health')) matchedValue = 'medical';
      if (domLow.includes('finance') || domLow.includes('quant')) matchedValue = 'finance';
      if (domLow.includes('legal') || domLow.includes('law')) matchedValue = 'legal';
      if (domLow.includes('creative') || domLow.includes('writer')) matchedValue = 'creative';
      if (domLow.includes('data')) matchedValue = 'data';
      if (domLow.includes('product')) matchedValue = 'product';
      
      domainSelector.value = matchedValue;
      
      // Update the option text to match their exact role!
      const option = domainSelector.querySelector('option[value="' + matchedValue + '"]');
      if (option && atsRole) {
          option.text = "Role: " + atsRole;
      }
  }
"""

if find_script in ai:
    ai = ai.replace(find_script, replace_script)
    print("Updated AI Interview to read domain.")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(ai)

