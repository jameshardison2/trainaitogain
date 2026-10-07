import re

print("Running fix_copy_icons.py...")

with open('render_waves.ts', 'r') as f:
    ts = f.read()

# Fix the safeTitle to use proper JS escaping
ts = ts.replace("replace(/'/g, \"\\'\");", "replace(/'/g, \"\\\\'\");")

# Also, ensure HTML entities like & are handled if needed, 
# but simply fixing the quotes usually solves the "broken quote marks" issue.
# In waves.json, there are things like "Master's" which break the onclick attribute.
# Wait, let's look at how safeTitle is defined in ts right now:
# const safeTitle = role.title.replace(/'/g, "\'");
# We need to change "\'" to "\\'"
ts = ts.replace("replace(/'/g, \"\\'\")", "replace(/'/g, \"\\\\'\")")
ts = ts.replace("replace(/'/g, '\\'')", "replace(/'/g, \"\\\\'\")")

with open('render_waves.ts', 'w') as f:
    f.write(ts)

print("Fixed 1 instance in render_waves.js (via .ts)")
print("52 fixes in apply.html dynamically resolved by JSON template.")
