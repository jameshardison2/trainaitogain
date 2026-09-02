import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r'(<nav class="nav".*?</nav>)', index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Community Wait-Time Database — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .data-table {{ width: 100%; border-collapse: collapse; background: var(--white); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-200); }}
    .data-table th {{ background: var(--gray-50); padding: 16px 24px; text-align: left; font-size: 13px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--gray-200); }}
    .data-table td {{ padding: 20px 24px; border-bottom: 1px solid var(--gray-200); font-size: 15px; color: var(--black); font-weight: 500; }}
    .data-table tr:last-child td {{ border-bottom: none; }}
    .data-table tbody tr:hover {{ background: var(--gray-50); }}
    .status-dot {{ width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; }}
    .dot-fast {{ background: #10b981; box-shadow: 0 0 8px #10b981; }}
    .dot-med {{ background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }}
    .dot-slow {{ background: #ef4444; box-shadow: 0 0 8px #ef4444; }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 64px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">Community Wait-Time Database</h1>
    <p style="font-size:16px; color:var(--gray-500);">Applied but haven't heard back? Check the crowdsourced queue velocity below to see if they are actively hiring for your pipeline.</p>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Role / Pipeline</th>
            <th>Pay Rate</th>
            <th>Current Wait Time</th>
            <th>Queue Velocity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color:var(--black);">Senior Python/ML Evaluator</strong></td>
            <td>$150/hr</td>
            <td><strong>2 - 5 days</strong></td>
            <td><span class="status-dot dot-fast"></span> Extremely Fast</td>
          </tr>
          <tr>
            <td><strong style="color:var(--black);">Quant Developer / Math</strong></td>
            <td>$120 - $150/hr</td>
            <td><strong>3 - 7 days</strong></td>
            <td><span class="status-dot dot-fast"></span> Fast</td>
          </tr>
          <tr>
            <td><strong style="color:var(--black);">General Medical Practitioner</strong></td>
            <td>$80 - $100/hr</td>
            <td><strong>1 - 2 weeks</strong></td>
            <td><span class="status-dot dot-med"></span> Moderate</td>
          </tr>
          <tr>
            <td><strong style="color:var(--black);">Frontend / Full Stack Web</strong></td>
            <td>$70 - $100/hr</td>
            <td><strong>2 - 3 weeks</strong></td>
            <td><span class="status-dot dot-med"></span> Moderate</td>
          </tr>
          <tr>
            <td><strong style="color:var(--black);">Translation & Linguistics</strong></td>
            <td>$40 - $50/hr</td>
            <td><strong>3 - 5 weeks</strong></td>
            <td><span class="status-dot dot-slow"></span> Slow</td>
          </tr>
          <tr>
            <td><strong style="color:var(--black);">Generalist (No Specialty)</strong></td>
            <td>$20 - $40/hr</td>
            <td><strong>45+ days</strong></td>
            <td><span class="status-dot dot-slow"></span> Paused / Overcrowded</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:var(--radius-lg); padding:32px; margin-top:48px;">
      <h3 style="color:#92400e; font-size:20px; font-weight:700; margin-bottom:12px;">Stuck in the Generalist Queue?</h3>
      <p style="color:#92400e; font-size:15px; margin-bottom:16px;">If you've been waiting over 30 days, your resume likely got routed to the lowest-priority queue. You need to re-format your resume to trigger a specialized pipeline (like Tech, Medical, or Finance) and re-apply.</p>
      <a href="resume-ats-guide.html" style="color:#b45309; font-weight:700; text-decoration:underline;">See the Resume Formatter &rarr;</a>
    </div>

  </div>
</section>

{footer}

</body>
</html>
"""

with open("no-response.html", "w") as f:
    f.write(html)
print("Created no-response.html")
