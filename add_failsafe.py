import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Make the error state graceful so candidates are never blocked from applying
apply_html = apply_html.replace(
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing resume: ' + (error.message || error) + '</span>';""",
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing format. Please scroll down and select a role manually to continue.</span>';"""
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Failsafe applied.")
