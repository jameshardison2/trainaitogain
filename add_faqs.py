import re

with open('is-it-worth-it.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_faqs = """      <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:16px; overflow:hidden;">
        <div style="padding:24px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
          <h3 style="font-size:18px; font-weight:700; margin:0; display:flex; justify-content:space-between; align-items:center;">
            What actually happens when my status stays "Under Review" for weeks?
            <span style="color:var(--gray-400); font-size:24px;">+</span>
          </h3>
        </div>
        <div style="padding:0 24px 24px 24px; display:none; border-top:1px solid var(--gray-100); padding-top:16px;">
          <p style="color:var(--gray-600); line-height:1.6; margin-bottom:16px;"><strong>The Reality:</strong> Automated screening is only the first filter. If your status stalls, it is usually because the platform is pacing onboarding to match active client project demand, or your resume lacked deep enough domain-specific metrics (e.g., exact medical, engineering, or legal frameworks).</p>
          <p style="color:var(--gray-600); line-height:1.6; margin:0;"><strong>The Fix:</strong> Tailor your resume specifically to the core competencies listed in the job description and apply across multiple active tracks to maximize your visibility.</p>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:16px; overflow:hidden;">
        <div style="padding:24px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
          <h3 style="font-size:18px; font-weight:700; margin:0; display:flex; justify-content:space-between; align-items:center;">
            What should I expect from the automated AI interviews?
            <span style="color:var(--gray-400); font-size:24px;">+</span>
          </h3>
        </div>
        <div style="padding:0 24px 24px 24px; display:none; border-top:1px solid var(--gray-100); padding-top:16px;">
          <p style="color:var(--gray-600); line-height:1.6; margin-bottom:16px;"><strong>The Reality:</strong> Platforms rely heavily on automated AI vetting agents (such as Nora-style or Zara-style screeners) that conduct deep technical and behavioral screenings. Candidates often get screened out by speaking too casually or failing to provide structured, quantified explanations of their past experience.</p>
          <p style="color:var(--gray-600); line-height:1.6; margin:0;"><strong>The Candidate Feedback:</strong> Successfully hired professionals emphasize treating the AI interview like an intensive, formal defense of your resume. Find a quiet room, use a clean external mic, and answer questions using precise domain terminology.</p>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:16px; overflow:hidden;">
        <div style="padding:24px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
          <h3 style="font-size:18px; font-weight:700; margin:0; display:flex; justify-content:space-between; align-items:center;">
            What do I do if my video or screen share freezes during the AI interview?
            <span style="color:var(--gray-400); font-size:24px;">+</span>
          </h3>
        </div>
        <div style="padding:0 24px 24px 24px; display:none; border-top:1px solid var(--gray-100); padding-top:16px;">
          <p style="color:var(--gray-600); line-height:1.6; margin-bottom:16px;"><strong>The Reality:</strong> Technical drop-outs during the automated video screening can prematurely flag an application as incomplete or unresponsive.</p>
          <p style="color:var(--gray-600); line-height:1.6; margin:0;"><strong>The Fix:</strong> If you experience a glitch, immediately check your candidate dashboard. Most platforms allow you to restart or resume the assessment session within 24 hours without penalty.</p>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:16px; overflow:hidden;">
        <div style="padding:24px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
          <h3 style="font-size:18px; font-weight:700; margin:0; display:flex; justify-content:space-between; align-items:center;">
            Why do previously completed application steps suddenly show as "Incomplete"?
            <span style="color:var(--gray-400); font-size:24px;">+</span>
          </h3>
        </div>
        <div style="padding:0 24px 24px 24px; display:none; border-top:1px solid var(--gray-100); padding-top:16px;">
          <p style="color:var(--gray-600); line-height:1.6; margin-bottom:16px;"><strong>The Reality:</strong> When AI platforms update role requirements or compliance criteria, previously validated steps (like work authorization or resume verification) can un-sync and require re-validation.</p>
          <p style="color:var(--gray-600); line-height:1.6; margin:0;"><strong>The Fix:</strong> Regularly log into your applicant dashboard, check your milestone status, and immediately complete any un-synced requirement to prevent your profile from falling out of the active talent matching queue.</p>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:16px; overflow:hidden;">
        <div style="padding:24px; cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
          <h3 style="font-size:18px; font-weight:700; margin:0; display:flex; justify-content:space-between; align-items:center;">
            Do I need to create separate profiles for multiple roles across networks?
            <span style="color:var(--gray-400); font-size:24px;">+</span>
          </h3>
        </div>
        <div style="padding:0 24px 24px 24px; display:none; border-top:1px solid var(--gray-100); padding-top:16px;">
          <p style="color:var(--gray-600); line-height:1.6; margin-bottom:16px;"><strong>The Reality:</strong> Once you complete core verification steps (like resume uploads and initial ID checks), subsequent applications on platforms like <a href="https://work.mercor.com" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:none;">Mercor</a> often utilize 1-click apply functionality since your verification data carries over.</p>
          <p style="color:var(--gray-600); line-height:1.6; margin:0;"><strong>The Fix:</strong> Keep your primary profile updated with your most recent professional titles so you match instantly across incoming talent network waves.</p>
        </div>
      </div>
"""

old_end = """    </div>

  </div>
</section>"""

new_end = new_faqs + old_end

content = content.replace(old_end, new_end)

with open('is-it-worth-it.html', 'w', encoding='utf-8') as f:
    f.write(content)
