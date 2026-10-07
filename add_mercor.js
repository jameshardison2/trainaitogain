const fs = require('fs');

const newJobs = [
  { title: "Agent Engineer", link: "https://t.mercor.com/kVNzT", pay: "Competitive", domain: "SOFTWARE" },
  { title: "Customer Success Engineer (LatAm)", link: "https://t.mercor.com/kGQE9", pay: "Competitive", domain: "SOFTWARE" },
  { title: "Customer Success Engineer (India)", link: "https://t.mercor.com/fE2I6", pay: "Competitive", domain: "SOFTWARE" },
  { title: "Customer Success - Operations (India)", link: "https://t.mercor.com/MaTRp", pay: "Competitive", domain: "GENERAL" },
  { title: "Cybersecurity Research Expert", link: "https://t.mercor.com/DG7EB", pay: "Competitive", domain: "SOFTWARE" },
  { title: "Physician Talent Network", link: "https://t.mercor.com/MBefW", pay: "$100/hr+", domain: "MEDICAL" },
  { title: "Machine Learning Engineer Talent Network", link: "https://t.mercor.com/yRhGV", pay: "$100/hr+", domain: "SOFTWARE" },
  { title: "Disease-Area Clinician", link: "https://t.mercor.com/cr9De", pay: "$100/hr+", domain: "MEDICAL" },
  { title: "Pharma Commercial Forecasting Expert", link: "https://t.mercor.com/gKSwB", pay: "$100/hr+", domain: "FINANCE" },
  { title: "Expert Senior SWE", link: "https://t.mercor.com/7qxQv", pay: "$100/hr+", domain: "SOFTWARE" },
  { title: "UK-Based Data Engineering Experts", link: "https://t.mercor.com/dEdG2", pay: "Competitive", domain: "SOFTWARE" },
  { title: "Compensation & Equity Expert", link: "https://t.mercor.com/92d2s", pay: "Competitive", domain: "FINANCE" },
  { title: "Payer & Market Access Expert", link: "https://t.mercor.com/LTeeO", pay: "Competitive", domain: "FINANCE" },
  { title: "Biotech Investment Analyst", link: "https://t.mercor.com/yz4ov", pay: "Competitive", domain: "FINANCE" },
  { title: "Financial Analyst Talent Network", link: "https://t.mercor.com/94FOe", pay: "Competitive", domain: "FINANCE" },
  { title: "Epidemiologist", link: "https://t.mercor.com/gkwKq", pay: "Competitive", domain: "MEDICAL" },
  { title: "Pro Bono Counsel", link: "https://t.mercor.com/K4k63", pay: "Competitive", domain: "LEGAL" }
];

let waves = JSON.parse(fs.readFileSync('waves.json', 'utf8'));

for (let job of newJobs) {
  let id = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Check if it exists already
  let exists = waves.roles.find(r => r.title.includes(job.title) || job.title.includes(r.title));
  if (!exists) {
    waves.roles.push({
      id: "mercor-" + id,
      title: job.title,
      domain: job.domain,
      pay: job.pay,
      status: "ACTIVE",
      badgeClass: "black",
      description: "Mercor is actively hiring for this position right now.",
      atsKeywords: ["Remote", "AI", "Mercor", job.domain],
      tags: ["Remote", "Mercor"],
      platform: "Mercor",
      linkTarget: job.link
    });
    console.log("Added: " + job.title);
  }
}

fs.writeFileSync('waves.json', JSON.stringify(waves, null, 2));
console.log("Done adding missing Mercor jobs.");
