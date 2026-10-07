const fs = require('fs');
let code = fs.readFileSync('render_waves.ts', 'utf8');

// 1. Tooltips for Job Card Badges
code = code.replace(
    /onclick="saveRole\('\$\{safeTitle\}', '\$\{safeDomain\}', '\$\{safePay\}', this, '\$\{role\.linkTarget \|\| 'https:\/\/t\.mercor\.com\/wbPMF'\}'\)" style="(.*?)"[^>]*>💾<\/button>/,
    'title="Direct Partner Network (Mercor/Micro1)" onclick="saveRole(\'${safeTitle}\', \'${safeDomain}\', \'${safePay}\', this, \'${role.linkTarget || \'https://t.mercor.com/wbPMF\'}\')" style="$1">🏛️</button>'
);
code = code.replace(
    /onclick="markAsComplete\('\$\{safeTitle\}', '\$\{safeDomain\}', '\$\{safePay\}', this\)" style="(.*?)"[^>]*>✅<\/button>/,
    'title="AI Resume Match Confirmed" onclick="markAsComplete(\'${safeTitle}\', \'${safeDomain}\', \'${safePay}\', this)" style="$1">✅</button>'
);
code = code.replace(
    /onclick="window\.open\('resume-ats-guide\?role=' \+ encodeURIComponent\('\$\{safeTitle\}'\), '_blank'\);"[^>]*style="(.*?)"[^>]*>🎯<\/button>/,
    'title="Priority Waitlist Fast-Track" onclick="window.open(\'resume-ats-guide?role=\' + encodeURIComponent(\'${safeTitle}\'), \'_blank\');" style="$1">🎯</button>'
);

// 2. Upgrade Filter Bar Icons
const oldFilterHtml = `<div style="background:var(--white); padding:24px; border-radius:12px; border: 1px solid var(--gray-200); margin-bottom: 40px; box-shadow: var(--shadow-sm); display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
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
      </div>`;

const newFilterHtml = `<div style="background:var(--white); padding:24px; border-radius:12px; border: 1px solid var(--gray-200); margin-bottom: 40px; box-shadow: var(--shadow-sm); display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
          <div style="flex: 1 1 250px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; color:var(--gray-400);">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input type="text" id="jobSearchInput" placeholder="Search by title, role, skills..." style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; transition: all 0.2s;" onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px var(--primary-light)';" onblur="this.style.borderColor='var(--gray-300)'; this.style.boxShadow='none';" oninput="window.applyJobFilters()">
          </div>
          
          <div style="flex: 1 1 200px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; color:var(--gray-400); pointer-events:none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </span>
              <select id="locationFilter" style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s; appearance:none; -webkit-appearance:none;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="window.applyJobFilters()">
                  <option value="ALL">All Locations</option>
                  <option value="US">US Based / US Only</option>
                  <option value="INTL">Global / Remote Anywhere</option>
              </select>
              <div style="position:absolute; right:16px; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--gray-400);">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
          </div>
          
          <div style="flex: 1 1 200px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; color:var(--gray-400); pointer-events:none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </span>
              <select id="categoryFilter" style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s; appearance:none; -webkit-appearance:none;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="window.applyJobFilters()">
                  <option value="ALL">All Categories</option>
                  <option value="SOFTWARE">Software & Engineering</option>
                  <option value="MEDICAL">Medical & Clinical</option>
                  <option value="FINANCE">Finance & Quant</option>
                  <option value="LEGAL">Legal & Compliance</option>
                  <option value="LANGUAGE">Translation & Voice</option>
                  <option value="SALES">Sales & Growth</option>
                  <option value="GENERAL">General & Expert</option>
              </select>
              <div style="position:absolute; right:16px; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--gray-400);">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
          </div>
      </div>`;

code = code.replace(oldFilterHtml, newFilterHtml);

fs.writeFileSync('render_waves.ts', code);
console.log("Patched tooltips and SVGs successfully!");
