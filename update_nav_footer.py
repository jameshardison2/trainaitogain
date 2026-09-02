import os
import re
import glob

def get_block(filepath, start_tag, end_tag):
    with open(filepath, 'r') as f:
        content = f.read()
    pattern = re.compile(f'({start_tag}.*?{end_tag})', re.DOTALL)
    match = pattern.search(content)
    if match:
        return match.group(1)
    return None

def replace_block(filepath, start_tag, end_tag, new_block):
    with open(filepath, 'r') as f:
        content = f.read()
    pattern = re.compile(f'({start_tag}.*?{end_tag})', re.DOTALL)
    new_content = pattern.sub(new_block.replace('\\', '\\\\'), content)
    with open(filepath, 'w') as f:
        f.write(new_content)

index_file = 'index.html'
nav_block = get_block(index_file, '<header class="nav">', '</header>')
footer_block = get_block(index_file, '<footer', '</footer>')

html_files = glob.glob('*.html')
html_files.remove('index.html')

if 'ai-interview_1.html' in html_files:
    html_files.remove('ai-interview_1.html')

for hf in html_files:
    if nav_block:
        replace_block(hf, '<header class="nav">', '</header>', nav_block)
        print(f"Updated nav in {hf}")
    if footer_block:
        replace_block(hf, '<footer', '</footer>', footer_block)
        print(f"Updated footer in {hf}")

