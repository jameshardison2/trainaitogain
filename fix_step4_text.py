import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_text = "Your ATS scan identified missing keywords. Copy the exact ATS payload and run it through your preferred external LLM (e.g. Claude, ChatGPT). Once generated, click <strong>Paste AI-Updated Text</strong> in Step 3 to rescan."
replace_text = "<strong>How to get 100%:</strong> We've generated a custom AI prompt for you. Click the copy button below, paste it into ChatGPT or Claude, and the AI will completely rewrite your resume to naturally include all your missing keywords. Then upload the new resume below!"

if find_text in html:
    html = html.replace(find_text, replace_text)
    print("Step 4 text clarified!")
else:
    print("Could not find Step 4 text.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
