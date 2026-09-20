import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bottom_cta = """
  <!-- ─── Bottom CTA ─────────────────────────────────────────── -->
  <section style="background: var(--black); padding: 100px 0; text-align: center; border-top: 4px solid #F06A26;">
    <div class="container" style="max-width: 800px;">
      <h2 style="font-size: 48px; font-weight: 800; color: var(--white); margin-bottom: 24px; line-height: 1.1; letter-spacing: -0.02em;">
        Stop applying into the void. <br>
        <span style="color: #F06A26;">Let's Get You Hired.</span>
      </h2>
      <p style="font-size: 20px; color: rgba(255,255,255,0.7); margin-bottom: 40px; line-height: 1.6;">
        We've engineered a proven 3-step pipeline to bypass ATS filters, ace the AI interview, and secure high-paying AI consulting contracts. 
      </p>
      <a href="hiring-pipeline.html" style="background: #F06A26; color: #fff; text-decoration: none; font-weight: 800; font-size: 20px; padding: 20px 48px; border-radius: 12px; display: inline-flex; align-items: center; gap: 12px; transition: all 0.3s; box-shadow: 0 10px 30px rgba(240, 106, 38, 0.3); border: 2px solid #F06A26;">
        Start The Hiring Pipeline ➔
      </a>
    </div>
  </section>
"""

# Insert right before the footer
footer_str = '<!-- ─── Footer ─────────────────────────────────────────── -->'
if footer_str in html:
    html = html.replace(footer_str, bottom_cta + '\n  ' + footer_str)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added bottom CTA.")
else:
    print("Could not find footer.")
