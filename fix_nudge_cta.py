import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_find = """        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>';"""

js_replace = """        } else if (score < 100) {
           feedbackBox.innerHTML = '<h4>High Match Probability 🟢</h4><p>Excellent work. Your resume is dense with high-value AI keywords. You have a very high probability of passing the automated screening phase.</p>' + nudgeCTA;"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added nudgeCTA to the 80-99% bracket!")
else:
    print("Could not find High Match block.")

