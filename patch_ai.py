import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Swap prep-hub grid columns
content = content.replace('.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 48px; align-items: stretch; }', '.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: grid; grid-template-columns: 2fr 1fr; gap: 48px; align-items: stretch; }')

# 2. Swap DOM order of cheat-sheet and sim-container
# Finding the block for cheat-sheet and sim-container
# <div class="cheat-sheet" id="copilot-panel" ...> ... </div> \n <style>...</style> \n <!-- Voice Simulator --> \n <div class="sim-container" ...>

# We can just extract them using regex.
cheat_sheet_regex = r'(<div class="cheat-sheet".*?</div>\s*<style>.*?<\/style>)'
sim_container_regex = r'(<!-- Voice Simulator -->\s*<div class="sim-container" id="sim-container">.*?</div>\s*</section>)'
# Wait, parsing this with regex is hard because they contain many nested divs.

# A simpler way: we'll use exact replacement or split the HTML.
