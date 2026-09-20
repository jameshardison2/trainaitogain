import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_pause = """  document.getElementById('stop-ai-btn').addEventListener('click', () => {
      if (synth.speaking) {
          synth.cancel();
          document.getElementById('stop-ai-btn').style.display = 'none';
      }
  });"""

replace_pause = """  document.getElementById('stop-ai-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (synth.paused) {
          synth.resume();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;
      } else if (synth.speaking) {
          synth.pause();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume AI`;
      }
  });"""

if find_pause in html:
    html = html.replace(find_pause, replace_pause)
else:
    print("WARNING: STILL COULD NOT FIND IT")

html = html.replace('<!-- CACHE BUST 9', '<!-- CACHE BUST 10')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated pause button properly")
