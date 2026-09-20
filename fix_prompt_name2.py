import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('Optimization Payload to automatically rewrite', 'AI Prompt to generate a prompt that will rewrite')
html = html.replace('Optimization Payload to weave in', 'AI Prompt to weave in')
html = html.replace('Copy the exact ATS payload below', 'Copy the exact AI Prompt below')
html = html.replace('Copy Optimization Payload', 'Copy AI Prompt')
html = html.replace('Generates custom exact match phrasing', 'Copies a custom prompt for ChatGPT / Claude')

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced all text occurrences!")
