import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Delete the PREREQUISITE block
start_block = '<!-- Prerequisite -->'
end_block = '<!-- Step 1 -->'
if start_block in html and end_block in html:
    idx1 = html.find(start_block)
    idx2 = html.find(end_block)
    html = html[:idx1] + html[idx2:]

# Rename ATS to AI
html = html.replace('Bypass the ATS Recruiter', 'Bypass the AI Recruiter')
html = html.replace('Automated Tracking Systems (ATS)', 'AI Recruiter Filters')
html = html.replace('Launch ATS Resume Optimizer ➔', 'Launch AI Resume Optimizer ➔')
html = html.replace('Step 1: ATS Optimizer', 'Step 1: Resume Optimizer')

# In prep-hub.html and post-hire.html, make sure 'ATS Optimizer' is changed to 'Resume Optimizer'
# (I already did this in prep-hub, but let's do it globally just in case)
