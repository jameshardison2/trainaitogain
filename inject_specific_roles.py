import json

with open("waves.json", "r") as f:
    data = json.load(f)

new_roles = [
    {
        "id": "software-firmware-engineering-experts",
        "title": "Software and Firmware Engineering Experts",
        "domain": "SOFTWARE",
        "pay": "$100-$120/hr",
        "status": "ACTIVE",
        "badgeClass": "orange",
        "description": "Requires 5+ years embedded firmware / FPGA / flight software / test automation.",
        "tags": ["Embedded", "Firmware", "Test Automation"],
        "linkTarget": "https://t.mercor.com/wbPMF"
    },
    {
        "id": "senior-book-editor",
        "title": "Senior Book Editor",
        "domain": "GENERAL",
        "pay": "$80/hr",
        "status": "ACTIVE",
        "badgeClass": "orange",
        "description": "Review AI-generated text for long-form narrative coherence and editorial quality.",
        "tags": ["Editing", "Narrative", "Publishing"],
        "linkTarget": "https://app.micro1.ai/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe"
    }
]

# Avoid duplicates
existing_ids = {r["id"] for r in data.get("roles", [])}
for r in new_roles:
    if r["id"] not in existing_ids:
        data["roles"].insert(0, r)

with open("waves.json", "w") as f:
    json.dump(data, f, indent=2)

print("Injected specific roles into waves.json")
