import re

with open('/Users/176693/Documents/trainaitogain_site_seo_ready/index.html', 'r') as f:
    content = f.read()

# We need to replace the hero-left content back to the original index.html text
new_hero_left = """        <div class="hero-left">
          <p class="hero-eyebrow">For people mid-application</p>
          <h1 class="hero-heading">
            Straight answers about applying to <span class="orange">Mercor.</span>
          </h1>
          <p class="hero-sub">
            Most of what's written about Mercor is either a pitch or a rant. This is the middle: what the process actually does, why it goes quiet, and what's worth doing about it.
          </p>
          <div class="hero-actions">
            <a href="TrainAIToGain_The_Gain_Blueprint.pdf" download class="btn-primary">Download Guide PDF</a>
            <a href="https://t.mercor.com/wbPMF" class="btn-secondary">Apply via Mercor</a>
          </div>
          <p style="font-size: 14px; color: var(--gray-500); margin-top: 16px;">
            Note: You will need to create a free Mercor account before starting the application.
          </p>
        </div>"""

pattern = re.compile(r'<div class="hero-left">.*?</div>\s*<div class="hero-right">', re.DOTALL)
content = pattern.sub(new_hero_left + '\n        \n        <div class="hero-right">', content)

with open('/Users/176693/Documents/trainaitogain_site_seo_ready/index.html', 'w') as f:
    f.write(content)
