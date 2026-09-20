import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace active view
start_idx = html.find('<div id="active-view" style="display:none;">')
end_idx = html.find('</div>\n  </div>\n\n  <!-- Pipeline Map -->')

# Let's be safer. Find the end of active-view
# We know the cheat sheet is above, sim-container is around it.
# The end of active-view is right before `</div>\n  </div>\n\n  <!-- Pipeline Map -->` ?
