import re

with open('prep-hub.html', 'r') as f:
    content = f.read()

# CSS Fix
old_css = """    .tool-card { background: var(--white); border: 2px solid var(--primary); border-radius: var(--radius-lg); padding: 48px; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 600px; margin: 0 auto 64px; box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15); }
    .tool-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(16, 185, 129, 0.25); }
    
    .tool-icon { font-size: 48px; margin-bottom: 24px; background: var(--primary-light); color: var(--primary-dark); width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; border-radius: 24px; }
    
    .tool-title { font-size: 28px; font-weight: 800; color: var(--black); margin-bottom: 16px; }
    .tool-desc { font-size: 16px; color: var(--gray-600); line-height: 1.6; margin-bottom: 32px; }"""

new_css = """    .tool-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: 20px; transition: all 0.3s; display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 700px; margin: 0 auto 64px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05); overflow: hidden; }
    .tool-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(16, 185, 129, 0.15); border-color: rgba(16,185,129,0.3); }"""
content = content.replace(old_css, new_css)

# HTML Fix
old_card = """    <div class="tool-card">
        <div class="tool-icon">📹</div>
        <h3 class="tool-title">Live AI Mock Interviewer</h3>
        <p class="tool-desc">Experience a realistic video interview. Our AI Copilot will ask you questions out loud, transcribe your answers in real-time, and provide instant coaching feedback to guarantee your success.</p>
        <a href="ai-interview.html" class="btn-visit">Launch Live Simulator ➔</a>
    </div>"""

new_card = """    <div class="tool-card">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); width: 100%; padding: 48px 32px; color: white;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width: 64px; height: 64px; background: rgba(16, 185, 129, 0.15); color: #10b981; border-radius: 16px; margin-bottom: 24px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><rect x="5" y="4" width="14" height="16" rx="2" stroke-width="1.5" stroke="rgba(16,185,129,0.3)"></rect></svg>
            </div>
            <h3 style="font-size: 32px; font-weight: 800; margin-bottom: 16px; color: white; letter-spacing: -0.02em;">Live AI Mock Interviewer</h3>
            <p style="font-size: 16px; color: #94a3b8; max-width: 500px; margin: 0 auto; line-height: 1.6;">Experience a hyper-realistic technical interview. Practice out loud, get real-time feedback, and beat the automated screening bots.</p>
        </div>
        <div style="padding: 40px 32px; background: white; width: 100%;">
            <div style="display: flex; flex-direction: column; gap: 20px; max-width: 480px; margin: 0 auto 40px; text-align: left;">
                <div style="display:flex; align-items:flex-start; gap:16px; padding: 16px; background: var(--gray-50); border-radius: 12px; border: 1px solid var(--gray-100);">
                    <div style="color:var(--primary); margin-top:2px; font-size:20px;">🎙️</div>
                    <div>
                        <div style="color:var(--gray-800); font-weight:700; font-size:15px; margin-bottom:4px;">Real-time Voice Transcription</div>
                        <div style="color:var(--gray-600); font-size:14px; line-height:1.5;">Speak naturally to the AI Copilot just like a real interview.</div>
                    </div>
                </div>
                <div style="display:flex; align-items:flex-start; gap:16px; padding: 16px; background: var(--gray-50); border-radius: 12px; border: 1px solid var(--gray-100);">
                    <div style="color:var(--primary); margin-top:2px; font-size:20px;">🎯</div>
                    <div>
                        <div style="color:var(--gray-800); font-weight:700; font-size:15px; margin-bottom:4px;">STAR+ Scoring Rubric</div>
                        <div style="color:var(--gray-600); font-size:14px; line-height:1.5;">Auto-grades your structural format against strict AI bot criteria.</div>
                    </div>
                </div>
                <div style="display:flex; align-items:flex-start; gap:16px; padding: 16px; background: var(--gray-50); border-radius: 12px; border: 1px solid var(--gray-100);">
                    <div style="color:var(--primary); margin-top:2px; font-size:20px;">💬</div>
                    <div>
                        <div style="color:var(--gray-800); font-weight:700; font-size:15px; margin-bottom:4px;">Live Teleprompter</div>
                        <div style="color:var(--gray-600); font-size:14px; line-height:1.5;">Training wheels to help you build confidence on camera.</div>
                    </div>
                </div>
            </div>
            <a href="ai-interview.html" class="btn-visit" style="width: 100%; max-width: 320px; font-size:16px; padding: 18px 32px;">Launch Live Simulator ➔</a>
        </div>
    </div>"""
content = content.replace(old_card, new_card)

# Let's fix the step buttons too.
old_buttons = """    <div style="display:flex; justify-content:space-between; margin-top:32px; padding-top:32px; border-top:1px solid var(--gray-200); padding-bottom: 80px;">
      <a href="resume-ats-guide" class="btn-primary" style="background:var(--gray-100); color:var(--gray-700); border:1px solid var(--gray-200); text-decoration:none;">⬅ Step 1: Resume Optimizer</a>
      <a href="post-hire.html" class="btn-primary" style="text-decoration:none;">Step 3: Post-Hire Guide ➔</a>
    </div>"""

new_buttons = """    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:32px; padding-top:32px; border-top:1px solid var(--gray-200); padding-bottom: 80px; flex-wrap: wrap; gap: 16px;">
      <a href="resume-ats-guide" class="btn-primary" style="background:var(--white); color:var(--gray-700); border:2px solid var(--gray-200); text-decoration:none; padding: 14px 24px; border-radius: 12px; transition: all 0.2s; font-weight:700;" onmouseover="this.style.borderColor='var(--gray-300)'; this.style.background='var(--gray-50)';" onmouseout="this.style.borderColor='var(--gray-200)'; this.style.background='var(--white)';">⬅ Step 1: Resume Optimizer</a>
      <a href="post-hire.html" class="btn-primary" style="text-decoration:none; padding: 14px 24px; border-radius: 12px; font-weight:700; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">Step 3: Post-Hire Guide ➔</a>
    </div>"""
content = content.replace(old_buttons, new_buttons)

with open('prep-hub.html', 'w') as f:
    f.write(content)
print("UI updated for prep-hub")
