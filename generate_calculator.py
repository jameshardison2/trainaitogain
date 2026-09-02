import re

with open("index.html", "r") as f:
    index_content = f.read()

header = re.search(r"(<header.*?</header>)", index_content, re.DOTALL).group(1)
footer = re.search(r"(<footer.*?</footer>)", index_content, re.DOTALL).group(1)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Earnings Calculator — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .calc-container {{ background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-sm); max-width: 600px; margin: 0 auto; }}
    .calc-label {{ font-size: 14px; font-weight: 700; color: var(--black); margin-bottom: 8px; display: block; }}
    .calc-select {{ width: 100%; padding: 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm); font-family: var(--font); font-size: 16px; margin-bottom: 24px; }}
    .calc-slider {{ width: 100%; margin-bottom: 24px; accent-color: var(--primary); }}
    .result-box {{ background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-sm); padding: 24px; text-align: center; }}
    .result-val {{ font-size: 36px; font-weight: 800; color: var(--primary); line-height: 1; margin-bottom: 4px; }}
    .result-lbl {{ font-size: 13px; color: var(--gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 64px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">Earnings Calculator</h1>
    <p style="font-size:16px; color:var(--gray-500);">Is the AI training hustle worth your time? See exactly how much you could earn as a contractor on the Mercor platform.</p>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    
    <div class="calc-container">
      
      <label class="calc-label">Select Your Domain/Role</label>
      <select id="role-select" class="calc-select">
        <option value="150">Senior Software Engineer ($150/hr)</option>
        <option value="130">C++ / Systems Engineer ($130/hr)</option>
        <option value="120">Quant / Mathematics ($120/hr)</option>
        <option value="100">Medical / Clinical Specialist ($100/hr)</option>
        <option value="80">General Practitioner / Finance ($80/hr)</option>
        <option value="40">Generalist / Translation ($40/hr)</option>
      </select>

      <label class="calc-label">Hours Per Week: <span id="hours-display" style="color:var(--primary);">20</span></label>
      <input type="range" id="hours-slider" class="calc-slider" min="5" max="40" step="1" value="20">

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
        <div class="result-box">
          <div class="result-val" id="weekly-pay">$3,000</div>
          <div class="result-lbl">Weekly Income</div>
        </div>
        <div class="result-box">
          <div class="result-val" id="yearly-pay">$156,000</div>
          <div class="result-lbl">Yearly Projection</div>
        </div>
      </div>
      
      <p style="font-size:12px; color:var(--gray-400); text-align:center; margin-top:24px;">*Assuming 52 weeks of consistent project availability. Contractor pay is 1099 and pre-tax.</p>

      <a href="https://t.mercor.com/wbPMF" target="_blank" class="btn-primary" style="display:block; text-align:center; margin-top:24px;">Start Earning on Mercor</a>
    </div>

  </div>
</section>

{footer}

<script>
  const roleSelect = document.getElementById('role-select');
  const hoursSlider = document.getElementById('hours-slider');
  const hoursDisplay = document.getElementById('hours-display');
  const weeklyPay = document.getElementById('weekly-pay');
  const yearlyPay = document.getElementById('yearly-pay');

  function updateCalc() {{
    const rate = parseInt(roleSelect.value);
    const hours = parseInt(hoursSlider.value);
    
    hoursDisplay.innerText = hours;
    
    const weekly = rate * hours;
    const yearly = weekly * 52;

    weeklyPay.innerText = '$' + weekly.toLocaleString();
    yearlyPay.innerText = '$' + yearly.toLocaleString();
  }}

  roleSelect.addEventListener('change', updateCalc);
  hoursSlider.addEventListener('input', updateCalc);
  updateCalc();
</script>

</body>
</html>
"""

with open("is-it-worth-it.html", "w") as f:
    f.write(html)
print("Created is-it-worth-it.html")
