const fs = require('fs');
let code = fs.readFileSync('resume-ats-guide.html', 'utf8');

// Expose local variables to window
code = code.replace('let keywordSets = {};', 'let keywordSets = {}; window.keywordSets = keywordSets;');

fs.writeFileSync('resume-ats-guide.html', code);
console.log("Scope fixed.");
