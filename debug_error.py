import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Make the error message print the exact technical reason so we can fix it
apply_html = apply_html.replace(
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing format. Please scroll down and select a role manually to continue.</span>';""",
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please take a screenshot of this red text and send it to your developer.</span>';"""
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Debug error injected.")
