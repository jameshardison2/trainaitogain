import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Rebrand the loading messages to sound professional and proprietary
apply_html = apply_html.replace(
    "statusText.innerHTML = '⚙️ Processing PDF locally...';",
    "statusText.innerHTML = '📄 Securely reading your resume...';"
)

apply_html = apply_html.replace(
    "statusText.innerHTML = '🤖 Fetching live database...';",
    "statusText.innerHTML = '🔄 Scanning active network pipelines...';"
)

apply_html = apply_html.replace(
    "statusText.innerHTML = '🧠 Gemini AI is analyzing your experience against all 50 roles...';",
    "statusText.innerHTML = '⚡ TrainAIToGain matching engine is analyzing your experience...';"
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)

print("Rebranded loading states.")
