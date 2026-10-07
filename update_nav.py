import re
import os
import glob

new_nav = """        <ul class="nav-links" style="align-items:center;">
          <li class="desktop-only">
            <a href="hiring-pipeline.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'playbook' })">
              📘 The Playbook
            </a>
          </li>
          <li class="desktop-only">
            <a href="apply.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'active_roles' })">
              💼 Active Roles
            </a>
          </li>
          <li class="desktop-only">
            <a href="ai-interview.html" class="nav-link" style="color:var(--gray-700); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--gray-700)'" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'mock_interview' })">
              🎯 Mock Interview
            </a>
          </li>
          <li>
            <a href="#" class="nav-link" style="background:var(--primary); color:var(--white); padding:10px 20px; border-radius:100px; font-weight:800; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(16, 185, 129, 0.3); transition:all 0.2s; text-decoration:none;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(16, 185, 129, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)';" onclick="if(typeof gtag !== 'undefined') gtag('event', 'nav_click', { link_name: 'blueprint_cta' }); openNavbarLeadModal(event)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: middle;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg> Get Free Blueprint
            </a>
          </li>
        </ul>"""

def process_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Regex to find <ul class="nav-links">...</ul> block
        # Using DOTALL so .*? matches across newlines
        new_content = re.sub(r'<ul class="nav-links".*?</ul>', new_nav, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

# Process all html files in root
for filepath in glob.glob("*.html"):
    process_file(filepath)

# Also process articles/
for filepath in glob.glob("articles/*.html"):
    process_file(filepath)

print("Done updating navs.")
