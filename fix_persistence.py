import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# 1. Change the AI button to open in a new tab so they don't leave the site
apply_html = apply_html.replace(
    "onclick=\"window.location.href='https://t.mercor.com/wbPMF'",
    "onclick=\"window.open('https://t.mercor.com/wbPMF' + (localStorage.getItem('affiliate_ref') ? '?ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')\" data-ignore=\""
)

# 2. Save matches to sessionStorage so they survive a page reload
save_logic = """
          // Save to session storage so it persists if they reload
          sessionStorage.setItem('ai_matches', JSON.stringify(matches));
          
          // 4. Render!
"""
apply_html = apply_html.replace("// 4. Render!", save_logic)

# 3. Add a script to reload matches from sessionStorage on page load
reload_script = """
    <script>
      // Automatically restore AI matches if they navigate away and come back
      document.addEventListener('DOMContentLoaded', () => {
        const savedMatches = sessionStorage.getItem('ai_matches');
        if (savedMatches) {
            try {
                const matches = JSON.parse(savedMatches);
                document.getElementById('aws-upload-zone').style.display = 'none';
                
                const matchedTrack = document.getElementById('matched-waves-track');
                matchedTrack.innerHTML = matches.map(m => `
                  <div class="wave-card" style="width: 320px; text-align: left; background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; align-items:flex-start;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; width:100%;">
                       <span style="background:var(--primary-light); color:var(--primary-dark); font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px;">${m.matchScore}% Match</span>
                       <span style="color:var(--gray-500); font-weight:700; font-size:14px;">${m.hourlyRate || 'Market Rate'}</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--black); margin-bottom:12px; line-height:1.3;">${m.roleName}</h3>
                    <p style="font-size:14px; color:var(--gray-600); line-height:1.5; margin-bottom:24px; flex-grow:1;"><strong>Why you're a fit:</strong> ${m.explanation}</p>
                    <button type="button" onclick="window.open('https://t.mercor.com/wbPMF' + (localStorage.getItem('affiliate_ref') ? '?ref=' + localStorage.getItem('affiliate_ref') : ''), '_blank')" style="background:var(--gray-900); color:white; border:none; padding:12px; border-radius:var(--radius-sm); font-weight:700; cursor:pointer; width:100%; transition:background 0.2s;" onmouseover="this.style.background='var(--primary)'" onmouseout="this.style.background='var(--gray-900)'">Apply for this Role ➔</button>
                  </div>
                `).join('');
                document.getElementById('matched-roles-section').style.display = 'block';
            } catch(e) {}
        }
      });
    </script>
"""

# Insert reload script before closing body
apply_html = apply_html.replace("</body>", reload_script + "\n</body>")

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Persistence fixed.")
