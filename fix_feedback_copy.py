import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace < 50 text
find_50 = """           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords. The automated scanner is highly likely to reject this. Please add the missing keywords highlighted above into your bullet points organically.</p>`;"""
replace_50 = """           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords and will be auto-rejected by the ATS.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (bottom left)</strong> and use the Optimization Payload to automatically rewrite your resume with the missing keywords.</p>`;"""

if find_50 in html:
    html = html.replace(find_50, replace_50)
    print("Updated < 50 text")
else:
    print("Could not find < 50 text")

# Replace < 80 text
find_80 = """           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the candidate pool.</p>`;"""
replace_80 = """           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the applicant pool.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (bottom left)</strong> and use the Optimization Payload to weave in the remaining keywords.</p>`;"""

if find_80 in html:
    html = html.replace(find_80, replace_80)
    print("Updated < 80 text")
else:
    print("Could not find < 80 text")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
