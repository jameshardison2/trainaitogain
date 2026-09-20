import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Generate the massive options list
roles = [
    ('Senior Python / ML Evaluator', 'software'),
    ('C++ Systems & Performance', 'software'),
    ('Frontend / React Architecture', 'software'),
    ('Data Engineering / SQL Architect', 'software'),
    ('Security & Cryptography', 'software'),
    ('General SWE / Leetcode Master', 'software'),
    ('Rust Backend Engineer', 'software'),
    ('Go Cloud Infrastructure', 'software'),
    ('AI Research Scientist', 'software'),
    ('DevOps / SRE Architect', 'software'),
    ('Blockchain / Web3 Developer', 'software'),
    ('iOS / Swift Engineer', 'software'),
    ('Android / Kotlin Expert', 'software'),
    ('Embedded Systems C/C++', 'software'),
    
    ('Oncology AI Reviewer', 'medical'),
    ('Neurology / BCI Annotator', 'medical'),
    ('General Practitioner Evaluator', 'medical'),
    ('Pharmacology Expert', 'medical'),
    ('Surgical Methodology', 'medical'),
    ('Radiology / MRI Annotator', 'medical'),
    ('Cardiology Diagnostic Reviewer', 'medical'),
    ('Pediatrics Case Specialist', 'medical'),
    ('Psychiatry / Therapy AI Analyst', 'medical'),
    ('Dermatology Vision Model Expert', 'medical'),
    ('Pathology Slide Reviewer', 'medical'),
    
    ('Quant Dev / Algo Trader', 'finance'),
    ('Actuarial Science Reviewer', 'finance'),
    ('Corporate Finance / M&A', 'finance'),
    ('PhD Level Mathematician', 'math'),
    ('Tax Strategy & Compliance', 'finance'),
    ('Hedge Fund Risk Analyst', 'finance'),
    ('Derivatives Pricing Expert', 'finance'),
    ('Crypto Economics Researcher', 'finance'),
    ('Venture Capital Analyst', 'finance'),
    ('Macroeconomics Forecaster', 'finance'),
    
    ('Japanese/English Cultural Context', 'language'),
    ('Arabic Natural Language Processing', 'language'),
    ('Spanish / English Localization', 'language'),
    ('Mandarin Tone & Nuance Evaluator', 'language'),
    ('French Medical Translation', 'language'),
    ('German Financial Documentation', 'language'),
    ('Hindi Speech-to-Text Annotator', 'language'),
    ('Korean Sentiment Analysis', 'language'),
    ('Russian Political Context Reviewer', 'language'),
    
    ('Legal & Compliance Expert', 'legal'),
    
    ('Creative Writer / Fiction Author', 'creative'),
    ('Journalism Fact Checker', 'creative'),
    
    ('Product Manager (Technical)', 'product'),
    
    ('Data Scientist & Analyst', 'data'),
    
    ('History / Humanities Expert', 'general'),
    ('Instruction Following Evaluator', 'general'),
    ('Prompt Engineering Specialist', 'general'),
    ('General AI Training', 'general')
]

options_html = ""
for role, domain in roles:
    options_html += f'        <option value="{domain}">Role: {role}</option>\n'

# Find the old select block and replace it
find_select_start = '<select id="domain-selector" class="domain-selector">'
find_select_end = '</select>'

idx_start = html.find(find_select_start)
idx_end = html.find(find_select_end, idx_start)

if idx_start != -1 and idx_end != -1:
    new_select = find_select_start + '\n' + options_html + '      ' + find_select_end
    html = html[:idx_start] + new_select + html[idx_end + len(find_select_end):]

# Update the JavaScript so that if `atsRole` matches an option exactly, it selects that option instead of just the first domain match.
find_js_old = """  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
      
      if (atsDomain && domainData[atsDomain]) {
          currentDomain = atsDomain;
          currentQuestions = domainData[currentDomain];
          domainSelector.value = atsDomain;
      }
  } else {"""

replace_js_new = """  if (atsRole) {
      const titleEl = document.querySelector('#setup-view h2');
      if (titleEl) {
          titleEl.innerHTML = 'Mock Interview:<br><span style="color:var(--primary); font-size:22px;">' + atsRole + '</span>';
      }
      
      if (atsDomain && domainData[atsDomain]) {
          currentDomain = atsDomain;
          currentQuestions = domainData[currentDomain];
          
          // Try to select the exact role if it exists in the dropdown
          let foundExact = false;
          for (let i = 0; i < domainSelector.options.length; i++) {
              if (domainSelector.options[i].text === "Role: " + atsRole || domainSelector.options[i].text.includes(atsRole)) {
                  domainSelector.selectedIndex = i;
                  foundExact = true;
                  break;
              }
          }
          if (!foundExact) {
              domainSelector.value = atsDomain; // Fallback to domain match
          }
      }
  } else {"""

html = html.replace(find_js_old, replace_js_new)

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated dropdown with exhaustive list.")
