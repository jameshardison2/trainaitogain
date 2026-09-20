import re

with open('mercor_sync.py', 'r', encoding='utf-8') as f:
    script = f.read()

# Fix the matching threshold from 0.5 to 0.85
script = script.replace('if best_ratio > 0.5:', 'if best_ratio > 0.85:')

with open('mercor_sync.py', 'w', encoding='utf-8') as f:
    f.write(script)

print("Sync script fixed.")
