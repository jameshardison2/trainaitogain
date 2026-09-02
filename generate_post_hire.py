import re

with open("index.html", "r") as f:
    content = f.read()

header = re.search(r"(<header.*?</header>)", content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Post-Hire Survival Guide — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="shared.css" />
</head>
<body>

{header}

<section class="section" style="padding-top:40px;">
  <div class="container" style="max-width:800px;">
    <div class="fade-up" style="margin-bottom:48px;">
      <div class="section-eyebrow">You are Hired. Now What?</div>
      <h1 class="section-heading" style="margin-bottom:16px;">The Post-Hire Survival Guide</h1>
      <p class="section-sub">Passing the AI interview is just the beginning. The operational reality of working for a rapidly scaling startup can be chaotic. Here is what you need to know to actually get paid and stay in the talent pool.</p>
    </div>

    <!-- Section 1 -->
    <div class="fade-up" style="margin-bottom:56px;">
      <h2 style="font-size:28px; font-weight:800; color:var(--black); margin-bottom:20px; display:flex; align-items:center; gap:12px;">
        <span style="background:var(--primary-light); color:var(--primary); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">1</span>
        Onboarding Warnings
      </h2>
      
      <div style="background:var(--gray-50); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:32px;">
        <h3 style="font-size:20px; font-weight:700; margin-bottom:12px;">The Waiting Game</h3>
        <p style="color:var(--gray-500); margin-bottom:24px;">It often takes up to <strong>7 days</strong> after signing the offer letter to actually receive your project onboarding document and tool access. Do not panic during this week. They have not forgotten you; the client is simply provisioning access.</p>
        
        <h3 style="font-size:20px; font-weight:700; margin-bottom:12px;">The Persona ID Trap</h3>
        <p style="color:var(--gray-500); margin-bottom:24px;">You will be asked to verify your identity using a system called Persona. <strong>Failing this will delay your start date indefinitely.</strong> Ensure you have perfect lighting, a clear ID, and follow the selfie video instructions exactly.</p>
        
        <h3 style="font-size:20px; font-weight:700; margin-bottom:12px;">Insightful Time Tracking</h3>
        <p style="color:var(--gray-500);">You must download <em>Insightful</em> to track your hours and get paid. <strong>Never attempt to manipulate the timer or use mouse jigglers.</strong> The system takes random screenshots, and any detected fraud results in immediate, permanent offboarding.</p>
      </div>
    </div>

    <!-- Section 2 -->
    <div class="fade-up" style="margin-bottom:56px;">
      <h2 style="font-size:28px; font-weight:800; color:var(--black); margin-bottom:20px; display:flex; align-items:center; gap:12px;">
        <span style="background:var(--primary-light); color:var(--primary); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">2</span>
        How to Survive the Slack Chaos
      </h2>
      
      <div style="background:var(--white); border:1.5px solid var(--gray-200); border-radius:var(--radius-lg); padding:32px; box-shadow:var(--shadow-sm);">
        <p style="color:var(--gray-500); margin-bottom:24px;">Once in the system, you are thrown into massive, noisy Slack channels with thousands of other contractors. If you ask general questions in the main chat, you will be buried.</p>
        
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:16px;">
          <li style="display:flex; gap:12px; align-items:flex-start;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong style="display:block; color:var(--black);">Find Your Direct POC</strong>
              <span style="color:var(--gray-500);">Look at the pinned messages in your specific project channel to find the Lead or Point of Contact (POC). Direct your complex queries to them.</span>
            </div>
          </li>
          <li style="display:flex; gap:12px; align-items:flex-start;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong style="display:block; color:var(--black);">Set Up Okta Correctly</strong>
              <span style="color:var(--gray-500);">Your access depends on Okta. Set it up perfectly on day one so you do not lose access to your @mercor.expert email.</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Section 3 -->
    <div class="fade-up" style="margin-bottom:56px;">
      <h2 style="font-size:28px; font-weight:800; color:var(--black); margin-bottom:20px; display:flex; align-items:center; gap:12px;">
        <span style="background:var(--primary-light); color:var(--primary); width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">3</span>
        The "Project Paused" Panic
      </h2>
      
      <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:var(--radius-lg); padding:32px;">
        <p style="color:#92400e; font-size:16px; margin-bottom:20px;"><strong>The number one panic moment for Mercor contractors is logging in to see their project is "Paused" and their weekly hour cap is set to 0.</strong></p>
        <p style="color:#92400e; font-size:15px; margin-bottom:16px;">Here is the truth: <strong>Paused does not equal Fired.</strong> It usually means the client has run out of data for that specific sprint.</p>
        <ul style="color:#92400e; font-size:15px; margin-left:24px; display:flex; flex-direction:column; gap:8px;">
          <li>Keep your profile updated with any new skills.</li>
          <li>Keep your Stripe/Wise accounts active for pending payouts.</li>
          <li>Stay responsive and polite to your leads. Contractors who communicate well during a pause are almost always prioritized for the next project batch.</li>
        </ul>
      </div>
    </div>
    
  </div>
</section>

{footer}

</body>
</html>
"""

with open("post-hire.html", "w") as f:
    f.write(html)
print("Created post-hire.html")
