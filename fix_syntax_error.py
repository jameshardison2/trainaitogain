import re

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_syntax = """    // Skip the long greeting and immediately start the interview
    setTimeout(() => {
        askQuestion();
    }, 500);
  });"""

replace_syntax = """    // Skip the long greeting and immediately start the interview
    setTimeout(() => {
        askQuestion();
    }, 500);
    } // CLOSE startInterviewEngine() !!
  });"""

if find_syntax in html:
    html = html.replace(find_syntax, replace_syntax)
else:
    print("Warning: Could not find syntax block")

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed syntax error")
