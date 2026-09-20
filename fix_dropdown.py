import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Unhide dropdown
find_sel = '<select id="domain-selector" class="domain-selector" style="display:none;">'
replace_sel = '<select id="domain-selector" class="domain-selector">'
html = html.replace(find_sel, replace_sel)

# 2. Add event listener and pre-selection logic
find_js = """  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
      
      if (atsDomain && domainData[atsDomain]) {
          currentDomain = atsDomain;
          currentQuestions = domainData[currentDomain];
      }
  }"""

replace_js = """  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
      
      if (atsDomain && domainData[atsDomain]) {
          currentDomain = atsDomain;
          currentQuestions = domainData[currentDomain];
          domainSelector.value = atsDomain;
      }
  } else {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">AI Software Engineer (RLHF)</span>';
      }
  }

  domainSelector.addEventListener('change', function() {
      currentDomain = this.value;
      currentQuestions = domainData[currentDomain];
      
      let newRole = this.options[this.selectedIndex].text.replace("Role: ", "");
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + newRole + '</span>';
      }
  });"""

html = html.replace(find_js, replace_js)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated ai-interview.html dropdown")
