import json

with open('waves.json', 'r') as f:
    data = json.load(f)

for role in data.get('roles', []):
    if role.get('linkTarget') == 'apply.html':
        role['linkTarget'] = 'https://t.mercor.com/wbPMF'

with open('waves.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed waves.json")
