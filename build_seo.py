import os
import re

base_url = "https://trainaitogain.com"

# Get all html files
html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'ai-interview_1.html']

# 1. Generate sitemap.xml
sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for file in html_files:
    url = f"{base_url}/{file}"
    if file == 'index.html':
        url = f"{base_url}/"
        priority = "1.0"
    elif file.startswith('role-'):
        priority = "0.9"
    else:
        priority = "0.8"
        
    sitemap_content += f"  <url>\n    <loc>{url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>{priority}</priority>\n  </url>\n"
    
sitemap_content += '</urlset>'

with open('sitemap.xml', 'w') as f:
    f.write(sitemap_content)
print("Created sitemap.xml")

# 2. Generate robots.txt
robots_content = f"User-agent: *\nAllow: /\n\nSitemap: {base_url}/sitemap.xml\n"
with open('robots.txt', 'w') as f:
    f.write(robots_content)
print("Created robots.txt")

# 3. Inject SEO keywords and Canonical links into all HTML files
keywords = "Mercor AI interview, Mercor interview questions, Mercor SWE evaluator, Mercor jobs, Mercor referral, train AI models, RLHF jobs, Mercor $150 hr, Mercor medical evaluator"

for file in html_files:
    with open(file, 'r') as f:
        html = f.read()
        
    url = f"{base_url}/{file}"
    if file == 'index.html':
        url = f"{base_url}/"
        
    # Ensure canonical link is present and correct
    if '<link rel="canonical"' in html:
        html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', html)
    else:
        html = html.replace('</head>', f'  <link rel="canonical" href="{url}">\n</head>')
        
    # Ensure keywords meta is present
    if '<meta name="keywords"' not in html:
        html = html.replace('</head>', f'  <meta name="keywords" content="{keywords}">\n</head>')
        
    # Ensure og:url is correct
    if '<meta property="og:url"' in html:
        html = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', html)
        
    with open(file, 'w') as f:
        f.write(html)
        
print("Injected SEO metadata into all HTML files.")
