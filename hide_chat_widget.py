import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_next = """    if (currentQ + 1 >= currentQuestions.length) {
      setUIState('feedback', 'Module Complete');"""

replace_next = """    if (currentQ + 1 >= currentQuestions.length) {
      setUIState('feedback', 'Module Complete');
      
      // Hide the global chat widget so it doesn't overlap the final dashboard
      const chatWidget = document.getElementById('chat-widget-container');
      if (chatWidget) chatWidget.style.display = 'none';
      const chatToggle = document.getElementById('chat-widget-toggle');
      if (chatToggle) chatToggle.style.display = 'none';"""

if find_next in html:
    html = html.replace(find_next, replace_next)
else:
    print("Warning: Could not find nextBtn listener feedback state")

html = html.replace('<!-- CACHE BUST 21', '<!-- CACHE BUST 22')

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added logic to hide the Guide Assistant on the Final Dashboard")
