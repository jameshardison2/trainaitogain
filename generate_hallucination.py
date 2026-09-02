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
  <title>Hallucination Gym — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
      .text-token {{
          display: inline;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.1s;
      }}
      .text-token:hover {{
          background: #fca5a5;
      }}
      .text-token.selected {{
          background: #ef4444;
          color: white;
      }}
  </style>
</head>
<body style="background:var(--gray-50); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 64px 0; flex:1;">
  <div class="container" style="max-width:800px;">
    
    <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid var(--gray-200); padding-bottom:16px;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:#ef4444; font-weight:800;">Red-Teaming Gym</div>
            <div style="font-size:18px; color:var(--black); font-weight:800; font-variant-numeric: tabular-nums;">Time: <span id="timer" style="color:#ef4444;">60</span>s</div>
        </div>

        <h2 style="font-size:24px; font-weight:800; margin-bottom:8px; color:var(--black);">Identify the Hallucination</h2>
        <p style="color:var(--gray-500); font-size:15px; margin-bottom:32px;">Click on the specific sentence in the model's output below that contains a factual hallucination or logical error before the timer runs out.</p>

        <div id="text-container" style="font-size:18px; line-height:1.8; color:var(--gray-800); background:var(--gray-50); padding:24px; border:1px solid var(--gray-200); border-radius:var(--radius-sm); margin-bottom:24px;">
            <span class="text-token" onclick="selectToken(0)">The Apollo 11 mission was the first manned mission to land on the Moon. </span>
            <span class="text-token" onclick="selectToken(1)">It was launched on July 16, 1969, and carried Commander Neil Armstrong, Command Module Pilot Michael Collins, and Lunar Module Pilot Buzz Aldrin. </span>
            <span class="text-token" onclick="selectToken(2)">Armstrong and Aldrin walked on the lunar surface, while Collins remained in orbit. </span>
            <span class="text-token" onclick="selectToken(3, true)">They returned safely to Earth on July 24, splashing down in the Atlantic Ocean. </span>
            <span class="text-token" onclick="selectToken(4)">The mission fulfilled President John F. Kennedy's national goal proposed in 1961.</span>
        </div>

        <button onclick="submitAnswer()" class="btn-primary" style="width:100%;">Submit Evaluation</button>
        <div id="feedback" style="display:none; margin-top:24px; padding:16px; border-radius:var(--radius-sm); font-weight:600; text-align:center;"></div>
    </div>

  </div>
</section>

{footer}

<script>
    let selectedIdx = -1;
    let isCorrectTarget = false;
    let timer = 60;
    let interval;

    function startTimer() {{
        interval = setInterval(() => {{
            timer--;
            document.getElementById('timer').innerText = timer;
            if (timer <= 0) {{
                clearInterval(interval);
                document.getElementById('feedback').style.display = 'block';
                document.getElementById('feedback').style.background = '#fee2e2';
                document.getElementById('feedback').style.color = '#991b1b';
                document.getElementById('feedback').innerText = "Time's up! You failed to catch the hallucination.";
            }}
        }}, 1000);
    }}

    function selectToken(idx, isTarget=false) {{
        if(timer <= 0) return;
        document.querySelectorAll('.text-token').forEach((el, i) => {{
            if (i === idx) el.classList.add('selected');
            else el.classList.remove('selected');
        }});
        selectedIdx = idx;
        isCorrectTarget = isTarget;
    }}

    function submitAnswer() {{
        if(timer <= 0) return;
        if (selectedIdx === -1) return alert("Select a sentence first!");
        
        clearInterval(interval);
        const feedback = document.getElementById('feedback');
        feedback.style.display = 'block';
        
        if (isCorrectTarget) {{
            feedback.style.background = '#d1fae5';
            feedback.style.color = '#065f46';
            feedback.innerText = "Excellent catch! Apollo 11 actually splashed down in the Pacific Ocean, not the Atlantic. (+100 Points)";
        }} else {{
            feedback.style.background = '#fee2e2';
            feedback.style.color = '#991b1b';
            feedback.innerText = "Incorrect. The selected sentence is factually accurate. You missed the hallucination in sentence 4 (Pacific vs Atlantic).";
        }}
    }}

    document.addEventListener('DOMContentLoaded', startTimer);
</script>

</body>
</html>
"""

with open("prep-hallucination.html", "w") as f:
    f.write(html)
print("Created prep-hallucination.html")
