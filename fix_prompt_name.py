import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_label = """<label style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">4. ATS Optimization Payload:</label>"""
replace_label = """<label style="display:block; font-weight:700; margin-bottom:8px; color:var(--black);">4. AI Prompt to Fix Resume:</label>"""

find_text = """Your ATS scan identified missing keywords. Copy the exact ATS payload below and run it through your preferred external LLM (e.g. Claude, ChatGPT). Once generated, paste the new text into <strong>Step 5</strong> below to rescan."""
replace_text = """Your ATS scan identified missing keywords. Copy the exact AI Prompt below and paste it into your preferred external LLM (e.g. Claude, ChatGPT). Once generated, paste the new text into <strong>Step 5</strong> below to rescan."""

find_btn = """<button class="btn-copy-prompt" data-prompt="${escapedPrompt}" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px;" onclick="window.startAITimer(this)">Copy Optimization Payload 🪄</button>"""
replace_btn = """<button class="btn-copy-prompt" data-prompt="${escapedPrompt}" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px;" onclick="window.startAITimer(this)">Copy AI Prompt 🪄</button>"""

find_hint = """<span style="display:block; font-size:11px; text-align:center; color:var(--gray-500); margin-top:8px; font-style:italic;">Generates custom exact match phrasing</span>"""
replace_hint = """<span style="display:block; font-size:11px; text-align:center; color:var(--gray-500); margin-top:8px; font-style:italic;">Copies a custom prompt for ChatGPT / Claude</span>"""

if find_label in html:
    html = html.replace(find_label, replace_label)
    print("Replaced label!")
if find_text in html:
    html = html.replace(find_text, replace_text)
    print("Replaced text!")
if find_btn in html:
    html = html.replace(find_btn, replace_btn)
    print("Replaced button!")
if find_hint in html:
    html = html.replace(find_hint, replace_hint)
    print("Replaced hint!")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
