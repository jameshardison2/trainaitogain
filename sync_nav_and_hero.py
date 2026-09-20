import glob
import re

# The desired nav block
nav_html = """  <header class="nav">
    <div class="container">
      <div class="nav-inner">
        <a class="nav-logo" href="index.html">
          <div class="logo-circle">
            <span style="color:white; font-weight:800; font-size:18px;">T</span>
          </div>
          <div class="logo-text">
            <span class="logo-top">TrainAI</span>
            <span class="logo-bottom">ToGain</span>
          </div>
        </a>
        <ul class="nav-links">
          <li><a href="index.html#waves">Active Waves</a></li>
          <li><a href="index.html#eligibility">Check Eligibility</a></li>
          <li><a href="no-response.html">Stuck Application?</a></li>
          <li><a href="TrainAIToGain_The_Gain_Blueprint.pdf" download>Blueprint PDF</a></li>
        </ul>
        <div class="nav-cta">
          <a href="https://t.mercor.com/wbPMF" class="btn-nav-primary">Apply Now</a>
        </div>
      </div>
    </div>
  </header>"""

nav_pattern = re.compile(r'<header class="nav">.*?</header>', re.DOTALL)

# Sync nav to all HTML files
html_files = glob.glob('/Users/176693/Documents/trainaitogain_site_seo_ready/*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    new_content = nav_pattern.sub(nav_html, content)
    
    with open(file, 'w') as f:
        f.write(new_content)

print("Nav synced across all pages.")

# Now, copy apply.html hero to index.html
with open('/Users/176693/Documents/trainaitogain_site_seo_ready/apply.html', 'r') as f:
    apply_content = f.read()

hero_pattern = re.compile(r'(<!-- ─── Hero ─────────────────────────────────────────── -->\s*<section class="hero">.*?</section>)', re.DOTALL)
match_hero = hero_pattern.search(apply_content)
if match_hero:
    apply_hero = match_hero.group(1)
    
    with open('/Users/176693/Documents/trainaitogain_site_seo_ready/index.html', 'r') as f:
        index_content = f.read()
        
    # Replace index hero with apply hero
    index_content = hero_pattern.sub(apply_hero, index_content)
    
    with open('/Users/176693/Documents/trainaitogain_site_seo_ready/index.html', 'w') as f:
        f.write(index_content)
    print("Hero copied to index.html.")
