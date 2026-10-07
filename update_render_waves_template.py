import re

with open('render_waves.ts', 'r') as f:
    ts = f.read()

# The block to replace starts with: html += `\n          <div class="feature-card opp-card"
# and ends with: </div>\n        `;

old_block_pattern = r'html \+= `\n          <div class="feature-card opp-card".*?</div>\n        `;'

new_block = r"""html += `
          <div class="feature-card opp-card" data-domain="${role.domain}" data-platform="${role.platform || 'Mercor'}" data-pay="${payYearly}" data-location="${loc}" data-index="${index}" style="flex:0 0 320px; order:${index}; scroll-snap-align:start; background:var(--white); border:2px solid #F59E0B; padding:24px; display:flex; flex-direction:column; position:relative; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
            
            <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:flex-start;">
              <div style="display:flex; flex-direction:column; gap:8px;">
                <span style="background:var(--black); color:white; padding:4px 8px; font-size:10px; font-weight:800; border-radius:4px; letter-spacing:0.05em; text-transform:uppercase; align-self:flex-start;">${role.domain}</span>
                <span style="background:var(--black); color:white; padding:4px 8px; font-size:10px; font-weight:800; border-radius:4px; letter-spacing:0.05em; text-transform:uppercase; align-self:flex-start;">${role.status || 'ACTIVE'}</span>
              </div>
              <div style="color:#F59E0B; font-weight:800; font-size:16px;">
                ${role.pay}
              </div>
            </div>

            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px; flex-grow:1; margin-bottom:16px;">
              <h3 style="font-size:18px; margin:0; color:var(--black); line-height:1.2; font-weight:800;">${role.title}</h3>
              <button onclick="navigator.clipboard.writeText('${safeTitle}').then(() => { this.style.color='#10B981'; setTimeout(() => this.style.color='var(--gray-400)', 2000); })" style="background:none; border:none; color:var(--gray-400); cursor:pointer; padding:4px; transition:color 0.2s;" title="Copy Title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>

            <div style="display:flex; gap:8px; margin-bottom:20px;">
              ${(role.platform || 'Mercor').toLowerCase() === 'micro1' ?
                `<span style="background:#EEF2FF; color:#4F46E5; padding:4px 8px; font-size:11px; font-weight:800; border-radius:4px; text-transform:uppercase;">MICRO1</span>` :
                `<span style="background:#F3E8FF; color:#7E22CE; padding:4px 8px; font-size:11px; font-weight:800; border-radius:4px; text-transform:uppercase;">MERCOR</span>`
              }
              <span style="background:var(--gray-100); color:var(--gray-600); padding:4px 8px; font-size:11px; font-weight:700; border-radius:4px;">${loc}</span>
            </div>

            <div style="display:flex; gap:8px;">
              <button style="flex:1; text-align:center; background:white; border:1px solid #10B981; color:#10B981; font-weight:800; font-size:14px; padding:12px; border-radius:6px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#10B981'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='#10B981';" onclick="window.handleApplyClick('${safeTitle}', '${role.linkTarget || 'https://t.mercor.com/wbPMF'}', this)">Apply Now</button>
              
              <button onclick="saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${role.linkTarget || 'https://t.mercor.com/wbPMF'}')" style="background:var(--gray-50); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--gray-100)';" onmouseout="this.style.background='var(--gray-50)';">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              </button>
              
              <button onclick="markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" style="background:var(--gray-50); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--gray-100)';" onmouseout="this.style.background='var(--gray-50)';">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              
              <button onclick="window.open('resume-ats-guide.html?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-50); border:1px solid var(--gray-200); color:var(--gray-600); padding:0 12px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--gray-100)';" onmouseout="this.style.background='var(--gray-50)';">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </button>
            </div>
            <div style="text-align:center; font-size:10px; color:var(--gray-400); margin-top:12px; font-weight:600;">Takes 3 mins • Have your PDF resume ready</div>
          </div>
        `;"""

ts = re.sub(old_block_pattern, new_block, ts, flags=re.DOTALL)

with open('render_waves.ts', 'w') as f:
    f.write(ts)
