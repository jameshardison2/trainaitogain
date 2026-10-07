import re

with open('shared.css', 'r') as f:
    content = f.read()

# Replace the specific variables
content = re.sub(
    r'--primary:\s*#059669;',
    r'--primary: #10B981;\n  --accent: #F59E0B;\n  --accent-light: #fef3c7;\n  --accent-dark: #d97706;',
    content
)

# And fix shadow-orange from the green color to an orange one, though it might not be used much
content = re.sub(
    r'--shadow-orange: 0 8px 28px rgba\(16,185,129,0\.1\);',
    r'--shadow-orange: 0 8px 28px rgba(245, 158, 11, 0.2);',
    content
)

with open('shared.css', 'w') as f:
    f.write(content)
print("Updated shared.css")
