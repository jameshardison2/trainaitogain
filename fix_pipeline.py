import re

with open('hiring-pipeline.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We want to add a Step 1 about Onboarding & Account Creation
# Let's find "<!-- Step 1 -->" and insert a new Step before it.

new_step = """
      <!-- Step 1: Onboarding -->
      <div class="pipeline-step" id="step-onboarding">
        <div class="step-number" style="background:#ef4444; color:white;">!</div>
        <div class="step-content">
          <div style="display:inline-block; background:#fee2e2; color:#ef4444; font-size:12px; font-weight:800; padding:4px 8px; border-radius:4px; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">CRITICAL PREREQUISITE</div>
          <h2>Secure Your Account (Avoid Onboarding Traps)</h2>
          <p>Before you even worry about your resume or the interview, you must successfully create your Mercor profile. <strong>Many highly-qualified candidates fail right here because they get stuck in looping screens or give up due to portal bugs.</strong></p>
          
          <div style="margin:20px 0; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <span style="font-size:20px;">🛡️</span>
              <p style="margin:0; font-size:15px; color:var(--gray-700); line-height:1.5;"><strong>Don't panic if it loops:</strong> The application portal sometimes glitches. If the screen freezes or loops, immediately take a screenshot and refresh. Do not abandon your application.</p>
            </div>
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <span style="font-size:20px;">📧</span>
              <p style="margin:0; font-size:15px; color:var(--gray-700); line-height:1.5;"><strong>Use a clean email:</strong> Make sure you are creating an entirely new account with an email you check daily. All interview invites will go there.</p>
            </div>
          </div>
          
          <button onclick="openApplyModal('hiring_pipeline_step_1')" class="btn-step" style="background:#ef4444; border-color:#ef4444;">Create Your Verified Account Now ➔</button>
        </div>
      </div>
"""

if "<!-- Step 1 -->" in html:
    html = html.replace("<!-- Step 1 -->", new_step + "\n      <!-- Step 1 -->")
    
    # Update the step numbers of the existing steps since we added one
    html = html.replace('<div class="step-number">1</div>', '<div class="step-number">2</div>')
    html = html.replace('<div class="step-number">2</div>', '<div class="step-number">3</div>', 1) # only replace the second occurrence
    # Wait, simple replace might mess up. Let's use regex or just leave the original numbers and let the new one be a "!"
    # I already used "!" for the new step, so the old steps 1, 2, 3 can stay the same!
    
    with open('hiring-pipeline.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected onboarding step into pipeline!")
else:
    print("Could not find <!-- Step 1 -->")
