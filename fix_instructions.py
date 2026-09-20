import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Feedback Box Text
find_low = """           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords and will be auto-rejected by the ATS.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (bottom left)</strong> and use the Optimization Payload to automatically rewrite your resume with the missing keywords.</p>`;"""
replace_low = """           feedbackBox.innerHTML = `<h4>Low Match Probability 🔴</h4><p>Your resume is missing critical AI industry keywords and will be auto-rejected by the ATS.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (on the left)</strong> and use the Optimization Payload to generate a prompt that will rewrite your resume.</p>`;"""

find_med = """           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the applicant pool.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (bottom left)</strong> and use the Optimization Payload to weave in the remaining keywords.</p>`;"""
replace_med = """           feedbackBox.innerHTML = `<h4>Medium Match Probability 🟡</h4><p>You have a solid foundation, but you are still missing a few required keywords. The automated scanner might reject this depending on the applicant pool.<br><br><span style="color:var(--black); font-weight:700;">Action Required:</span> Go to <strong>Step 4 (on the left)</strong> and use the Optimization Payload to weave in the remaining keywords.</p>`;"""

html = html.replace(find_low, replace_low)
html = html.replace(find_med, replace_med)

# 2. Update Step 4 Text
find_nudge = """            <p style="font-size:13px; color:var(--gray-600); margin:0 0 16px 0; line-height:1.5;">Your ATS scan identified missing keywords. Copy the exact ATS payload and run it through your preferred external LLM (e.g. Claude, ChatGPT). Once generated, click <strong>Paste AI-Updated Text</strong> in Step 3 to rescan.</p>"""
replace_nudge = """            <p style="font-size:13px; color:var(--gray-600); margin:0 0 16px 0; line-height:1.5;">Your ATS scan identified missing keywords. Copy the exact ATS payload below and run it through your preferred external LLM (e.g. Claude, ChatGPT). Once generated, paste the new text into <strong>Step 5</strong> below to rescan.</p>"""

html = html.replace(find_nudge, replace_nudge)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed instructional text!")
