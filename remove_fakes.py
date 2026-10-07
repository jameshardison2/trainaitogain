import json

with open('waves.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

original_len = len(data['roles'])

fake_desc = "is aggressively hiring for this position right now. Top-tier candidates will pass the AI interview to proceed."

real_roles = [r for r in data['roles'] if fake_desc not in r.get('description', '')]

data['roles'] = real_roles

with open('waves.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Removed {original_len - len(real_roles)} fake roles. Kept {len(real_roles)} real roles.")
