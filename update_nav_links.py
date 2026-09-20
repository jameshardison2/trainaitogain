import glob
import re

new_nav_links = """        <ul class="nav-links">
          <li><a href="index.html#waves">Active Waves</a></li>
          <li><a href="ai-interview.html">AI Interview</a></li>
          <li><a href="what-mercor-looks-for.html">What They Look For</a></li>
          <li><a href="is-it-worth-it.html">Worth It?</a></li>
          <li><a href="no-response.html">No Response?</a></li>
          <li><a href="TrainAIToGain_The_Gain_Blueprint.pdf" download>Guide PDF</a></li>
        </ul>"""

nav_pattern = re.compile(r'<ul class="nav-links">.*?</ul>', re.DOTALL)

html_files = glob.glob('/Users/176693/Documents/trainaitogain_site_seo_ready/*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    new_content = nav_pattern.sub(new_nav_links, content)
    
    with open(file, 'w') as f:
        f.write(new_content)

print("Restored all guide links to nav.")
