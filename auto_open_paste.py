import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inject the auto-open logic right after the timer setup inside startAITimer
js_find = """              if (timeLeft <= 0) {
                clearInterval(window.activeAITimer);
                if(timerEl) {
                  helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ Time is up!</span> You\\'ve got this. Paste your new AI-upgraded resume into the box above and hit Scan to verify it passes. Let\\'s get you hired!';
                  btn.innerText = 'Generate New Prompt 🪄';
                  btn.style.color = 'white';
                }
              }
            }, 1000);"""

js_replace = """              if (timeLeft <= 0) {
                clearInterval(window.activeAITimer);
                if(timerEl) {
                  helperText.innerHTML = '<span style="color:#ef4444; font-weight:700;">⏳ Time is up!</span> You\\'ve got this. Paste your new AI-upgraded resume into the box above and hit Scan to verify it passes. Let\\'s get you hired!';
                  btn.innerText = 'Generate New Prompt 🪄';
                  btn.style.color = 'white';
                }
              }
            }, 1000);
            
            // AUTOMATICALLY OPEN THE PASTE BOX FOR THE USER!
            const editBtn = document.getElementById('btn-edit-text');
            if (editBtn) editBtn.click();
            
            const rBox = document.getElementById('resume-text');
            if (rBox) {
                rBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                rBox.style.transition = 'box-shadow 0.3s';
                rBox.style.boxShadow = '0 0 0 6px rgba(16,185,129,0.3)';
                setTimeout(() => rBox.style.boxShadow = '', 2000);
            }"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected auto-open logic!")
else:
    print("Could not find startAITimer logic.")

