import re

with open('ai-interview.html', 'r') as f:
    content = f.read()

# 1. Wrap Advanced Audio Settings in an accordion
old_audio = r'<label style="display:block; font-size:12px; color:#aaa; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">AI Voice Model \(Pick the most human one like Google US English, Samantha, or Daniel\):</label>.*?</p>\s*</div>'
# Wait, my regex might fail due to newline dots. Let's use a standard replace for the whole block.
