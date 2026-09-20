import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix 1: Make score-text color dynamic
find_color = "meterFill.style.background = meterColor;"
replace_color = "meterFill.style.background = meterColor;\\n        scoreText.style.color = meterColor;"

if find_color in html:
    html = html.replace(find_color, replace_color)
    print("Score color dynamic fix applied!")
else:
    print("Could not find meterFill color line.")

# Fix 2: Hide Step 5 content when 100%
# Find where the applyBtn is enabled (score >= 80)
# We'll add logic for score == 100 inside that block.
find_btn_logic = """        if (applyBtn) {
            if (score >= 80) {"""
replace_btn_logic = """        if (applyBtn) {
            if (score >= 100) {
                const s5 = document.getElementById('step-5-container');
                if(s5) {
                    s5.innerHTML = '<div style="background:#ecfdf5; border:1px solid #34d399; padding:24px; border-radius:12px; text-align:center;"><div style="font-size:32px; margin-bottom:12px;">✅</div><h3 style="color:#065f46; margin:0 0 8px 0;">Resume Fully Optimized!</h3><p style="margin:0; color:#047857; font-size:14px;">Your resume has successfully hit a 100% keyword match. Click the Next Step button to proceed.</p></div>';
                }
            }
            if (score >= 80) {"""

if find_btn_logic in html:
    html = html.replace(find_btn_logic, replace_btn_logic)
    print("Step 5 100% completion state added!")
else:
    print("Could not find applyBtn logic.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
