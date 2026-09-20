import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will replace everything inside <header ...> ... </header>
# But first, I need to make sure I don't break the nav. The nav is outside <header>.
# The existing header starts with <header style="padding: 80px 0 60px; background-color: var(--white);">
# and ends with </header>

new_hero = """
  <header style="padding: 100px 0 80px; background-color: var(--white); overflow: hidden;">
    <div class="container">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;">
        
        <!-- Left Column -->
        <div>
          <div style="color: #F06A26; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 24px;">
            AI OPPORTUNITIES &middot; REAL PAY
          </div>
          <h1 style="font-size: 56px; font-weight: 800; color: #111; line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 24px;">
            Your expertise is <br>
            worth <span style="color: #F06A26;">$50&ndash;130/hr</span> to <br>
            the AI labs.
          </h1>
          <p style="font-size: 18px; color: #666; line-height: 1.6; margin-bottom: 40px; max-width: 480px;">
            Mercor pays skilled professionals to review and grade AI outputs in their field. Doctors, lawyers, engineers, researchers, coders &mdash; remote, flexible, and open globally.
          </p>
          
          <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <a href="guide-download.html" style="background: #F06A26; color: #fff; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; display: inline-block; transition: all 0.2s; box-shadow: 0 4px 12px rgba(240, 106, 38, 0.2);">
              Download Guide PDF
            </a>
            <a href="resume-ats-guide.html" style="background: #fff; color: #111; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-block; transition: all 0.2s;">
              Apply via Mercor
            </a>
          </div>
          
          <p style="font-size: 13px; color: #888;">
            Note: You will need to create a free Mercor account before starting the application.
          </p>
        </div>

        <!-- Right Column (Grid) -->
        <div style="position: relative;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Top Left -->
            <div style="background: #E4CDB4; aspect-ratio: 1; border-radius: 20px;"></div>
            
            <!-- Top Right -->
            <div style="background: #C4B19F; aspect-ratio: 1; border-radius: 20px; position: relative;">
              <!-- Floating Pill -->
              <div style="position: absolute; top: 24px; right: -24px; background: #fff; border-radius: 12px; padding: 12px 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 12px; z-index: 10;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(240, 106, 38, 0.1); color: #F06A26; display: flex; align-items: center; justify-content: center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <div style="color: #F06A26; font-size: 18px; font-weight: 800; line-height: 1;">10 min</div>
                  <div style="color: #666; font-size: 12px; margin-top: 4px;">To apply</div>
                </div>
              </div>
            </div>
            
            <!-- Bottom Left -->
            <div style="background: #9BB899; aspect-ratio: 1; border-radius: 20px; position: relative;">
              <!-- Floating Pill -->
              <div style="position: absolute; bottom: 24px; left: -24px; background: #fff; border-radius: 12px; padding: 12px 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 12px; z-index: 10;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(240, 106, 38, 0.1); color: #F06A26; display: flex; align-items: center; justify-content: center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <div style="color: #F06A26; font-size: 18px; font-weight: 800; line-height: 1;">$110/hr</div>
                  <div style="color: #666; font-size: 12px; margin-top: 4px;">Top matched rate</div>
                </div>
              </div>
            </div>
            
            <!-- Bottom Right -->
            <div style="background: #A49FBA; aspect-ratio: 1; border-radius: 20px;"></div>
          </div>
        </div>
        
      </div>
    </div>
  </header>
"""

# Find the header block
start_tag = '<header'
end_tag = '</header>'

start_idx = html.find(start_tag)
if start_idx != -1:
    end_idx = html.find(end_tag, start_idx)
    if end_idx != -1:
        end_idx += len(end_tag)
        new_html = html[:start_idx] + new_hero + html[end_idx:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("Successfully replaced header section.")
    else:
        print("Could not find </header>")
else:
    print("Could not find <header>")

