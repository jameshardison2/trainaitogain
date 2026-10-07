import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the search bar html with search bar + dropdown
old_search = """
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
      </div>
"""

new_search = """
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
        <select id="jobDomainFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="ALL">All Categories</option>
            <option value="SOFTWARE">Software & Engineering</option>
            <option value="GENERAL">General & Expert</option>
            <option value="MEDICAL">Medical & Clinical</option>
            <option value="FINANCE">Finance & Economics</option>
            <option value="LEGAL">Legal & Compliance</option>
            <option value="MICRO1">Micro1 Roles</option>
            <option value="MERCOR">Mercor Roles</option>
        </select>
      </div>
"""
content = content.replace(old_search, new_search)

# 2. Add category-wrapper class and platform data attributes so we can filter them properly
# Find the start of the category html
cat_start_old = """
      html += `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
"""
cat_start_new = """
      html += `
        <div class="category-wrapper">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
"""
content = content.replace(cat_start_old, cat_start_new)

# Find the end of the category loop to close the category-wrapper
cat_end_old = """
      });
      html += `</div></div>`;
    });
"""
cat_end_new = """
      });
      html += `</div></div></div>`;
    });
"""
content = content.replace(cat_end_old, cat_end_new)

# Add data-platform to the cards
card_old = """<div class="feature-card opp-card" data-domain="${role.domain}" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">"""
card_new = """<div class="feature-card opp-card" data-domain="${role.domain}" data-platform="${role.platform || 'Mercor'}" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">"""
content = content.replace(card_old, card_new)

# 3. Update filterJobs to handle hiding empty categories and filtering by platform
filter_old = """
    function filterJobs() {
      const term = searchInput ? searchInput.value.toLowerCase() : '';
      const domain = domainFilter ? domainFilter.value : 'ALL';
      const cards = carouselWrapper.querySelectorAll('.opp-card');
      
      cards.forEach((card: any) => {
        const text = card.textContent?.toLowerCase() || '';
        const cardDomain = card.getAttribute('data-domain');
        
        let matchesSearch = text.includes(term);
        let matchesDomain = domain === 'ALL' || cardDomain === domain;
        
        if (matchesSearch && matchesDomain) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
"""

filter_new = """
    function filterJobs() {
      const term = searchInput ? searchInput.value.toLowerCase() : '';
      const domain = domainFilter ? domainFilter.value : 'ALL';
      
      // Update individual cards
      const cards = carouselWrapper.querySelectorAll('.opp-card');
      cards.forEach((card: any) => {
        const text = card.textContent?.toLowerCase() || '';
        const cardDomain = card.getAttribute('data-domain');
        const cardPlatform = card.getAttribute('data-platform')?.toUpperCase() || '';
        
        let matchesSearch = text.includes(term);
        let matchesDomain = true;
        if (domain !== 'ALL') {
          if (domain === 'MICRO1' || domain === 'MERCOR') {
            matchesDomain = cardPlatform === domain;
          } else {
            matchesDomain = cardDomain === domain;
          }
        }
        
        if (matchesSearch && matchesDomain) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Hide empty category carousels
      const wrappers = carouselWrapper.querySelectorAll('.category-wrapper');
      wrappers.forEach((wrapper: any) => {
        const visibleCards = Array.from(wrapper.querySelectorAll('.opp-card')).filter((c: any) => c.style.display !== 'none');
        if (visibleCards.length === 0) {
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = 'block';
        }
      });
    }
"""
content = content.replace(filter_old, filter_new)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
