import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_pause = re.search(r"document\.getElementById\('stop-ai-btn'\)\.addEventListener\('click', \(\) => \{\s*if \(synth\.speaking\) \{\s*synth\.cancel\(\);\s*\}\s*\}\);", html)

replace_pause = """document.getElementById('stop-ai-btn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (synth.paused) {
          synth.resume();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause AI`;
      } else if (synth.speaking) {
          synth.pause();
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Resume AI`;
      }
  });"""
if find_pause:
    html = html.replace(find_pause.group(0), replace_pause)
else:
    print("WARNING: Could not find regex pause logic")

html = html.replace('<!-- CACHE BUST 8', '<!-- CACHE BUST 9')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated pause button")
