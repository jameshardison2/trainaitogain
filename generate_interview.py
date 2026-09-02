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
  <title>AI Interview Simulator — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
    .sim-container {{ background: var(--black); border-radius: var(--radius-lg); padding: 48px; max-width: 700px; margin: 0 auto; color: var(--white); box-shadow: 0 24px 48px rgba(0,0,0,0.4); text-align: center; position: relative; overflow: hidden; }}
    .sim-prompt {{ font-size: 24px; font-weight: 700; line-height: 1.4; margin-bottom: 32px; min-height: 100px; display: flex; align-items: center; justify-content: center; }}
    .sim-timer {{ font-size: 64px; font-weight: 800; color: var(--primary); font-variant-numeric: tabular-nums; margin-bottom: 32px; text-shadow: 0 0 24px rgba(16, 185, 129, 0.4); }}
    .sim-timer.warning {{ color: #ef4444; text-shadow: 0 0 24px rgba(239, 68, 68, 0.4); }}
    .btn-sim {{ background: var(--primary); color: var(--white); border: none; padding: 16px 32px; font-size: 18px; font-weight: 800; border-radius: 100px; cursor: pointer; transition: all 0.2s; font-family: var(--font); box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4); }}
    .btn-sim:hover {{ transform: translateY(-2px); box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6); }}
    .btn-sim:disabled {{ background: var(--gray-700); color: var(--gray-500); cursor: not-allowed; box-shadow: none; transform: none; }}
    
    .sim-camera-light {{ width: 12px; height: 12px; background: #ef4444; border-radius: 50%; position: absolute; top: 24px; right: 24px; opacity: 0; }}
    .sim-camera-light.active {{ animation: blink 1s infinite; }}
    @keyframes blink {{ 0% {{ opacity: 1; }} 50% {{ opacity: 0.2; }} 100% {{ opacity: 1; }} }}
    
    .rubric {{ background: rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 24px; text-align: left; margin-top: 32px; display: none; border: 1px solid rgba(255,255,255,0.2); }}
    .rubric h4 {{ color: var(--primary); margin-bottom: 12px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }}
    .rubric ul {{ padding-left: 20px; color: #ccc; font-size: 15px; line-height: 1.6; margin-bottom: 0; }}
  </style>
</head>
<body style="background:var(--gray-50);">

{header}

<section style="padding: 64px 0 24px;">
  <div class="container" style="text-align:center; max-width:800px;">
    <h1 style="font-size:42px; font-weight:800; color:var(--black); margin-bottom:16px; line-height:1.1;">AI Interview Simulator</h1>
    <p style="font-size:16px; color:var(--gray-500);">The AI will ask you a question and you have exactly 60 seconds to answer using the "Headline First" strategy. Practice speaking out loud before you take the real thing.</p>
  </div>
</section>

<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container">
    
    <div class="sim-container">
      <div class="sim-camera-light" id="camera-light"></div>
      
      <div id="setup-view">
        <h2 style="font-size:28px; margin-bottom:16px;">Ready for the hot seat?</h2>
        <p style="color:#aaa; margin-bottom:32px;">When you click start, a real interview prompt will appear. You will have 60 seconds to respond. Speak your answer out loud.</p>
        <button class="btn-sim" id="start-btn">Start Simulation</button>
      </div>

      <div id="active-view" style="display:none;">
        <div class="sim-prompt" id="prompt-text">Loading question...</div>
        <div class="sim-timer" id="timer-text">60</div>
        
        <div class="rubric" id="rubric-view">
          <h4>Did you pass? (Self-Grading Rubric)</h4>
          <ul id="rubric-points">
            <!-- Populated by JS -->
          </ul>
          <button class="btn-sim" id="next-btn" style="margin-top:24px; font-size:15px; padding:12px 24px;">Next Question</button>
        </div>
      </div>

    </div>

  </div>
</section>

{footer}

<script>
  const questions = [
    {{
      q: "Explain how a Transformer architecture works to a non-technical manager in 60 seconds.",
      r: [
        "Did you start with a clear, 1-sentence headline?",
        "Did you avoid dense jargon (like 'attention mechanisms') or explain them simply?",
        "Did you use an analogy? (e.g., 'It reads a sentence all at once, not word-by-word').",
        "Did you fill the 60 seconds without rambling?"
      ]
    }},
    {{
      q: "What is the difference between supervised fine-tuning (SFT) and RLHF?",
      r: [
        "Did you state the answer immediately? (SFT is teaching it facts, RLHF is teaching it manners/alignment).",
        "Did you explain the human reward component of RLHF clearly?",
        "Did you maintain a confident, expert tone?"
      ]
    }},
    {{
      q: "How would you design a prompt to ensure an LLM outputs valid JSON?",
      r: [
        "Did you mention Few-Shot prompting or providing examples?",
        "Did you mention system instructions constraining the output?",
        "Did you mention validation/retry logic on the application side?"
      ]
    }}
  ];

  let currentQ = 0;
  let timerInterval;

  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const setupView = document.getElementById('setup-view');
  const activeView = document.getElementById('active-view');
  const promptText = document.getElementById('prompt-text');
  const timerText = document.getElementById('timer-text');
  const rubricView = document.getElementById('rubric-view');
  const rubricPoints = document.getElementById('rubric-points');
  const cameraLight = document.getElementById('camera-light');

  function startQuestion() {{
    setupView.style.display = 'none';
    activeView.style.display = 'block';
    rubricView.style.display = 'none';
    cameraLight.classList.add('active');
    
    // Select random question
    currentQ = Math.floor(Math.random() * questions.length);
    promptText.innerText = questions[currentQ].q;
    
    let timeLeft = 60;
    timerText.innerText = timeLeft;
    timerText.classList.remove('warning');

    timerInterval = setInterval(() => {{
      timeLeft--;
      timerText.innerText = timeLeft;
      
      if (timeLeft <= 10) {{
        timerText.classList.add('warning');
      }}

      if (timeLeft <= 0) {{
        clearInterval(timerInterval);
        endQuestion();
      }}
    }}, 1000);
  }}

  function endQuestion() {{
    cameraLight.classList.remove('active');
    timerText.innerText = "Time's Up!";
    
    // Show rubric
    rubricPoints.innerHTML = '';
    questions[currentQ].r.forEach(point => {{
      const li = document.createElement('li');
      li.innerText = point;
      rubricPoints.appendChild(li);
    }});
    
    rubricView.style.display = 'block';
  }}

  startBtn.addEventListener('click', startQuestion);
  nextBtn.addEventListener('click', startQuestion);
</script>

</body>
</html>
"""

with open("ai-interview.html", "w") as f:
    f.write(html)
print("Created ai-interview.html")
