import re

with open('index.html', 'r') as f:
    html = f.read()

# Replace the video container directly
html = re.sub(
    r'<div style="width: 100%; max-width: 900px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba\(0,0,0,0\.12\); margin-bottom: 48px; border: 1px solid var\(--gray-200\); background: #000; transform: translateZ\(0\); position: relative;" id="video-container">',
    r'<div style="width: 100%; max-width: 900px; margin: 0 auto; border-radius: 24px; padding: 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 24px 60px rgba(0,0,0,0.4); transform: translateZ(0); position: relative;" id="video-container">',
    html
)

# And ensure the button is there
if 'Get The Free AI Interview Blueprint' not in html:
    html = html.replace(
        '</script>\n\n      </div>',
        """</script>\n      </div>\n      <div style="margin-top: 56px;">\n        <a href="hiring-blueprint.html" style="background: var(--primary); color: white; text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 40px; border-radius: 8px; display: inline-flex; align-items: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3); transition: transform 0.2s;">Get The Free AI Interview Blueprint ➔</a>\n      </div>"""
    )
    # The previous script ending was:
    #             setTimeout(() => document.getElementById('crash-course-video').play(), 300);
    #         });
    #     </script>
    # 
    #   </div>
    html = html.replace(
        """            });\n        </script>\n\n      </div>""",
        """            });\n        </script>\n      </div>\n      \n      <div style="margin-top: 56px;">\n        <a href="hiring-blueprint.html" style="background: var(--primary); color: white; text-decoration: none; font-weight: 800; font-size: 18px; padding: 18px 40px; border-radius: 8px; display: inline-flex; align-items: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3); transition: transform 0.2s;">Get The Free AI Interview Blueprint ➔</a>\n      </div>"""
    )


with open('index.html', 'w') as f:
    f.write(html)
