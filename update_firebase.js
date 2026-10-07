const fs = require('fs');
let config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));

if (!config.hosting.redirects) {
  config.hosting.redirects = [];
}

// Add the vanity URLs
config.hosting.redirects.push({
  "source": "/linkedin",
  "destination": "/?utm_source=linkedin&utm_medium=post",
  "type": 301
});

config.hosting.redirects.push({
  "source": "/dm",
  "destination": "/?utm_source=linkedin&utm_medium=dm",
  "type": 301
});

fs.writeFileSync('firebase.json', JSON.stringify(config, null, 2));
console.log("firebase.json updated successfully.");
