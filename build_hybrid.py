import re

with open("index.html", "r") as f:
    content = f.read()

# The hero we want to insert (which includes the intake form and the trust elements)
new_hero = """
  <!-- ─── New Direct-Response Hero ─────────────────────────────────────────── -->
  <header style="padding: 64px 0 40px; text-align: center; background-color: var(--white);">
    <div class="container" style="max-width: 800px;">
      <h1 style="font-size:48px; font-weight:800; color:var(--black); letter-spacing:-0.03em; line-height:1.1; margin-bottom:16px;">
        Earn $100-160/hr Doing AI Work On The Side
      </h1>
      <p style="font-size:20px; color:var(--gray-700); line-height:1.5; margin-bottom:32px;">
        Remote, flexible, no need to leave your current job.
      </p>

      <!-- Fake Stripe Payout Notification -->
      <div style="background:var(--white); border:1px solid #E5E7EB; border-radius:12px; padding:16px; display:inline-flex; align-items:center; gap:16px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); margin-bottom:32px;">
        <div style="background:#635BFF; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div style="text-align:left;">
          <p style="margin:0; font-size:14px; font-weight:600; color:#111827;">Payout Initiated</p>
          <p style="margin:0; font-size:18px; font-weight:800; color:#059669;">+$1,280.00</p>
        </div>
      </div>

      <!-- Intake Form -->
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; max-width: 500px; margin: 0 auto 40px; text-align: left;">
        <h3 style="margin-top: 0; font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;">Start Your Application</h3>
        <p style="color: #4b5563; font-size: 14px; margin-bottom: 24px;">Enter your details to access the fast-tracked evaluation pipeline.</p>
        
        <form id="intakeForm" onsubmit="handleIntake(event)">
          <div style="margin-bottom: 16px;">
            <label for="firstName" style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">First Name</label>
            <input type="text" id="firstName" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; box-sizing: border-box;" placeholder="Enter your first name">
          </div>
          <div style="margin-bottom: 24px;">
            <label for="email" style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px;">Email Address</label>
            <input type="email" id="email" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; box-sizing: border-box;" placeholder="Enter your best email">
          </div>
          
          <button type="submit" id="submitIntakeBtn" class="btn-primary" style="width: 100%; padding: 16px; font-size: 18px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            Start Your Application
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>

          <div class="hero-eyebrow" style="display:inline-flex; align-items:center; gap:8px; background:var(--primary-light); color:var(--primary-dark); padding:6px 12px; border-radius:100px; margin-bottom:24px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            AI Evaluator Prep Hub
          </div>

      <!-- Trust Elements -->
      <div style="display:flex; flex-direction:column; gap:16px; text-align:left; max-width:600px; margin:0 auto 48px;">
        <div style="background:#F3F4F6; padding:16px; border-radius:8px;">
          <h4 style="margin:0 0 4px 0; font-size:16px; color:#111827;">What is Mercor?</h4>
          <p style="margin:0; font-size:14px; color:#4B5563;">An AI recruiting platform paying experts to train models.</p>
        </div>
        <div style="background:#F3F4F6; padding:16px; border-radius:8px;">
          <h4 style="margin:0 0 4px 0; font-size:16px; color:#111827;">How much time?</h4>
          <p style="margin:0; font-size:14px; color:#4B5563;">30-45 minutes to apply. Approval usually within 5 days.</p>
        </div>
        <div style="background:#F3F4F6; padding:16px; border-radius:8px;">
          <h4 style="margin:0 0 4px 0; font-size:16px; color:#111827;">Do I have to quit my job?</h4>
          <p style="margin:0; font-size:14px; color:#4B5563;">No. This is side income you do on your own schedule.</p>
        </div>
      </div>

      <!-- Testimonial -->
      <div style="border-left:4px solid var(--primary); padding-left:24px; max-width:600px; margin:0 auto; text-align:left; margin-bottom: 64px;">
        <p style="font-size:20px; font-style:italic; color:#374151; margin-bottom:12px; line-height:1.5;">
          "Made $2,400 in my first month doing 2 hours a night after putting the kids to bed. Easiest side hustle I've ever found."
        </p>
        <p style="margin:0; font-size:14px; font-weight:700; color:#111827;">David M. &mdash; Senior SWE Evaluator</p>
      </div>
    </div>
  </header>
  
  <div style="text-align:center; margin-bottom:24px;">
    <h2 style="font-size: 28px; font-weight: 800;">Explore Roles (Pipeline Matcher)</h2>
    <p style="color:var(--gray-700);">Not ready to apply? See what roles are available.</p>
  </div>
"""

# Find the old hero block
hero_start = r'<!-- ─── Hero ─────────────────────────────────────────── -->'
job_board_start = r'<!-- ─── Niche Matcher Quiz & Opportunities ─────────────────────────────────────────── -->'

pattern = re.compile(f'({hero_start}.*?)({job_board_start})', re.DOTALL)
content = pattern.sub(f'{new_hero}\\n  \\2', content)

# Inject Firebase SDK inside <head>
firebase_scripts = """
  <!-- Firebase SDK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
    import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      projectId: "trainaitogain-50c19"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    window.handleIntake = async function(e) {
      e.preventDefault();
      
      const btn = document.getElementById('submitIntakeBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Saving...';
      btn.disabled = true;
      
      const firstName = document.getElementById('firstName').value;
      const email = document.getElementById('email').value;
      
      try {
        await addDoc(collection(db, "leads"), {
          firstName: firstName,
          email: email,
          timestamp: serverTimestamp(),
          source: window.location.href
        });
        
        // Success! Open the modal so they can proceed.
        openApplyModal('hero_intake');
      } catch (error) {
        console.error("Error adding document: ", error);
        // Fallback: still open modal even if db fails so we don't break funnel
        openApplyModal('hero_intake'); 
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    };
  </script>
"""

content = content.replace('</head>', f'{firebase_scripts}</head>')

with open("index.html", "w") as f:
    f.write(content)

print("Hybrid built.")
