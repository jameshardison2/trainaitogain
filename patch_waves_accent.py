import re

with open('render_waves.ts', 'r') as f:
    content = f.read()

# I previously replaced all var(--orange) with var(--primary). 
# This affected the job card border and the carousel buttons. Let's make them accent.
# Also the pay rate text callout: <div style="color:var(--primary); font-weight:800; font-size:16px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}</div>

# Change pay rate text callout
content = content.replace(
    'color:var(--primary); font-weight:800; font-size:16px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}',
    'color:var(--accent); font-weight:900; font-size:18px; text-align:right; white-space:nowrap; flex-shrink:0;">${role.pay}'
)

# Change job card borders. Currently they are: border:2px solid var(--primary); 
# Oh wait, I didn't replace them manually, I ran a generic `sed 's/var(--orange)/var(--primary)/g'`. 
# Let's see what they are now.
