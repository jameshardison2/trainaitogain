with open('ai-interview.html', 'r') as f:
    content = f.read()

bad_str = "finalFeedback.replace(/\n/g, '<br>');"
good_str = "finalFeedback.replace(/\\n/g, '<br>');"

content = content.replace(bad_str, good_str)

with open('ai-interview.html', 'w') as f:
    f.write(content)
