import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the grid definition with the carousel definition
grid_html = '''<div id="job-grid-waves" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:24px; padding: 12px 0 24px;">'''

carousel_html = '''<div style="position:relative;">
        <button class="carousel-btn" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('job-grid-waves')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
        <button class="carousel-btn" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('job-grid-waves')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>
        
        <div id="job-grid-waves" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;">
          <style>
            #job-grid-waves::-webkit-scrollbar { display: none; }
          </style>'''

content = content.replace(grid_html, carousel_html)

# Add min-width to the cards so they don't crush inside flex
card_start = '''<div class="feature-card opp-card" data-domain="${role.domain}" style="background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">'''
card_carousel = '''<div class="feature-card opp-card" data-domain="${role.domain}" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">'''

content = content.replace(card_start, card_carousel)

# Close the wrapper div
close_grid = '''</div>
    `;

    document.getElementById('dynamic-jobs-container')!.innerHTML = html;'''

close_carousel = '''</div>
      </div>
    `;

    document.getElementById('dynamic-jobs-container')!.innerHTML = html;'''

content = content.replace(close_grid, close_carousel)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Carousel restored in render_waves.ts!")
