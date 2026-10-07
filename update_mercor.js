const fs = require('fs');

const liveMercorJobs = {
  "Software & Firmware Evaluator": "https://t.mercor.com/0e9X7",
  "Senior Design Expert": "https://t.mercor.com/13F7G",
  "Legacy Codebase Migration Expert": "https://t.mercor.com/vKkRA",
  "Multilingual Primary Care Physician (MD) — AI Evaluation": "https://t.mercor.com/EK8QX",
  "Multilingual Inpatient Physician (MD) — Clinical Documentation & AI Evaluation": "https://t.mercor.com/pwGel",
  "Agent Engineer": "https://t.mercor.com/kVNzT",
  "Customer Success Engineer (LatAm)": "https://t.mercor.com/kGQE9",
  "Customer Success Engineer (India)": "https://t.mercor.com/fE2I6",
  "Customer Success - Operations (India Region)": "https://t.mercor.com/MaTRp",
  "Customer Success - Operations (India)": "https://t.mercor.com/MaTRp",
  "Cybersecurity Research Expert – Offensive Security & Vulnerability Research": "https://t.mercor.com/DG7EB",
  "Cybersecurity Research Expert": "https://t.mercor.com/DG7EB",
  "Physician Talent Network": "https://t.mercor.com/MBefW",
  "Machine Learning Engineer Talent Network": "https://t.mercor.com/yRhGV",
  "Disease-Area Clinician — Trial Endpoints & Prescribing": "https://t.mercor.com/cr9De",
  "Disease-Area Clinician": "https://t.mercor.com/cr9De",
  "Pharma Commercial Forecasting Expert — Launch Curves": "https://t.mercor.com/gKSwB",
  "Pharma Commercial Forecasting Expert": "https://t.mercor.com/gKSwB",
  "Expert Senior SWE": "https://t.mercor.com/7qxQv",
  "UK-Based Data Engineering Experts": "https://t.mercor.com/dEdG2",
  "Compensation & Equity Expert (Total Rewards)": "https://t.mercor.com/92d2s",
  "Compensation & Equity Expert": "https://t.mercor.com/92d2s",
  "Payer & Market Access Expert — Gross-to-Net & Formulary Strategy": "https://t.mercor.com/LTeeO",
  "Payer & Market Access Expert": "https://t.mercor.com/LTeeO",
  "Biotech Investment Analyst — Drug Asset & Company Assessment": "https://t.mercor.com/yz4ov",
  "Biotech Investment Analyst": "https://t.mercor.com/yz4ov",
  "Financial Analyst Talent Network": "https://t.mercor.com/94FOe",
  "Epidemiologist — Patient Population Sizing": "https://t.mercor.com/gkwKq",
  "Epidemiologist": "https://t.mercor.com/gkwKq",
  "Pro Bono Counsel (Access to Justice Expert)": "https://t.mercor.com/K4k63",
  "Pro Bono Counsel": "https://t.mercor.com/K4k63",
};

let waves = JSON.parse(fs.readFileSync('waves.json', 'utf8'));

if (!waves.closedRoles) {
  waves.closedRoles = [];
}

let activeRoles = [];

for (let role of waves.roles) {
  if (role.platform === "Mercor") {
    let exactTitle = role.title.trim();
    let matchedLink = liveMercorJobs[exactTitle];
    
    // Also try fuzzy match if exact fails
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
