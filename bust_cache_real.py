import time

with open('ai-interview.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add a timestamp comment at the very top of the HTML to force a new file hash
html = f"<!-- CACHE BUST {time.time()} -->\n" + html

with open('ai-interview.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Cache busted")
