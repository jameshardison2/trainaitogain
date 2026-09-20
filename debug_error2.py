import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Put the debug message back
apply_html = apply_html.replace(
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing format. Please scroll down and select a role manually to continue.</span>';""",
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please screenshot this exact text and send it to your developer.</span>';"""
)

# And let's fix the tooltip so it doesn't say "No file chosen" by setting title=""
apply_html = apply_html.replace('opacity: 0;', 'opacity: 0; font-size: 0;" title="Click to Upload" ')

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Debug error injected again.")
