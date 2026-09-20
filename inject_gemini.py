import re

# Read the raw key from the RTF
with open('api_key.rtf', 'r') as f:
    rtf_content = f.read()

# Extract the key. It's the last word in the RTF usually.
import string
words = rtf_content.split()
api_key = words[-1].strip(string.punctuation + "}")
print(f"Extracted API Key: {api_key}")

with open('chat.js', 'r', encoding='utf-8') as f:
    chat_js = f.read()

# Replace the simulated smart logic with real Gemini API call
gemini_logic = f"""
    // --- GEMINI API INTEGRATION ---
    const apiKey = "{api_key}";
    let botResponse = "";
    
    // Guardrail Check
    if (text.toLowerCase().includes("apply") || text.toLowerCase().includes("ready") || text.toLowerCase().includes("start")) {{
      botResponse = `
        <strong style="color: #ef4444;">🚨 CRITICAL STEP BEFORE YOU APPLY:</strong><br><br>
        Before clicking the application link, you <strong>MUST</strong> create a free Mercor account. If you don't do this first, your progress in the AI interview will be lost!<br><br>
        <a href="https://mercor.com" target="_blank" style="color:#10b981; font-weight:700;">1. Click here to create your account</a><br>
        <a href="apply.html" style="color:#10b981; font-weight:700;">2. Then click here to start the interview</a>
      `;
      document.getElementById(loadingId).remove();
      chatMessages.innerHTML += `
        <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          ${{botResponse}}
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return;
    }}

    try {{
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {{
        method: 'POST',
        headers: {{
          'Content-Type': 'application/json'
        }},
        body: JSON.stringify({{
          contents: [{{
            parts: [{{
              text: "You are a helpful, highly persuasive assistant for the TrainAIToGain hiring pipeline, helping candidates get hired at Mercor. The user asks: " + text + ". Answer in 1 to 3 short sentences. ALWAYS end your answer by urging them to apply right now before the active hiring waves close."
            }}]
          }}]
        }})
      }});
      
      const data = await response.json();
      if (data.error) {{
        throw new Error(data.error.message);
      }}
      
      botResponse = data.candidates[0].content.parts[0].text;
      // Convert markdown bold to html
      botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Add the click-to-apply action at the end
      botResponse += `<br><br><strong style="color:#10b981; cursor:pointer;" onclick="document.getElementById('chat-input').value='I am ready to apply'; document.getElementById('chat-send-btn').click();">Click here if you are ready to apply right now.</strong>`;
      
    }} catch(err) {{
      console.error(err);
      botResponse = "The Mercor AI interview evaluates your critical thinking and communication. My best advice: Answer directly, don't use filler words, and speak clearly. <br><br><strong style='color:#10b981; cursor:pointer;' onclick=\\"document.getElementById('chat-input').value='I am ready to apply'; document.getElementById('chat-send-btn').click();\\">Click here to start the application right now.</strong>";
    }}
    
    document.getElementById(loadingId).remove();
    chatMessages.innerHTML += `
      <div style="align-self: flex-start; background: white; padding: 14px 18px; border-radius: 16px; border-bottom-left-radius: 4px; border: 1px solid #e5e7eb; font-size: 14px; max-width: 85%; line-height: 1.5; color: #111; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${{botResponse}}
      </div>
    `;
"""

# We need to replace everything after `document.getElementById(loadingId).remove();` up to `chatMessages.scrollTop = chatMessages.scrollHeight;` (the second one)
start_str = "document.getElementById(loadingId).remove();"
end_str = "    chatMessages.scrollTop = chatMessages.scrollHeight;\n  }\n\n  chatSendBtn"

if start_str in chat_js and end_str in chat_js:
    start_idx = chat_js.find(start_str)
    end_idx = chat_js.find(end_str)
    
    new_chat_js = chat_js[:start_idx] + gemini_logic + chat_js[end_idx:]
    with open('chat.js', 'w', encoding='utf-8') as f:
        f.write(new_chat_js)
    print("Gemini logic injected!")
else:
    print("Could not find injection points in chat.js")
