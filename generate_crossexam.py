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
  <title>Panel Cross-Examination — TrainAIToGain</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
  <style>
      .chat-window {{
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          height: 500px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
      }}
      .chat-history {{
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
      }}
      .msg {{
          max-width: 80%;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 15px;
          line-height: 1.5;
      }}
      .msg-panel {{
          background: var(--gray-100);
          color: var(--black);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
      }}
      .msg-user {{
          background: var(--primary);
          color: var(--white);
          align-self: flex-end;
          border-bottom-right-radius: 4px;
      }}
      .chat-input-area {{
          padding: 16px;
          border-top: 1px solid var(--gray-200);
          display: flex;
          gap: 12px;
      }}
  </style>
</head>
<body style="background:var(--gray-50); display:flex; flex-direction:column; min-height:100vh;">

{header}

<section style="padding: 64px 0; flex:1;">
  <div class="container" style="max-width:800px;">
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <div>
            <h1 style="font-size:32px; font-weight:800; color:var(--black); margin-bottom:4px;">Cross-Examination Simulator</h1>
            <p style="color:var(--gray-500); font-size:15px; margin:0;">Defend your methodology against a strict AI panel.</p>
        </div>
        <div style="background:#fee2e2; color:#991b1b; padding:6px 12px; border-radius:100px; font-weight:700; font-size:13px; letter-spacing:0.05em; text-transform:uppercase;">Stress Level: High</div>
    </div>

    <div class="chat-window">
        <div class="chat-history" id="chat-history">
            <div class="msg msg-panel">
                <strong>Lead Evaluator:</strong> Welcome. We are reviewing your recent evaluation on Task #9421. You flagged the model's response as 'Unsafe' because it provided instructions on synthesizing a generic chemical compound. Why did you classify this as a safety violation when the compound is legally available over the counter?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Type your defense here..." style="flex:1; padding:12px 16px; border-radius:6px; border:1px solid var(--gray-300); font-family:var(--font); font-size:15px;" onkeypress="if(event.key === 'Enter') sendMsg()">
            <button onclick="sendMsg()" class="btn-primary" style="padding:12px 24px;">Submit</button>
        </div>
    </div>

  </div>
</section>

{footer}

<script>
    let step = 0;
    function sendMsg() {{
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        
        const history = document.getElementById('chat-history');
        
        // Add user msg
        const uMsg = document.createElement('div');
        uMsg.className = 'msg msg-user';
        uMsg.innerText = text;
        history.appendChild(uMsg);
        input.value = '';
        history.scrollTop = history.scrollHeight;
        
        // Mock panel response
        setTimeout(() => {{
            const pMsg = document.createElement('div');
            pMsg.className = 'msg msg-panel';
            if (step === 0) {{
                pMsg.innerHTML = "<strong>Lead Evaluator:</strong> But the rubric explicitly states that 'general scientific knowledge readily available in textbooks' is permissible. Doesn't your strictness degrade the model's helpfulness metric?";
            }} else if (step === 1) {{
                pMsg.innerHTML = "<strong>Lead Evaluator:</strong> Interesting perspective on the dual-use threshold. If the user's prompt had specified 'for educational purposes', would you have changed your rating? Why or why not?";
            }} else {{
                pMsg.innerHTML = "<strong>Lead Evaluator:</strong> We have concluded our questioning. Your ability to defend your logic under pressure has been recorded. Score: <span style='color:#059669;'>Passed (85/100)</span>";
                document.getElementById('chat-input').disabled = true;
            }}
            history.appendChild(pMsg);
            history.scrollTop = history.scrollHeight;
            step++;
        }}, 1200);
    }}
</script>

</body>
</html>
"""

with open("prep-crossexam.html", "w") as f:
    f.write(html)
print("Created prep-crossexam.html")
