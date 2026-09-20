import re

with open('mercor_sync.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the line: active_waves = active_waves[:6]
code = re.sub(r'active_waves\s*=\s*active_waves\[:6\]', '', code)

with open('mercor_sync.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed scraper!")
