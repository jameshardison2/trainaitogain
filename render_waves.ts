// render_waves.ts

interface JobCard {
  id: string;
  title: string;
  domain: string;
  pay: string;
  status: string;
  badgeClass: string;
  description: string;
  tags: string[];
  linkTarget: string;
}

interface WavesData {
  lastUpdated: string;
  roles: JobCard[];
  closedRoles?: string[];
}

// Ensure saveRole is defined globally if it's called from inline onclick handlers
declare function saveRole(title: string, domain: string, pay: string): void;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('waves.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WavesData = await response.json();
    
    // 1. Create the Active Hiring Waves Carousel
    const carouselWrapper = document.createElement('div');
    carouselWrapper.style.marginBottom = '48px';
    carouselWrapper.style.position = 'relative';
    
    let html = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
        <div style="width:40px; height:40px; background:var(--orange-light); color:var(--orange); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">🌊</div>
        <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">Active Hiring Waves</h2>
        <span style="background:var(--orange); color:white; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800; margin-left:8px;">HIGH PRIORITY</span>
      </div>

      
      <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:24px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">What to expect after you click Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>First, create your account on the partner platform (Mercor or Micro1).</li>
          <li>Next, complete a roughly 20-minute AI interview (audio/video).</li>
          <li>Finally, matching can take a few days. Silence doesn't mean you're rejected—just keep an eye on your inbox!</li>
        </ul>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
        <select id="jobDomainFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
            <option value="ALL">All Categories</option>
            <option value="SOFTWARE">Software & Engineering</option>
            <option value="GENERAL">General & Expert</option>
            <option value="MEDICAL">Medical & Clinical</option>
            <option value="FINANCE">Finance & Economics</option>
            <option value="LEGAL">Legal & Compliance</option>
            <option value="COMPLETED">Completed Roles</option>
            <option value="MICRO1">Micro1 Roles</option>
            <option value="MERCOR">Mercor Roles</option>
        </select>
      </div>

      
      <div id="job-grid-waves" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:24px; padding: 12px 0 24px;">
    `;

    data.roles.forEach((role: JobCard) => {
      let tagsHtml = role.tags.map(t => `<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">${t}</span>`).join('');
      const bg = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
      
      // Escape strings for inline onclick
      const safeTitle = role.title.replace(/'/g, "\\'");
      const safeDomain = role.domain.replace(/'/g, "\\'");
      const safePay = role.pay.replace(/'/g, "\\'");

      html += `
        <div class="feature-card opp-card" data-domain="${role.domain}" style="background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;">
            <div style="display:flex; gap:8px;">
              <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
              <div style="padding:6px 10px; background:${bg}; color:white; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.status}</div>
            </div>
            <div style="color:var(--primary); font-weight:800; font-size:18px;">${role.pay}</div>
          </div>
          <h3 style="font-size:18px; margin-bottom:8px; color:var(--black); line-height:1.2;">${role.title}</h3>
          <p style="color:var(--gray-500); font-size:14px; margin-bottom:20px; flex-grow:1; line-height:1.6;">${role.description}</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:24px;">${tagsHtml}</div>
          <div style="display:flex; gap:8px;">
            <button style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';" onclick="const refCode = localStorage.getItem('affiliate_ref'); let targetUrl = '${role.linkTarget || 'https://t.mercor.com/wbPMF'}'; if (refCode && targetUrl.includes('mercor')) { if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode); } else if (refCode && targetUrl.includes('micro1')) { if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode); } window.open(targetUrl, '_blank')">Apply Now</button>
            <button onclick="saveRole('${safeTitle}', '${safeDomain}', '${safePay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
            <button onclick="markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>
            <button onclick="window.open('resume-ats-guide.html?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>
            
          </div>
          <div style="text-align:center; font-size:11px; color:var(--gray-500); margin-top:8px; font-weight:600;">Takes 3 mins • Have your PDF resume ready</div>
        </div>
      `;
    });
    
    html += `</div>`;
    carouselWrapper.innerHTML = html;
    
    const carouselsSection = document.querySelector('.section .container');
    if (carouselsSection && carouselsSection.firstChild) {
      carouselsSection.insertBefore(carouselWrapper, carouselsSection.firstChild);
    }

    // Search and Filter Logic
    const searchInput = document.getElementById('jobSearchInput') as HTMLInputElement;
    const domainFilter = document.getElementById('jobDomainFilter') as HTMLSelectElement;
    
    function filterJobs() {
      const term = searchInput.value.toLowerCase();
      const domain = domainFilter.value;
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
    
    searchInput?.addEventListener('input', filterJobs);
    domainFilter?.addEventListener('change', filterJobs);

    
    // 2. Synchronize Evergreen Carousels
    // Find all hardcoded cards
    const allCards = document.querySelectorAll('.opp-card');
    allCards.forEach((card: Element) => {
      const htmlCard = card as HTMLElement;
      // Don't update the ones we just injected in our new wrapper
      if (carouselWrapper.contains(htmlCard)) return;
      
      const titleEl = htmlCard.querySelector('h3');
      if (!titleEl) return;
      const title = titleEl.textContent?.trim();
      if (!title) return;
      
      // A) Remove Closed Roles
      if (data.closedRoles && data.closedRoles.includes(title)) {
        htmlCard.remove();
        return;
      }
      
      // B) Update Active Roles
      const matchingRole = data.roles.find((r: JobCard) => r.title === title);
      if (matchingRole) {
        // Update Pay
        const payEl = htmlCard.querySelector('div[style*="font-size:18px"]');
        if (payEl) payEl.textContent = matchingRole.pay;
        
        // Update Description
        const descEl = htmlCard.querySelector('p');
        if (descEl) descEl.textContent = matchingRole.description;
        
        // Add/Update Status Badge next to Domain Badge
        // Find the container holding the domain badge
        const badgesContainer = htmlCard.querySelector('.opp-card > div:first-child > div:first-child') as HTMLElement | null;
        if (badgesContainer) {
          // Check if status badge already exists
          let statusBadge = badgesContainer.querySelector('.dynamic-status') as HTMLElement | null;
          const bg = matchingRole.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
          
          if (!statusBadge) {
            statusBadge = document.createElement('div');
            statusBadge.className = 'dynamic-status';
            statusBadge.style.padding = '6px 10px';
            statusBadge.style.borderRadius = '6px';
            statusBadge.style.fontSize = '11px';
            statusBadge.style.fontWeight = '700';
            statusBadge.style.letterSpacing = '0.05em';
            statusBadge.style.textTransform = 'uppercase';
            // Make sure container is flex
            badgesContainer.style.display = 'flex';
            badgesContainer.style.gap = '8px';
            badgesContainer.appendChild(statusBadge);
          }
          statusBadge.style.background = bg;
          statusBadge.style.color = 'white';
          statusBadge.textContent = matchingRole.status;
        }
      }
    });
    
  } catch (error) {
    console.error("Error rendering waves:", error);
  }
});
