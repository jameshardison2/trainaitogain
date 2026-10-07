import re

with open('apply.html', 'r') as f:
    html = f.read()

search_bar_html = """
      <!-- Search and Filter Bar -->
      <div style="background:var(--white); padding:24px; border-radius:12px; border: 1px solid var(--gray-200); margin-bottom: 40px; box-shadow: var(--shadow-sm); display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
          <div style="flex: 1 1 250px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; color:var(--gray-400);">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input type="text" id="jobSearchInput" placeholder="Search by title, role, skills..." style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; transition: all 0.2s;" onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px var(--primary-light)';" onblur="this.style.borderColor='var(--gray-300)'; this.style.boxShadow='none';" oninput="if(window.filterJobs) window.filterJobs()">
          </div>
          
          <div style="flex: 1 1 200px; position: relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; color:var(--gray-400); pointer-events:none;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </span>
              <select id="locationFilter" style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s; appearance:none; -webkit-appearance:none;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="if(window.filterJobs) window.filterJobs()">
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
              <select id="categoryFilter" style="width:100%; padding:14px 14px 14px 44px; border:1.5px solid var(--gray-300); border-radius:8px; font-size:16px; outline:none; cursor:pointer; background:var(--white); color:var(--gray-700); transition: all 0.2s; appearance:none; -webkit-appearance:none;" onfocus="this.style.borderColor='var(--primary)';" onblur="this.style.borderColor='var(--gray-300)';" onchange="if(window.filterJobs) window.filterJobs()">
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
      </div>
      
      <!-- How To Apply Pro Tip -->
      <div style="background:var(--gray-50); border-radius:var(--radius-lg); padding:24px; margin-bottom:48px; border-left:4px solid var(--primary);">
        <h4 style="margin:0 0 12px 0; font-size:16px; font-weight:800; color:var(--black);">How to Apply:</h4>
        <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
          <li style="margin-bottom:8px;">Click <strong>"Apply Now"</strong> on your target role below to access our direct referral link.</li>
          <li>Complete your profile setup on the partner platform (Mercor or Micro1) to bypass the general waitlist and fast-track your verification.</li>
        </ul>
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--gray-200);">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--gray-500); margin-bottom:12px;">PRO TIP — USING THE JOB CARDS:</div>
          <div style="display:flex; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--gray-700); background:var(--white); padding:6px 12px; border-radius:6px; border:1px solid var(--gray-200);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> <strong>Save</strong> to Dashboard
            </div>
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--gray-700); background:var(--white); padding:6px 12px; border-radius:6px; border:1px solid var(--gray-200);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Mark</strong> as Applied
            </div>
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--gray-700); background:var(--white); padding:6px 12px; border-radius:6px; border:1px solid var(--gray-200);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> <strong>Scan</strong> Resume Match
            </div>
          </div>
        </div>
      </div>
"""

# Insert it before <div class="section">
# Wait, let's just insert it after the "Not ready? Practice the interview" link
insert_pattern = r'(<a href="ai-interview\.html"[^>]*>Not ready\? Practice the interview ➔</a>)'
html = re.sub(insert_pattern, r'\1\n' + search_bar_html, html)

# Also let's add the "Check if your resume matches these roles" pill
check_match_html = """
    <div style="margin-bottom:40px;">
        <a href="resume-ats-guide.html" style="display:flex; align-items:center; justify-content:center; gap:8px; background:var(--white); border:1px solid var(--gray-200); padding:16px; border-radius:12px; text-decoration:none; color:var(--primary); font-weight:800; font-size:16px; box-shadow:var(--shadow-sm); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
            ✨ Check if your resume matches these roles
        </a>
    </div>
"""

html = re.sub(r'(<p style="font-size:16px; color:var\(--gray-500\); margin-bottom: 8px;">Select your area of expertise below.*?</p>\n<p style="font-size:18px; color:var\(--gray-500\); margin-bottom: 8px; font-weight: 500;">Step 3: Apply to roles you fit</p>)', r'\1\n' + check_match_html, html, flags=re.DOTALL)

with open('apply.html', 'w') as f:
    f.write(html)
