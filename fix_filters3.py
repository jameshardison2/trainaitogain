import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Search Bar to include the two new dropdowns
old_search = """      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
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
      </div>"""

new_search = """      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
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
        <select id="jobLocationFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="ALL">All Locations</option>
            <option value="US">US Based</option>
            <option value="INTL">International</option>
        </select>
        <select id="jobSortFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="DEFAULT">Recommended Sort</option>
            <option value="PAY_HIGH">Highest Paying</option>
        </select>
      </div>"""
content = content.replace(old_search, new_search)

# 2. Add parser logic right before HTML injection
old_loop_start = """categoryRoles.forEach((role: JobCard) => {"""
new_loop_start = """categoryRoles.forEach((role: JobCard, index: number) => {
        let payYearly = 0;
        let pStr = (role.pay || '').toLowerCase().replace(/,/g, '');
        let m = pStr.match(/(\\d+)/);
        if (m) {
          let val = parseInt(m[1]);
          if (pStr.includes('k')) val *= 1000;
          if (pStr.includes('/hr')) payYearly = val * 2000;
          else if (pStr.includes('/mo')) payYearly = val * 12;
          else payYearly = val;
        }

        let loc = 'ALL';
        let searchStr = (role.title + ' ' + (role.tags || []).join(' ')).toLowerCase();
        if (searchStr.includes('(us)') || searchStr.includes('us-based') || searchStr.includes('us only') || searchStr.includes('united states')) {
            loc = 'US';
        } else if (searchStr.includes('india') || searchStr.includes('latam') || searchStr.includes('uk-based') || searchStr.includes('bilingual')) {
            loc = 'INTL';
        }"""
content = content.replace(old_loop_start, new_loop_start)

# 3. Add data attributes to the card and an initial order
old_card = """<div class="feature-card opp-card" data-domain="${role.domain}" data-platform="${role.platform || 'Mercor'}" style="flex:0 0 320px;"""
new_card = """<div class="feature-card opp-card" data-domain="${role.domain}" data-platform="${role.platform || 'Mercor'}" data-pay="${payYearly}" data-location="${loc}" data-index="${index}" style="flex:0 0 320px; order:${index};"""
content = content.replace(old_card, new_card)

# 4. Update Event Listeners to include the new dropdowns
old_events = """    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (domainFilter) domainFilter.addEventListener('change', filterJobs);"""
new_events = """    const locationFilter = document.getElementById('jobLocationFilter') as HTMLSelectElement;
    const sortFilter = document.getElementById('jobSortFilter') as HTMLSelectElement;
    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (domainFilter) domainFilter.addEventListener('change', filterJobs);
    if (locationFilter) locationFilter.addEventListener('change', filterJobs);
    if (sortFilter) sortFilter.addEventListener('change', filterJobs);"""
content = content.replace(old_events, new_events)

# 5. Update filterJobs to handle location and sorting
old_filter = """    function filterJobs() {
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
    }"""
new_filter = """    function filterJobs() {
      const term = searchInput ? searchInput.value.toLowerCase() : '';
      const domain = domainFilter ? domainFilter.value : 'ALL';
      const loc = locationFilter ? locationFilter.value : 'ALL';
      const sort = sortFilter ? sortFilter.value : 'DEFAULT';
      
      // Update individual cards
      const cards = carouselWrapper.querySelectorAll('.opp-card');
      
      let cardsArray = Array.from(cards);
      
      cardsArray.forEach((card: any) => {
        const text = card.textContent?.toLowerCase() || '';
        const cardDomain = card.getAttribute('data-domain');
        const cardPlatform = card.getAttribute('data-platform')?.toUpperCase() || '';
        const cardLoc = card.getAttribute('data-location');
        
        let matchesSearch = text.includes(term);
        let matchesDomain = true;
        if (domain !== 'ALL') {
          if (domain === 'MICRO1' || domain === 'MERCOR') {
            matchesDomain = cardPlatform === domain;
          } else {
            matchesDomain = cardDomain === domain;
          }
        }
        
        let matchesLoc = (loc === 'ALL') || (cardLoc === loc);
        // If a role is marked as ALL globally remote, maybe let it show in US too? The user said "US Based", so let's be strict: if they ask for US, only show explicitly US or assume ALL means US is included? Actually, let's treat 'ALL' roles as global (matches both). 
        // Wait, user asked for filter for "US based" and "International". 
        // If the role is globally remote (loc == 'ALL'), it's technically both!
        if (loc !== 'ALL') {
             if (cardLoc === 'ALL') matchesLoc = true; // Global roles fit both filters
             else matchesLoc = (cardLoc === loc);
        }
        
        if (matchesSearch && matchesDomain && matchesLoc) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Handle Sorting using Flex Order
      const containerWrappers = carouselWrapper.querySelectorAll('.carousel-container');
      containerWrappers.forEach((container: any) => {
         const containerCards = Array.from(container.querySelectorAll('.opp-card'));
         if (sort === 'PAY_HIGH') {
             containerCards.sort((a: any, b: any) => {
                 return parseInt(b.getAttribute('data-pay') || '0') - parseInt(a.getAttribute('data-pay') || '0');
             });
         } else {
             containerCards.sort((a: any, b: any) => {
                 return parseInt(a.getAttribute('data-index') || '0') - parseInt(b.getAttribute('data-index') || '0');
             });
         }
         // Assign order
         containerCards.forEach((c: any, i: number) => {
             c.style.order = i.toString();
         });
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
    }"""
content = content.replace(old_filter, new_filter)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
