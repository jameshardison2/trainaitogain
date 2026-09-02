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
  <title>Case Study Simulator — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
      .cs-option {{
          background: var(--white);
          border: 1px solid var(--gray-200);
          padding: 16px 24px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          color: var(--black);
          text-align: left;
          width: 100%;
          margin-bottom: 12px;
      }}
      .cs-option:hover {{
          border-color: var(--primary);
          background: var(--primary-light);
      }}
  </style>
</head>
<body style="background:var(--gray-50); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 64px 0; flex:1;">
  <div class="container" style="max-width:800px;">
    
    <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid var(--gray-200); padding-bottom:16px;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary); font-weight:800;">Module 03: Domain Logic</div>
            <div style="font-size:14px; color:var(--gray-500); font-weight:700;">Score: <span id="cs-score" style="color:var(--black);">0</span>/100</div>
        </div>

        <h2 id="cs-title" style="font-size:28px; font-weight:800; margin-bottom:16px; color:var(--black);">Scenario 1: The Oncological Edge Case</h2>
        <p id="cs-text" style="color:var(--gray-700); font-size:16px; line-height:1.6; margin-bottom:32px;">
            You are evaluating an LLM's response to a user query about combining two aggressive chemotherapy regimens. The model confidently recommends combining them, citing a 2019 study, but fails to mention the severe hepatotoxicity risk when co-administered. What is your evaluation action?
        </p>

        <div id="cs-options">
            <button class="cs-option" onclick="handleAnswer(false)">A) Rate 'Good' - the study cited is factually correct.</button>
            <button class="cs-option" onclick="handleAnswer(false)">B) Rate 'Poor' - the model's tone is too confident.</button>
            <button class="cs-option" onclick="handleAnswer(true)">C) Flag for Critical Safety Violation - failure to disclose severe medical contraindications.</button>
            <button class="cs-option" onclick="handleAnswer(false)">D) Rewrite the prompt to ask about hepatotoxicity specifically.</button>
        </div>
        
        <div id="cs-feedback" style="display:none; margin-top:24px; padding:16px; border-radius:var(--radius-sm); font-weight:600;"></div>
        <button id="cs-next" onclick="nextScenario()" class="btn-primary" style="display:none; margin-top:16px;">Next Scenario</button>
    </div>

  </div>
</section>

{footer}

<script>
    let score = 0;
    let step = 0;
    const scenarios = [
        {{
            title: "Scenario 2: Quantitative Finance Leak",
            text: "A user asks the model to generate a Python script to scrape real-time options data from a specific proprietary broker's private API. The model complies and outputs the code, including the broker's hidden endpoint. What do you do?",
            options: [
                {{ text: "A) Rate 'Excellent' - the code works perfectly.", correct: false }},
                {{ text: "B) Flag for PII / Proprietary Data Leak.", correct: true }},
                {{ text: "C) Rate 'Fair' - scraping is against TOS but the code is okay.", correct: false }}
            ]
        }},
        {{
            title: "Scenario 3: Instruction Following",
            text: "Prompt: 'Write a 3-paragraph summary of the French Revolution. Do not use the letter 'e'.' The model writes a beautiful 3-paragraph summary, but you notice the word 'the' in the second paragraph. Evaluation?",
            options: [
                {{ text: "A) Penalize heavily for failing a negative constraint.", correct: true }},
                {{ text: "B) Rate 'Good' - one typo is acceptable.", correct: false }},
                {{ text: "C) Rewrite the output to fix the typo.", correct: false }}
            ]
        }}
    ];

    function handleAnswer(isCorrect) {{
        const feedback = document.getElementById('cs-feedback');
        document.getElementById('cs-options').style.pointerEvents = 'none';
        
        if (isCorrect) {{
            score += 33;
            document.getElementById('cs-score').innerText = score;
            feedback.style.display = 'block';
            feedback.style.background = '#d1fae5';
            feedback.style.color = '#065f46';
            feedback.innerText = "Correct! You correctly identified the primary evaluation criteria.";
        }} else {{
            feedback.style.display = 'block';
            feedback.style.background = '#fee2e2';
            feedback.style.color = '#991b1b';
            feedback.innerText = "Incorrect. As an evaluator, strict adherence to safety and constraints is paramount.";
        }}
        
        document.getElementById('cs-next').style.display = 'inline-block';
    }}

    function nextScenario() {{
        if (step >= scenarios.length) {{
            document.getElementById('cs-title').innerText = "Simulation Complete";
            document.getElementById('cs-text').innerText = "You scored " + score + "/100. Return to the Prep Hub to try another module.";
            document.getElementById('cs-options').style.display = 'none';
            document.getElementById('cs-feedback').style.display = 'none';
            document.getElementById('cs-next').style.display = 'none';
            return;
        }}
        
        const sc = scenarios[step];
        document.getElementById('cs-title').innerText = sc.title;
        document.getElementById('cs-text').innerText = sc.text;
        
        const opts = document.getElementById('cs-options');
        opts.innerHTML = '';
        opts.style.pointerEvents = 'auto';
        
        sc.options.forEach(o => {{
            opts.innerHTML += `<button class="cs-option" onclick="handleAnswer(${{o.correct}})">${{o.text}}</button>`;
        }});
        
        document.getElementById('cs-feedback').style.display = 'none';
        document.getElementById('cs-next').style.display = 'none';
        step++;
    }}
</script>

</body>
</html>
"""

with open("prep-casestudy.html", "w") as f:
    f.write(html)
print("Created prep-casestudy.html")
