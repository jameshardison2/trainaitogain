import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the button event listener for pause/resume logic
find_pause_logic = """  document.getElementById('stop-ai-btn').addEventListener('click', () => {
      if (synth.speaking) {
          synth.cancel();
      }
  });"""
replace_pause_logic = """  document.getElementById('stop-ai-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (synth.paused) {
          synth.resume();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;
      } else if (synth.speaking) {
          synth.pause();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume AI`;
      }
  });"""
if find_pause_logic in html:
    html = html.replace(find_pause_logic, replace_pause_logic)
else:
    print("WARNING: Could not find pause logic block to replace")

# 2. Make sure when a new speakText happens, the button is reset to Pause (in case they paused the previous one and we force skipped)
find_speakText_start = """  function speakText(text, callback) {
    if (synth.speaking) {
        synth.cancel();
    }"""
replace_speakText_start = """  function speakText(text, callback) {
    if (synth.speaking) {
        synth.cancel();
    }
    const stopBtn = document.getElementById('stop-ai-btn');
    if (stopBtn) stopBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;
"""
if find_speakText_start in html:
    html = html.replace(find_speakText_start, replace_speakText_start)
else:
    print("WARNING: Could not find speakText block to replace")


# Cache bust
html = html.replace('<!-- CACHE BUST 7', '<!-- CACHE BUST 8')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated pause button to actually toggle pause and resume")
