import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the video div with the overlay version
video_block = """<div style="width: 100%; max-width: 100%; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.12); margin-bottom: 48px; border: 1px solid var(--gray-200); background: #000; transform: translateZ(0); position: relative;" id="video-container">
        
        <!-- Custom Play Overlay -->
        <div id="video-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('ai_interview_hack.mp4') center/cover; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.3s;">
            <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,0.4); margin-bottom: 16px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <div style="color: white; font-weight: 800; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Watch: 2-Min Breakdown</div>
            <div style="color: rgba(255,255,255,0.8); font-weight: 600; font-size: 14px; margin-top: 4px; background: rgba(0,0,0,0.5); padding: 4px 12px; border-radius: 100px;">Over 50,000 views</div>
        </div>

        <video id="crash-course-video" src="ai_interview_hack.mp4#t=0.001" type="video/mp4" width="100%" controls playsinline webkit-playsinline preload="metadata" style="display: block; max-width: 100%; height: auto; outline: none; border: none; background: #000; object-fit: contain;">
          Your browser does not support the video tag.
        </video>

        <script>
            document.getElementById('video-overlay').addEventListener('click', function() {
                this.style.opacity = '0';
                setTimeout(() => this.style.display = 'none', 300);
                document.getElementById('crash-course-video').play();
            });
        </script>
      </div>"""

# Find the old video div
old_pattern = re.compile(r'<div style="width: 100%; max-width: 100%; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba\(0,0,0,0\.12\); margin-bottom: 48px; border: 1px solid var\(--gray-200\); background: #000; transform: translateZ\(0\);">\s*<video src="ai_interview_hack\.mp4#t=0\.001" type="video/mp4" width="100%" controls playsinline webkit-playsinline preload="metadata" style="display: block; max-width: 100%; height: auto; outline: none; border: none; background: #000; object-fit: contain;">\s*Your browser does not support the video tag\.\s*</video>\s*</div>', re.DOTALL)

if old_pattern.search(content):
    content = old_pattern.sub(video_block, content)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Video overlay applied to index.html!")
else:
    print("Old video block not found. Regex mismatch.")

