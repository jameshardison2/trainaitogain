import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the entire rendering block inside DOMContentLoaded
# Find where the rendering starts and ends.
# It starts around `// 1. Create the Active Hiring Waves Carousel`
# It ends around `const carouselsSection = document.querySelector('.section .container');`

start_marker = "// 1. Create the Active Hiring Waves Carousel"
end_marker = "const searchInput = document.getElementById('jobSearchInput') as HTMLInputElement;"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers!")
    exit(1)

new_logic = """// 1. Create the Dynamic Category Carousels
    const carouselWrapper = document.createElement('div');
    carouselWrapper.style.marginBottom = '48px';
    carouselWrapper.style.position = 'relative';

    const categories = [
      { id: 'carousel-software', name: 'Software & Tech Pipelines', icon: '💻', domain: 'SOFTWARE' },
      { id: 'carousel-medical', name: 'Medical & Clinical Pipelines', icon: '⚕️', domain: 'MEDICAL' },
      { id: 'carousel-finance', name: 'Finance & Quant Pipelines', icon: '📈', domain: 'FINANCE' },
      { id: 'carousel-legal', name: 'Translation & Law Pipelines', icon: '⚖️', domain: 'LEGAL' },
      { id: 'carousel-general', name: 'Generalist & Content Pipelines', icon: '📋', domain: 'GENERAL' }
    ];

    let html = `
      <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:48px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom:8px; color:var(--black); font-size:16px;">What to expect after you click Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li>First, create your account on the partner platform (Mercor or Micro1).</li>
          <li>Next, complete a roughly 20-minute AI interview (audio/video).</li>
          <li>Finally, matching can take a few days. Silence doesn't mean you're rejected—just keep an eye on your inbox!</li>
        </ul>
      </div>
    `;

    categories.forEach(cat => {
      const categoryRoles = data.roles.filter((r: JobCard) => r.domain === cat.domain);
      
      if (categoryRoles.length === 0) return; // Skip empty categories

      html += `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
          <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">${cat.icon}</div>
          <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">${cat.name}</h2>
        </div>
        
        <div style="position:relative;">
          <button class="carousel-btn" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('${cat.id}')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
          <button class="carousel-btn" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; border:1px solid #ddd; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onclick="document.getElementById('${cat.id}')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>
          
          <div id="${cat.id}" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; gap:20px; padding: 12px 16px 24px; margin: -12px -16px -24px; -webkit-overflow-scrolling:touch;">
            <style>
              #${cat.id}::-webkit-scrollbar { display: none; }
            </style>
      `;

      categoryRoles.forEach((role: JobCard) => {
        let tagsHtml = role.tags.map(t => `<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">${t}</span>`).join('');
        const bg = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
        
        const safeTitle = role.title.replace(/'/g, "\\'");
        const safeDomain = role.domain.replace(/'/g, "\\'");
        const safePay = role.pay.replace(/'/g, "\\'");

        html += `
          <div class="feature-card opp-card" data-domain="${role.domain}" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
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
              <button onclick="window.open('resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>
              
            </div>
            <div style="text-align:center; font-size:11px; color:var(--gray-500); margin-top:8px; font-weight:600;">Takes 3 mins • Have your PDF resume ready</div>
          </div>
        `;
      });
      html += `</div></div>`;
    });
    
    carouselWrapper.innerHTML = html;
    
    const carouselsSection = document.querySelector('.section .container');
    if (carouselsSection && carouselsSection.firstChild) {
      carouselsSection.insertBefore(carouselWrapper, carouselsSection.firstChild);
    }
    
    """

content = content[:start_idx] + new_logic + content[end_idx:]

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
