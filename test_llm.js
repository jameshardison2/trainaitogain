const fs = require('fs');
const data = JSON.parse(fs.readFileSync('cloud_waves.json', 'utf8'));
const roles = Object.keys(data.roles.reduce((acc, r) => { acc[r.title] = 1; return acc; }, {})).join(', ');
console.log("Roles:", roles);
// The resume text
const resumeText = "Machine Learning Engineer Talent Network (95% AI Fit)"; 
const prompt = `You are an AI Career Matchmaker. I have a candidate's resume and a list of active job titles. 
Resume: ${resumeText}
Active Roles: ${roles}

Return a JSON array of the top 3 best matching roles from the list above, along with a percentage match for each. Do not include markdown formatting or backticks. Format exactly like this:
[
  {"role": "Exact Role Title 1", "match": "95%"},
  {"role": "Exact Role Title 2", "match": "88%"},
  {"role": "Exact Role Title 3", "match": "75%"}
]`;
console.log("\nPrompt:", prompt);
