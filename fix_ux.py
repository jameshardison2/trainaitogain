import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Move the stop-ai-btn INTO the video-container so it positions correctly in the top right of the video
find_btn_layout = """    <div id="active-view" style="display:none; text-align:center;">
      <button id="stop-ai-btn" style="position:absolute; top:24px; right:24px; background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:100px; padding:8px 16px; font-size:13px; font-weight:700; cursor:pointer; display:none; align-items:center; gap:6px; transition:all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        Pause AI
      </button>
      
      <div class="video-container" style="position:relative; width:100%; aspect-ratio:16/9; background:#111; border-radius:12px; overflow:hidden; border:1px solid #333; margin-bottom:24px; box-shadow: 0 12px 32px rgba(0,0,0,0.5);">"""
replace_btn_layout = """    <div id="active-view" style="display:none; text-align:center; position:relative; width:100%;">
      
      <div class="video-container" style="position:relative; width:100%; aspect-ratio:16/9; background:#111; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); margin-bottom:24px; box-shadow: 0 12px 32px rgba(0,0,0,0.8);">
          <button id="stop-ai-btn" style="position:absolute; top:16px; right:16px; z-index:100; background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4); border-radius:100px; padding:8px 16px; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; cursor:pointer; display:none; align-items:center; gap:6px; backdrop-filter:blur(8px); transition:all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.4)'" onmouseout="this.style.background='rgba(239,68,68,0.2)'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            Pause AI
          </button>"""
if find_btn_layout in html:
    html = html.replace(find_btn_layout, replace_btn_layout)
else:
    print("Warning: Could not find button layout")

# 2. Fix the Final Results Dashboard injection
find_summary = re.search(r"const summaryHTML = `.*?`;\s*const vContainer = document\.querySelector\('\.video-container'\);\s*vContainer\.insertAdjacentHTML\('beforeend', summaryHTML\);", html, re.DOTALL)

replace_summary = """const summaryHTML = `
        <div style="background:var(--black); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:48px; text-align:center; width:100%; box-shadow:0 12px 48px rgba(0,0,0,0.5); animation:fade-up 0.6s ease-out;">
            <h2 style="color:white; font-size:32px; margin-bottom:8px; font-weight:800;">Interview Complete 🏆</h2>
            <p style="color:var(--gray-400); margin-bottom:32px; font-size:16px;">Here is your performance breakdown.</p>
            
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:32px; margin-bottom:32px;">
                <div style="font-size:12px; color:var(--gray-400); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Predicted Pass Probability</div>
                <div style="font-size:48px; font-weight:800; color:${passColor}; margin-bottom:32px; text-shadow: 0 4px 12px ${passColor}33;">${passChance}</div>
                
                <div style="display:flex; justify-content:center; gap:64px; border-top:1px solid rgba(255,255,255,0.05); padding-top:32px;">
                    <div>
                        <div style="font-size:11px; color:var(--gray-500); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Confidence Score</div>
                        <div style="font-size:28px; color:white; font-weight:700;">${avgScore}%</div>
                    </div>
                    <div>
                        <div style="font-size:11px; color:var(--gray-500); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Total Filler Words</div>
                        <div style="font-size:28px; color:white; font-weight:700;">${totalFillers}</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align:left; background:rgba(16, 185, 129, 0.05); border:1px solid rgba(16, 185, 129, 0.2); border-radius:12px; padding:24px; margin-bottom:32px;">
                <div style="font-size:12px; color:var(--primary); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em; font-weight:800; display:flex; align-items:center; gap:8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Priority Action Plan
                </div>
                <div style="font-size:15px; color:#ddd; line-height:1.6;">${improvement}</div>
            </div>
            
            <a href="post-hire.html" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; width:100%; max-width:300px; font-size:16px;">Next Step: Post-Hire Guide ➔</a>
        </div>
      `;
      
      const vContainer = document.querySelector('.video-container');
      vContainer.style.display = 'none'; // Hide the restricted video container
      document.getElementById('active-view').insertAdjacentHTML('beforeend', summaryHTML); // Append clean layout
"""
if find_summary:
    html = html.replace(find_summary.group(0), replace_summary)
else:
    print("Warning: Could not find summary layout")

# Cache bust
html = html.replace('<!-- CACHE BUST 5', '<!-- CACHE BUST 6')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied genius UX fixes")
