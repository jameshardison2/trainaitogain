import re

with open('apply.html', 'r') as f:
    content = f.read()

# 1. Fix Layout Clipping
old_section = '<div id="matched-roles-section" style="display:none; margin-top: 48px; text-align: center;">'
new_section = '<div id="matched-roles-section" style="display:none; margin-top: 64px; text-align: center; scroll-margin-top: 120px;">'
content = content.replace(old_section, new_section)

# 2. Fix Card Visuals and Buttons
old_js_render = """          matchedTrack.innerHTML = matches.map(m => `
            <div class="wave-card" style="width: 100%; max-width: 600px; text-align: left; background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; align-items:flex-start;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; width:100%;">
                 <span style="background:var(--primary-light); color:var(--primary-dark); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px;">${m.matchScore}% Match</span>
                 <span style="color:var(--accent); font-weight:900; font-size:18px;">${m.hourlyRate || 'Market Rate'}</span>
              </div>
              <h3 style="font-size:18px; font-weight:800; color:var(--black); margin-bottom:12px; line-height:1.3;">${m.roleName}</h3>
              <p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
              
                    
                    <div style="display:flex; gap:8px; width:100%;">
                      <button type="button" onclick="const refCode = localStorage.getItem('affiliate_ref'); let targetUrl = '${m.roleUrl}'; if (refCode && targetUrl.includes('mercor')) { if(!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode); } else if (refCode && targetUrl.includes('micro1')) { if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode); } window.open(targetUrl, '_blank')" style="flex:1; background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>
                      <button type="button" onclick="saveRole('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';" title="Save role to dashboard"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg></button>
                      <button type="button" onclick="markAsComplete('${m.roleName.replace(/'/g, "\\'")}', '${m.domainFilter || 'ALL'}', '${m.hourlyRate || 'Market Rate'}')" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';" title="Mark as Applied / Completed"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></button>
                      <button type="button" onclick="window.open('resume-ats-guide?role=' + encodeURIComponent('${m.roleName.replace(/'/g, "\\'")}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';" title="Scan my resume to see if it matches this job"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></button>
                    </div>
            </div>
          `).join('');"""

new_js_render = """          // Find the actual role objects in wavesData to ensure real URLs
          let realMatches = matches.map(m => {
              let realRole = (window.wavesData || []).find(w => w.title.toLowerCase().includes(m.roleName.toLowerCase()) || m.roleName.toLowerCase().includes(w.title.toLowerCase()));
              if (realRole) {
                  m.roleUrl = realRole.linkTarget || m.roleUrl;
                  m.hourlyRate = realRole.pay || m.hourlyRate;
                  m.domainFilter = realRole.domain || m.domainFilter;
              }
              return m;
          });

          matchedTrack.innerHTML = realMatches.map(m => {
            const safeTitle = m.roleName.replace(/'/g, "\\'");
            const safeDomain = (m.domainFilter || 'ALL').replace(/'/g, "\\'");
            const safePay = (m.hourlyRate || 'Market Rate').replace(/'/g, "\\'");
            const safeUrl = (m.roleUrl || 'https://t.mercor.com/wbPMF').replace(/'/g, "\\'");
            
            return `
            <div class="feature-card opp-card" style="flex:0 0 320px; scroll-snap-align:start; background:var(--white); border:2px solid var(--accent); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-orange); text-align: left;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; gap:8px;">
                 <div style="display:flex; gap:8px; flex-wrap:wrap; flex:1;">
                   <div style="padding:6px 10px; background:var(--primary-light); color:var(--primary-dark); border-radius:6px; font-size:11px; font-weight:800; letter-spacing:0.05em; white-space:nowrap;">${m.matchScore}% Match</div>
                 </div>
                 <div style="color:var(--accent); font-weight:900; font-size:18px; text-align:right; white-space:nowrap; flex-shrink:0;">${m.hourlyRate || 'Market Rate'}</div>
              </div>
              <h3 style="font-size:18px; margin-bottom:20px; color:var(--black); line-height:1.2; font-weight:800; flex-grow:0;">${m.roleName}</h3>
              <p style="font-size:14px; color:var(--gray-600); line-height:1.6; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
              
              <div style="display:flex; gap:8px;">
                <button type="button" onclick="window.handleApplyClick('${safeTitle}', '${safeUrl}', this)" style="flex:1; text-align:center; background:var(--white); border:1.5px solid var(--primary); color:var(--primary-dark); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--white)';" onmouseout="this.style.background='var(--white)'; this.style.color='var(--primary-dark)';">Apply Now</button>
                
                <button type="button" title="Save role to dashboard" onclick="if(window.saveRole) window.saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeUrl}'); else alert('Saved!');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg></button>
                
                <button type="button" title="Mark as Applied / Completed" onclick="if(window.markAsComplete) window.markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this); else alert('Marked Complete!');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></button>
                
                <button type="button" title="Scan my resume to see if it matches this job" onclick="window.open('resume-ats-guide.html?role=' + encodeURIComponent('${safeTitle}'), '_blank');" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></button>
              </div>
            </div>
            `;
          }).join('');
          
          // Save persistence
          localStorage.setItem('saved_ai_matches_html', matchedTrack.innerHTML);"""
content = content.replace(old_js_render, new_js_render)

# 3. Add Persistence Loader on Init
loader_js = """
    <script>
      // Load persisted matches
      document.addEventListener('DOMContentLoaded', () => {
        const savedMatches = localStorage.getItem('saved_ai_matches_html');
        if (savedMatches) {
            const mSec = document.getElementById('matched-roles-section');
            const mTrk = document.getElementById('matched-waves-track');
            if (mSec && mTrk) {
                mTrk.innerHTML = savedMatches;
                mSec.style.display = 'block';
            }
        }
      });
    </script>
"""
if "saved_ai_matches_html" not in content[:content.find('</body>')]:
    content = content.replace('</body>', loader_js + '\n</body>')

with open('apply.html', 'w') as f:
    f.write(content)
print("Updated matches to match opp-cards and persist")
