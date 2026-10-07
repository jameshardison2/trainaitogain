import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Standardize to width:24px; height:24px; min-width:24px; flex-shrink:0;
    
    # Case 1: missing width
    content = content.replace(
        'style="height:24px; filter: brightness(0) invert(1);"',
        'style="height:24px; width:24px; min-width:24px; flex-shrink:0; filter: brightness(0) invert(1);"'
    )
    
    # Case 2: already has width:24px (from previous patches) but not the robust flex properties
    content = content.replace(
        'style="height:24px; width:24px; filter: brightness(0) invert(1);"',
        'style="height:24px; width:24px; min-width:24px; flex-shrink:0; filter: brightness(0) invert(1);"'
    )
    
    with open(file, 'w') as f:
        f.write(content)

print("Fixed all footer logos")
