import json

roles = {
  "software": [
    {
      "title": "Software and Firmware Engineering Experts",
      "pay": "$100 - $120/hr",
      "tag": "SOFTWARE",
      "hot": True,
      "desc": "Requires 5+ years embedded firmware / FPGA / flight software / test automation. Fit for aerospace and test-automation.",
      "skills": ["Firmware", "Embedded", "FPGA", "C++"],
      "platform": "Mercor",
      "url": "https://work.mercor.com/jobs/list_AAABoN3XEiwdzQPPxfdGkJ7M/software-firmware-engineering-experts"
    },
    {
      "title": "C++ Systems and Performance",
      "pay": "$150/hr",
      "tag": "SOFTWARE",
      "hot": False,
      "desc": "Optimize low-level systems and evaluate AI-generated C++ code.",
      "skills": ["C++", "Systems", "Performance"],
      "platform": "Mercor",
      "url": "https://t.mercor.com/wbPMF"
    },
    {
      "title": "iOS / Swift Engineer",
      "pay": "$100/hr",
      "tag": "SOFTWARE",
      "hot": False,
      "desc": "Evaluate AI models on iOS/Swift development tasks.",
      "skills": ["iOS", "Swift", "Mobile"],
      "platform": "Mercor",
      "url": "https://t.mercor.com/wbPMF"
    }
  ],
  "medical": [
    {
      "title": "Clinical Diagnostic Expert",
      "pay": "$100/hr",
      "tag": "MEDICAL",
      "hot": True,
      "desc": "Evaluate AI models on complex clinical diagnostics and ethical medical reasoning.",
      "skills": ["MD", "Diagnostic", "Clinical"],
      "platform": "Mercor",
      "url": "https://t.mercor.com/wbPMF"
    }
  ],
  "finance": [
    {
      "title": "Crypto Economics Researcher",
      "pay": "$150/hr",
      "tag": "FINANCE",
      "hot": True,
      "desc": "Evaluate reasoning chains and logic paths for frontier models using crypto economics researcher expertise.",
      "skills": ["Crypto", "Economics", "Research"],
      "platform": "Mercor",
      "url": "https://t.mercor.com/wbPMF"
    }
  ],
  "general": [
    {
      "title": "Senior Book Editor",
      "pay": "$80/hr",
      "tag": "GENERAL",
      "hot": True,
      "desc": "Review AI-generated text for long-form narrative coherence and editorial quality.",
      "skills": ["Editing", "Narrative", "Publishing"],
      "platform": "Micro1",
      "url": "https://app.micro1.ai/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe"
    }
  ]
}

with open("roles.json", "w") as f:
    json.dump(roles, f, indent=2)

print("Updated roles.json")
