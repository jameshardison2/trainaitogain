with open('ai-interview.html', 'r') as f:
    content = f.read()

bad_str = 'text: "Target Role: " + roleTarget + "\n\nResume:\n" + candidateResume'
good_str = 'text: "Target Role: " + roleTarget + "\\n\\nResume:\\n" + candidateResume'

content = content.replace(bad_str, good_str)

with open('ai-interview.html', 'w') as f:
    f.write(content)
