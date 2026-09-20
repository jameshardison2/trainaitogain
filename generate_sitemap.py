import os
import glob
from datetime import datetime

base_url = "https://trainaitogain.com"
html_files = glob.glob('*.html')

sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for file in html_files:
    # Exclude partials or things that shouldn't be indexed if necessary
    # We will just include all .html files
    url = f"{base_url}/{file}"
    if file == "index.html":
        url = f"{base_url}/"
        
    sitemap_content += '  <url>\n'
    sitemap_content += f'    <loc>{url}</loc>\n'
    sitemap_content += '    <changefreq>weekly</changefreq>\n'
    sitemap_content += '  </url>\n'

sitemap_content += '</urlset>'

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print("Sitemap generated successfully.")
