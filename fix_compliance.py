import re

with open('apply.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the modal to not look like the official Mercor portal
html = html.replace('Application Next Steps', 'Before you apply...')
html = html.replace('You are about to enter the <strong>Mercor Universal Talent Network</strong>. To ensure your application is successful and you are properly routed, please follow these 3 steps closely:', 'You are leaving TrainAIToGain to apply on the official external network. Optional: Join our free newsletter to get interview prep tips sent to your inbox before you start.')

# Remove the 3 steps from the modal that make it look like an official process
steps_pattern = r'<div style="display:flex; gap:12px; margin-bottom:12px;">.*?<div style="display:flex; gap:12px; margin-bottom:24px;">.*?</div>'
html = re.sub(steps_pattern, '', html, flags=re.DOTALL)

# Fix the button
html = html.replace('Proceed to Application Portal ➔', 'Join Newsletter & Continue to Application ➔')

# 2. Fix the Opportunities list to not look like fake individual job postings
html = html.replace('Browse all 50 active pipelines.', 'Browse domains currently being hired for in the network.')
# We will just change the buttons on the job cards to say "Apply via General Network" instead of "Apply Now"
html = html.replace('Apply Now</button>', 'Apply via Network</button>')

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Compliance fixes applied.")
