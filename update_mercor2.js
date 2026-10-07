const fs = require('fs');

const liveMercorJobs = {
  "Software & Firmware Evaluator": "https://t.mercor.com/0e9X7",
  "Senior Design Expert": "https://t.mercor.com/13F7G",
  "Legacy Codebase Migration Expert": "https://t.mercor.com/vKkRA",
  "Multilingual Primary Care Physician": "https://t.mercor.com/EK8QX",
  "Multilingual Inpatient Physician": "https://t.mercor.com/pwGel",
  "Agent Engineer": "https://t.mercor.com/kVNzT",
  "Customer Success Engineer (LatAm)": "https://t.mercor.com/kGQE9",
  "Customer Success Engineer (India)": "https://t.mercor.com/fE2I6",
  "Customer Success - Operations (India)": "https://t.mercor.com/MaTRp",
  "Cybersecurity Research Expert": "https://t.mercor.com/DG7EB",
  "Physician Talent Network": "https://t.mercor.com/MBefW",
  "Machine Learning Engineer Talent Network": "https://t.mercor.com/yRhGV",
  "Disease-Area Clinician": "https://t.mercor.com/cr9De",
  "Pharma Commercial Forecasting Expert": "https://t.mercor.com/gKSwB",
  "Expert Senior SWE": "https://t.mercor.com/7qxQv",
  "UK-Based Data Engineering Experts": "https://t.mercor.com/dEdG2",
  "Compensation & Equity Expert": "https://t.mercor.com/92d2s",
  "Payer & Market Access Expert": "https://t.mercor.com/LTeeO",
  "Biotech Investment Analyst": "https://t.mercor.com/yz4ov",
  "Financial Analyst Talent Network": "https://t.mercor.com/94FOe",
  "Epidemiologist": "https://t.mercor.com/gkwKq",
  "Pro Bono Counsel": "https://t.mercor.com/K4k63",
};

let waves = JSON.parse(fs.readFileSync('waves.json', 'utf8'));

if (!waves.closedRoles) {
  waves.closedRoles = [];
}

let activeRoles = [];

for (let role of waves.roles) {
  if (role.platform !== "Micro1" && (!role.platform || (role.linkTarget && role.linkTarget.includes("mercor")))) {
    let exactTitle = role.title.trim();
    let matchedLink = liveMercorJobs[exactTitle];
    
    if (!matchedLink) {
      for (let key in liveMercorJobs) {
        if (exactTitle.includes(key) || key.includes(exactTitle)) {
          matchedLink = liveMercorJobs[key];
          break;
        }
      }
    }

    if (matchedLink) {
      role.linkTarget = matchedLink;
      role.platform = "Mercor"; // Add it so it's clean
      activeRoles.push(role);
      console.log("Updated live Mercor job: " + exactTitle);
    } else {
      waves.closedRoles.push(exactTitle);
      console.log("Moved dead Mercor job to closedRoles: " + exactTitle);
    }
  } else {
    activeRoles.push(role);
  }
}

waves.roles = activeRoles;
fs.writeFileSync('waves.json', JSON.stringify(waves, null, 2));
console.log("Done updating Mercor jobs.");
