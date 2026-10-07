import os

files = ["resume-ats-guide.html"]

mock_str = """              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mock Interview
            </a>
          </li>"""

dash_str = """              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> Mock Interview
            </a>
          </li>
          <li class="desktop-only">
            <a href="saved-roles.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'dashboard' })">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Dashboard
            </a>
          </li>"""

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        
        if "Dashboard\n            </a>" not in content and dash_str not in content:
            content = content.replace(mock_str, dash_str)
            with open(f, 'w') as file:
                file.write(content)
            print(f"Added Dashboard to {f}")
        else:
            print(f"Dashboard already in {f}")
