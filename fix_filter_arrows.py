import re
with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Arrows to be Orange
old_left = """<button class="carousel-btn" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('${cat.id}')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>"""
new_left = """<button class="carousel-btn" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>"""

old_right = """<button class="carousel-btn" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('${cat.id}')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>"""
new_right = """<button class="carousel-btn" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>"""

content = content.replace(old_left, new_left)
content = content.replace(old_right, new_right)

# 2. Make Location filter Strict
old_loc_logic = """        let matchesLoc = (loc === 'ALL') || (cardLoc === loc);
        // If a role is marked as ALL globally remote, maybe let it show in US too? The user said "US Based", so let's be strict: if they ask for US, only show explicitly US or assume ALL means US is included? Actually, let's treat 'ALL' roles as global (matches both). 
        // Wait, user asked for filter for "US based" and "International". 
        // If the role is globally remote (loc == 'ALL'), it's technically both!
        if (loc !== 'ALL') {
             if (cardLoc === 'ALL') matchesLoc = true; // Global roles fit both filters
             else matchesLoc = (cardLoc === loc);
        }"""
new_loc_logic = """        let matchesLoc = true;
        if (loc !== 'ALL') {
            matchesLoc = (cardLoc === loc);
        }"""
content = content.replace(old_loc_logic, new_loc_logic)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
