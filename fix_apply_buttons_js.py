with open("apply.html", "r", encoding='utf-8') as f:
    content = f.read()

js_script = """
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const staticCards = document.querySelectorAll('.opp-card');
    staticCards.forEach(card => {
      // Don't add to dynamically generated waves, they have their own save buttons now
      if (card.closest('#carousel-software') || card.closest('.container > div > div > .opp-card')) {
        // Wait, active waves carousel might not have ID.
        // It's safer to just check if it already has a save button.
      }
      
      const applyBtn = card.querySelector('button[onclick*="Apply Now"], button[onclick*="window.open"]');
      if (applyBtn && !card.querySelector('button[onclick*="saveRole"]')) {
        const titleEl = card.querySelector('h3');
        const payEl = card.querySelector('div[style*="font-size:18px"]');
        const domainEl = card.querySelector('div[style*="letter-spacing:0.05em"]');
        
        if (titleEl && payEl && domainEl) {
          // Extract text without the clipboard span
          let title = Array.from(titleEl.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent)
            .join('').trim();
          let pay = payEl.textContent.trim();
          let domain = domainEl.textContent.trim().toLowerCase();
          
          const saveBtn = document.createElement('button');
          saveBtn.innerHTML = '💾';
          saveBtn.style.cssText = 'background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 14px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;';
          saveBtn.onmouseover = () => { saveBtn.style.background = 'var(--primary-light)'; saveBtn.style.color = 'var(--primary-dark)'; };
          saveBtn.onmouseout = () => { saveBtn.style.background = 'var(--gray-100)'; saveBtn.style.color = 'var(--gray-700)'; };
          saveBtn.onclick = () => saveRole(title, domain, pay);
          
          applyBtn.parentNode.insertBefore(saveBtn, applyBtn.nextSibling);
        }
      }
    });
  });
</script>
"""

if "staticCards.forEach" not in content:
    content = content.replace("</body>", js_script + "\n</body>")

with open("apply.html", "w", encoding='utf-8') as f:
    f.write(content)

