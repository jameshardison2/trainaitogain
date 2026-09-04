import sys

with open("index.html", "r") as f:
    lines = f.readlines()

nav_end_idx = -1
footer_start_idx = -1

for i, line in enumerate(lines):
    if "</nav>" in line:
        nav_end_idx = i
    if "<!-- ─── Footer ─────────────────────────────────────────── -->" in line:
        footer_start_idx = i
        break

if nav_end_idx == -1 or footer_start_idx == -1:
    print("Could not find bounds")
    sys.exit(1)

new_html = """
  <!-- ─── Direct Response Hero ─────────────────────────────────────────── -->
  <section style="padding: 100px 0 60px; text-align: center;">
    <div class="container" style="max-width: 800px; margin: 0 auto;">
      <h1 style="font-size: 56px; font-weight: 800; color: var(--black); line-height: 1.1; margin-bottom: 24px; letter-spacing: -0.02em;">
        Earn $100-160/hr Doing AI Work On The Side
      </h1>
      <p style="font-size: 22px; color: var(--gray-500); margin-bottom: 48px; line-height: 1.5;">
        Remote, flexible, no need to leave your current job.
      </p>
      
      <button class="btn-primary" style="font-size: 20px; padding: 20px 48px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 64px; cursor: pointer;" onclick="openApplyModal('hero_cta');">
        Start Your Application ➔
      </button>

      <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 12px; max-width: 600px; margin-left: auto; margin-right: auto;">
        <!-- Placeholder for real Mercor payout screenshot -->
        <div style="width: 100%; height: 300px; background: var(--gray-200); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--gray-500); font-weight: 600;">
          [Real Mercor Payout Screenshot Goes Here]
        </div>
      </div>
      <p style="font-size: 14px; color: var(--gray-400); font-style: italic;">Verified weekly payout deposited directly via Stripe.</p>
    </div>
  </section>

  <!-- ─── FAQ Blocks ─────────────────────────────────────────── -->
  <section style="padding: 60px 0; background: var(--gray-50); border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200);">
    <div class="container" style="max-width: 1000px; margin: 0 auto;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; text-align: left;">
        
        <div>
          <h3 style="font-size: 20px; font-weight: 700; color: var(--black); margin-bottom: 12px;">What is Mercor?</h3>
          <p style="color: var(--gray-500); line-height: 1.6; font-size: 16px;">
            Mercor is an AI training platform matching top tech professionals with high-paying evaluation projects. It provides legitimate, remote work evaluating bleeding-edge models.
          </p>
        </div>

        <div>
          <h3 style="font-size: 20px; font-weight: 700; color: var(--black); margin-bottom: 12px;">How much time does the application take?</h3>
          <p style="color: var(--gray-500); line-height: 1.6; font-size: 16px;">
            30-45 minutes. Approval usually within 5 days.
          </p>
        </div>

        <div>
          <h3 style="font-size: 20px; font-weight: 700; color: var(--black); margin-bottom: 12px;">Do I need to quit my job?</h3>
          <p style="color: var(--gray-500); line-height: 1.6; font-size: 16px;">
            No. This is side income you do on your own schedule.
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- ─── Testimonial ─────────────────────────────────────────── -->
  <section style="padding: 100px 0; text-align: center;">
    <div class="container" style="max-width: 800px; margin: 0 auto;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--gray-300)" style="margin-bottom: 24px;">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
      </svg>
      <h2 style="font-size: 32px; font-weight: 600; color: var(--black); line-height: 1.4; margin-bottom: 32px; font-style: italic;">
        "Made $2,400 in my first month working nights and weekends."
      </h2>
      <div style="font-size: 18px; font-weight: 700; color: var(--black);">David M.</div>
      <div style="font-size: 14px; color: var(--gray-400);">Senior Software Engineer</div>
    </div>
  </section>

  <!-- ─── Bottom CTA ─────────────────────────────────────────── -->
  <section style="padding: 0 0 100px; text-align: center;">
    <div class="container">
      <button class="btn-primary" style="font-size: 20px; padding: 20px 48px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); cursor: pointer;" onclick="openApplyModal('bottom_cta');">
        Start Your Application ➔
      </button>
    </div>
  </section>

"""

new_lines = lines[:nav_end_idx+1] + [new_html] + lines[footer_start_idx:]

with open("index.html", "w") as f:
    f.writelines(new_lines)

print("Updated index.html successfully.")
