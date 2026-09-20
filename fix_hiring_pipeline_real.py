import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Delete the PREREQUISITE block
start_block = '      <!-- Step 0: Create Profile -->'
end_block = '      <!-- Step 1 -->'
if start_block in html and end_block in html:
    idx1 = html.find(start_block)
    idx2 = html.find(end_block)
    html = html[:idx1] + html[idx2:]
    print("Deleted Step 0 block")
else:
    print("Could not find start/end block comments. Using Regex fallback.")
    # Fallback regex
    html = re.sub(r'<div class="pipeline-step".*?CRITICAL PREREQUISITE.*?</div>\n      </div>', '', html, flags=re.DOTALL)


# Rename ATS to AI
html = html.replace('Bypass the ATS Recruiter', 'Bypass the AI Recruiter')
html = html.replace('Automated Tracking Systems (ATS)', 'AI Recruiter Filters')
html = html.replace('Launch ATS Resume Optimizer ➔', 'Launch AI Resume Optimizer ➔')
html = html.replace('Step 1: ATS Optimizer', 'Step 1: Resume Optimizer')
html = html.replace('bypass ATS filters', 'bypass AI filters')
html = html.replace('ATS optimization checklists', 'AI optimization checklists')

with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
    f.write(html)
