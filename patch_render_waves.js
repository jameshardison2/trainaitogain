const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

const filterLogic = `
(window as any).applyJobFilters = () => {
    const searchInput = document.getElementById('jobSearchInput') as HTMLInputElement;
    const locSelect = document.getElementById('locationFilter') as HTMLSelectElement;
    const catSelect = document.getElementById('categoryFilter') as HTMLSelectElement;
    
    if (!searchInput || !locSelect || !catSelect) return;
    
    const searchVal = searchInput.value.toLowerCase().trim();
    const locVal = locSelect.value;
    const catVal = catSelect.value;
    
    const allCards = document.querySelectorAll('.opp-card');
    let hasResults = false;
    
    allCards.forEach(card => {
        const el = card as HTMLElement;
        const cDomain = el.getAttribute('data-domain') || '';
        const cLoc = el.getAttribute('data-location') || 'ALL';
        const cText = (el.textContent || '').toLowerCase();
        
        let matchSearch = !searchVal || cText.includes(searchVal);
        
        let matchLoc = true;
        if (locVal === 'US') {
            matchLoc = (cLoc === 'US');
        } else if (locVal === 'INTL') {
            matchLoc = (cLoc === 'INTL' || cLoc === 'ALL');
        }
        
        let matchCat = true;
        if (catVal !== 'ALL') {
            matchCat = (cDomain === catVal);
        }
        
        if (matchSearch && matchLoc && matchCat) {
            el.style.display = 'flex';
            hasResults = true;
        } else {
            el.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.category-wrapper').forEach(wrapper => {
        const wel = wrapper as HTMLElement;
        const visibleCards = wel.querySelectorAll('.opp-card[style*="display: flex"]');
        if (visibleCards.length === 0) {
            wel.style.display = 'none';
        } else {
            wel.style.display = 'block';
        }
    });
    
    let noResDiv = document.getElementById('no-results-msg');
    if (!hasResults) {
        if (!noResDiv) {
            noResDiv = document.createElement('div');
            noResDiv.id = 'no-results-msg';
            noResDiv.style.padding = '40px 20px';
            noResDiv.style.textAlign = 'center';
            noResDiv.style.color = 'var(--gray-500)';
            noResDiv.style.fontSize = '18px';
            noResDiv.style.fontWeight = '600';
            noResDiv.innerHTML = '🚫 No jobs found matching your filters. Try clearing them!';
            const container = document.querySelector('.section .container');
            if (container) container.appendChild(noResDiv);
        }
        noResDiv.style.display = 'block';
    } else {
        if (noResDiv) noResDiv.style.display = 'none';
    }
};

`;

const filterHtml = `
      <div style="background:var(--white); padding:24px; border-radius:12px; border: 1px solid var(--gray-200); margin-bottom: 40px; box-shadow: var(--shadow-sm); display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
          <div style="flex: 1 1 250px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px;">🔍</span>
              <input type="text" id="jobSearchInput" placeholder="Search by title, role, skills..." style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; transition: all 0.2s;" onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px var(--primary-light)';" onblur="this.style.borderColor='var(--gray-300)'; this.style.boxShadow='none';" oninput="window.applyJobFilters()">
          </div>
          
          <div style="flex: 1 1 200px;">
              <select id="locationFilter" style="width:100%; padding:14px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="window.applyJobFilters()">
                  <option value="ALL">🌎 All Locations</option>
                  <option value="US">🇺🇸 US Based / US Only</option>
                  <option value="INTL">🌐 Global / Remote Anywhere</option>
              </select>
          </div>
          
          <div style="flex: 1 1 200px;">
              <select id="categoryFilter" style="width:100%; padding:14px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="window.applyJobFilters()">
                  <option value="ALL">📁 All Categories</option>
                  <option value="SOFTWARE">💻 Software & Engineering</option>
                  <option value="MEDICAL">⚕️ Medical & Clinical</option>
                  <option value="FINANCE">📈 Finance & Quant</option>
                  <option value="LEGAL">⚖️ Legal & Compliance</option>
                  <option value="LANGUAGE">🗣️ Translation & Voice</option>
                  <option value="SALES">🚀 Sales & Growth</option>
                  <option value="GENERAL">📋 General & Expert</option>
              </select>
          </div>
      </div>
    `;

// Inject the logic at the top of the file
if (!code.includes('applyJobFilters')) {
    code = filterLogic + code;
}

// Inject the filter UI before the carousels
code = code.replace("carouselWrapper.innerHTML = html;", "carouselWrapper.innerHTML = \`" + filterHtml + "\` + html;");

fs.writeFileSync('render_waves.ts', code);
console.log("Successfully patched render_waves.ts");
