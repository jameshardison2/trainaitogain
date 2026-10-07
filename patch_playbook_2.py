import re

with open('hiring-pipeline.html', 'r') as f:
    content = f.read()

# 1. Fix the "3" circle to match others
# Current: <div class="step-number" style="background:var(--primary); color:white; border-color:var(--primary); box-shadow:0 0 0 1px var(--primary-dark);">3</div>
content = content.replace('<div class="step-number" style="background:var(--primary); color:white; border-color:var(--primary); box-shadow:0 0 0 1px var(--primary-dark);">3</div>', '<div class="step-number">3</div>')

# 2. Add Orange Tint to the badges
old_badge_1 = '<div style="display:inline-block; background:var(--gray-100); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Time: 6 Mins</div>'
new_badge_1 = '<div style="display:inline-block; background:rgba(245,158,11,0.1); color:var(--accent); border:1px solid rgba(245,158,11,0.2); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">⏱️ Time: 6 Mins</div>'
content = content.replace(old_badge_1, new_badge_1)

old_badge_2 = '<div style="display:inline-block; background:var(--gray-100); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Time: 15 Mins</div>'
new_badge_2 = '<div style="display:inline-block; background:rgba(245,158,11,0.1); color:var(--accent); border:1px solid rgba(245,158,11,0.2); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">⏱️ Time: 15 Mins</div>'
content = content.replace(old_badge_2, new_badge_2)

old_badge_3 = '<div style="display:inline-block; background:var(--gray-200); color:var(--gray-700); font-size:12px; font-weight:700; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">Final Step</div>'
new_badge_3 = '<div style="display:inline-block; background:rgba(245,158,11,0.1); color:var(--accent); border:1px solid rgba(245,158,11,0.2); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">🎯 Final Step</div>'
content = content.replace(old_badge_3, new_badge_3)

# 3. Replace the bottom form with a button pointing to the Blueprint Modal
form_regex = r'<form name="lead-magnet" id="bottomIntakeForm" class="leadMagnetForm">.*?</form>'
new_button = """<button onclick="openNavbarLeadModal(event)" class="btn-primary" style="width: 100%; padding: 16px; font-size: 18px; display: flex; align-items: center; justify-content: center; gap: 8px; border:none; cursor:pointer; font-family:var(--font); box-shadow:0 8px 20px rgba(16, 185, 129, 0.3); transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
            Get Free Blueprint ➔
          </button>"""

content = re.sub(form_regex, new_button, content, flags=re.DOTALL)

with open('hiring-pipeline.html', 'w') as f:
    f.write(content)

print("Applied playbook design and CTA fixes")
