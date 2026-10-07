with open('ai-interview.html', 'r') as f:
    content = f.read()

content = content.replace('.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px; display: flex; flex-direction: row; gap: 48px; align-items: stretch; }', '.prep-hub { max-width: 1500px; margin: 0 auto; padding: 64px 24px 100px 24px; display: flex; flex-direction: row; gap: 48px; align-items: stretch; }')

with open('ai-interview.html', 'w') as f:
    f.write(content)
print("Applied padding")
