import re

with open('index.html', 'r') as f:
    html = f.read()

# Replace the video section container and headings
old_section_start = r'<section class="section" style="padding: 80px 0; background: var\(--white\); text-align: center; border-bottom: 1px solid var\(--gray-200\);">.*?<h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px; color: var\(--black\); letter-spacing: -0.02em;">How to Bypass the AI Gatekeepers</h2>.*?<p style="color: var\(--gray-500\); font-size: 18px; margin-bottom: 48px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">Watch the 2-minute breakdown on how to optimize your resume and pass the automated screening to get hired faster.</p>'

new_section_start = """<section class="section" style="padding: 100px 0 120px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); text-align: center;">
    <div class="container">
      <div style="display:inline-block; background:rgba(255,255,255,0.1); color:#38bdf8; font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; padding:6px 16px; border-radius:100px; margin-bottom:24px; border: 1px solid rgba(255,255,255,0.05);">Crash Course</div>
      <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px; color: #ffffff; letter-spacing: -0.02em;">How to Bypass the AI Gatekeepers</h2>
      <p style="color: #94a3b8; font-size: 18px; margin-bottom: 56px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">Watch the 2-minute breakdown on how to optimize your resume and pass the automated screening to get hired faster.</p>"""

html = re.sub(old_section_start, new_section_start, html, flags=re.DOTALL)

# Replace the video container styles
old_container = r'<div style="width: 100%; max-width: 900px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba\(0,0,0,0.12\); margin-bottom: 48px; border: 1px solid var\(--gray-200\); background: #000; transform: translateZ\(0\); position: relative;" id="video-container">'

new_container = r'<div style="width: 100%; max-width: 900px; margin: 0 auto; border-radius: 24px; padding: 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 24px 60px rgba(0,0,0,0.4); transform: translateZ(0); position: relative;" id="video-container">'

html = html.replace(old_container, new_container)

# Add border radius to inner video so it doesn't bleed out of the padded glass container
html = html.replace('background: #000; object-fit: contain;">', 'background: #000; object-fit: contain; border-radius: 12px;">')

# Adjust the custom overlay position to account for the 16px padding
html = html.replace(
    '<div id="video-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
    '<div id="video-overlay" style="position: absolute; top: 16px; left: 16px; width: calc(100% - 32px); height: calc(100% - 32px); border-radius: 12px;'
)

# Insert the blueprint button immediately AFTER the closing script tag of the video player
script_end = r"""setTimeout(() => document.getElementById('crash-course-video').play(), 300);
            });
        </script>

      </div>"""

new_script_end = """setTimeout(() => document.getElementById('crash-course-video').play(), 300);
            });
        </script>
      </div>
      
      <div style="margin-top: 56px;">
        <a href="hiring-blueprint.html" style="background: var(--primary); color: white; text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 40px; border-radius: 8px; display: inline-flex; align-items: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3); transition: transform 0.2s;">Get The Free AI Interview Blueprint ➔</a>
      </div>"""

html = html.replace(script_end, new_script_end)

with open('index.html', 'w') as f:
    f.write(html)
