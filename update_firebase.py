import json
with open("firebase.json", "r") as f:
    config = json.load(f)

config["hosting"]["redirects"].append({
    "source": "/guide-download",
    "destination": "/trainaitogain-hiring-blueprint.pdf",
    "type": 301
})

with open("firebase.json", "w") as f:
    json.dump(config, f, indent=2)
print("Updated firebase.json with redirect for /guide-download")
