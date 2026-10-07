with open('ai-interview.html', 'r') as f:
    content = f.read()

bad_str = "lengthFeedback + '\n' : ''}"
good_str = "lengthFeedback + '\\n' : ''}"

content = content.replace(bad_str, good_str)

with open('ai-interview.html', 'w') as f:
    f.write(content)
