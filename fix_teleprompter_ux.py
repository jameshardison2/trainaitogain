import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove the transcript toggle HTML
find_transcript_toggle = """<input type="checkbox" id="toggle-transcript" checked style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
              <span style="font-size:14px; color:white; font-weight:600;">Show my live answer transcript on screen</span>
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">"""
replace_transcript_toggle = """<label style="display:flex; align-items:center; gap:12px; cursor:pointer; margin-bottom:16px;">"""
if find_transcript_toggle in html:
    html = html.replace(find_transcript_toggle, replace_transcript_toggle)
else:
    print("Warning: Could not find transcript toggle HTML")

# 2. Remove the transcript toggle JS
find_transcript_js = """  let transcriptEnabled = true;
  document.getElementById('toggle-transcript').addEventListener('change', (e) => {
      transcriptEnabled = e.target.checked;
  });"""
replace_transcript_js = """  let transcriptEnabled = false;"""
if find_transcript_js in html:
    html = html.replace(find_transcript_js, replace_transcript_js)

# 3. Update the Teleprompter HTML to be a massive, beautiful overlay
find_tele_box = """          <div id="teleprompter-box" style="position:absolute; top:16px; left:16px; z-index:100; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:12px 16px; max-width:60%; display:none; backdrop-filter:blur(8px); text-align:left; box-shadow:0 4px 16px rgba(0,0,0,0.5);">
              <div style="font-size:10px; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; font-weight:800; margin-bottom:4px;">Teleprompter Hints</div>
              <div id="teleprompter-text" style="font-size:14px; color:white; font-weight:600; line-height:1.4;"></div>
          </div>"""
replace_tele_box = """          <div id="teleprompter-box" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100; background:rgba(0,0,0,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:32px 48px; width:80%; max-width:800px; display:none; backdrop-filter:blur(12px); text-align:center; box-shadow:0 24px 64px rgba(0,0,0,0.8);">
              <div style="font-size:12px; color:var(--primary); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:16px;">Teleprompter (Read Aloud)</div>
              <div id="teleprompter-text" style="font-size:28px; color:white; font-weight:700; line-height:1.4; text-shadow: 0 4px 12px rgba(0,0,0,0.8);"></div>
          </div>"""
if find_tele_box in html:
    html = html.replace(find_tele_box, replace_tele_box)

# 4. Update the Teleprompter logic to use the new answer field (which we will inject)
find_tele_logic = """      if (teleprompterEnabled && currentQuestions[currentQ]) {
          document.getElementById('teleprompter-text').innerText = "Try mentioning: " + currentQuestions[currentQ].keywords.join(', ');
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {"""
replace_tele_logic = """      if (teleprompterEnabled && currentQuestions[currentQ]) {
          document.getElementById('teleprompter-text').innerText = currentQuestions[currentQ].answer || ("Try mentioning: " + currentQuestions[currentQ].keywords.join(', '));
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {"""
if find_tele_logic in html:
    html = html.replace(find_tele_logic, replace_tele_logic)

# 5. Hide simText entirely during listening
find_simText_hide = """      if (!transcriptEnabled) {
          simText.style.display = 'none';
      }"""
replace_simText_hide = """      simText.style.display = 'none';"""
if find_simText_hide in html:
    html = html.replace(find_simText_hide, replace_simText_hide)

# 6. Stop updating simText onresult
find_onresult = """        if (transcriptEnabled) {
            simText.innerText = finalTranscript + interim;
            simText.style.display = 'inline-block';
        }"""
replace_onresult = """        """
if find_onresult in html:
    html = html.replace(find_onresult, replace_onresult)

# Cache bust
html = html.replace('<!-- CACHE BUST 13', '<!-- CACHE BUST 14')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated teleprompter UX")
