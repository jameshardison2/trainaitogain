import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add CSS for teleprompter scrolling
css_animation = """
    <style>
    @keyframes scrollTextUp {
        0% { transform: translateY(150px); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(-150px); opacity: 0; }
    }
    .teleprompter-text-anim {
        animation: scrollTextUp 15s linear forwards;
    }
    </style>
"""

# Insert CSS before </head>
html = html.replace('</head>', css_animation + '\n</head>')

# 2. Re-style the teleprompter box to be at the top of the screen (near camera) and fade out
find_tele_box = """<div id="teleprompter-box" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px 32px; width:90%; max-height:85%; overflow-y:auto; max-width:800px; display:none; backdrop-filter:blur(4px); text-align:center; box-shadow:0 12px 32px rgba(0,0,0,0.5);">
              <div style="font-size:12px; color:var(--primary); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:12px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Teleprompter (Read Aloud)</div>
              <div id="teleprompter-text" style="font-size:24px; color:white; font-weight:700; line-height:1.5; text-shadow: 0 2px 8px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.8);"></div>
          </div>"""

replace_tele_box = """<div id="teleprompter-box" style="position:absolute; top:0; left:0; width:100%; height:80%; z-index:100; background:linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 100%); display:none; padding:32px 64px; box-sizing:border-box; text-align:center; overflow:hidden; pointer-events:none;">
              <div style="font-size:11px; color:var(--primary); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:24px; opacity:0.8;">Live Teleprompter</div>
              <div id="teleprompter-text" style="font-size:32px; color:rgba(255,255,255,0.9); font-weight:800; line-height:1.6; text-shadow: 0 2px 8px rgba(0,0,0,1); will-change:transform;"></div>
          </div>"""

if find_tele_box in html:
    html = html.replace(find_tele_box, replace_tele_box)
else:
    print("Warning: Could not find teleprompter box to replace")

# 3. Add the animation class dynamically in JS when the question is asked
find_tele_logic = """      if (teleprompterEnabled && currentQuestions[currentQ]) {
          document.getElementById('teleprompter-text').innerText = currentQuestions[currentQ].answer || ("Try mentioning: " + currentQuestions[currentQ].keywords.join(', '));
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {"""

replace_tele_logic = """      if (teleprompterEnabled && currentQuestions[currentQ]) {
          const tText = document.getElementById('teleprompter-text');
          tText.innerText = currentQuestions[currentQ].answer || ("Try mentioning: " + currentQuestions[currentQ].keywords.join(', '));
          
          // Reset animation by triggering reflow
          tText.classList.remove('teleprompter-text-anim');
          void tText.offsetWidth; 
          tText.classList.add('teleprompter-text-anim');
          
          document.getElementById('teleprompter-box').style.display = 'block';
      } else {"""

if find_tele_logic in html:
    html = html.replace(find_tele_logic, replace_tele_logic)
else:
    print("Warning: Could not find tele logic")


# Cache bust
html = html.replace('<!-- CACHE BUST 17', '<!-- CACHE BUST 18')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Implemented scrolling teleprompter at top of screen")
