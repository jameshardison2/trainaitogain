import glob

html_files = glob.glob('*.html')

find_str = '<li><a href="hiring-pipeline.html" class="nav-link" style="color:var(--primary); font-weight:700; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> The Hiring Pipeline</a></li>'

replace_str = '<li><a href="hiring-pipeline.html" class="nav-link" style="background:var(--primary); color:var(--white); padding:8px 16px; border-radius:100px; font-weight:800; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(16, 185, 129, 0.3); transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'; this.style.boxShadow=\'0 6px 16px rgba(16, 185, 129, 0.4)\';" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'0 4px 12px rgba(16, 185, 129, 0.3)\';"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg> The Hiring Pipeline</a></li>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if find_str in html:
        html = html.replace(find_str, replace_str)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Updated {file}")

