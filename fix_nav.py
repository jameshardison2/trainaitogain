import re
import os

new_header_links = """<ul class="nav-links" style="align-items:center;">
          <li class="desktop-only">
            <a href="resume-ats-guide.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'ats_scan' })">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> ATS Resume Scan
            </a>
          </li>
          <li class="desktop-only">
            <a href="ai-interview.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'mock_interview' })">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mock Interview
            </a>
          </li>
          <li class="desktop-only">
            <a href="apply.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'active_roles' })">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Active Roles
            </a>
          </li>
          <li class="desktop-only">
            <a href="saved-roles.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'dashboard' })">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="nav-link" style="background:var(--primary); color:var(--white); padding:10px 20px; border-radius:100px; font-weight:800; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(16, 185, 129, 0.3); transition:all 0.2s; text-decoration:none;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(16, 185, 129, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)';" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'blueprint_cta' }); openNavbarLeadModal(event)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: middle;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg> Get Free Blueprint
            </a>
          </li>
        </ul>"""

def update_file(filename):
    if not os.path.exists(filename): return
    with open(filename, 'r') as f:
        content = f.read()
    
    # Replace the ul nav-links block
    content = re.sub(r'<ul class="nav-links".*?</ul>', new_header_links, content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)

# We also need to update the mobile menu!
new_mobile_links = """<div class="mobile-menu" id="mobile-menu">
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px;">
        <a href="resume-ats-guide.html" style="font-size:20px; font-weight:700; color:var(--black); text-decoration:none; display:flex; align-items:center; gap:12px;" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'ats_scan' })">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          ATS Resume Scan
        </a>
        <a href="ai-interview.html" style="font-size:20px; font-weight:700; color:var(--black); text-decoration:none; display:flex; align-items:center; gap:12px;" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'mock_interview' })">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          Mock Interview
        </a>
        <a href="apply.html" style="font-size:20px; font-weight:700; color:var(--black); text-decoration:none; display:flex; align-items:center; gap:12px;" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'active_roles' })">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          Active Roles
        </a>
        <a href="saved-roles.html" style="font-size:20px; font-weight:700; color:var(--black); text-decoration:none; display:flex; align-items:center; gap:12px;" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'dashboard' })">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </a>
      </div>
    </div>"""

def update_mobile_menu(filename):
    if not os.path.exists(filename): return
    with open(filename, 'r') as f:
        content = f.read()
    
    # Replace the mobile menu block
    content = re.sub(r'<div class="mobile-menu" id="mobile-menu">.*?</div>\s*</div>', new_mobile_links, content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)
        
pages = [f for f in os.listdir('.') if f.endswith('.html')]
for page in pages:
    update_file(page)
    update_mobile_menu(page)

print("Updated header correctly!")
