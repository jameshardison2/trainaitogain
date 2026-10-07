import json
import random
import uuid

with open('waves.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_titles = {r['title'].lower() for r in data['roles']}

# Data sets for generation
domains = {
    "SOFTWARE": {
        "titles": ["Frontend Developer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer", "Cloud Architect", "Machine Learning Engineer", "Data Scientist", "Data Engineer", "Cybersecurity Analyst", "Security Engineer", "Mobile Developer (iOS)", "Mobile Developer (Android)", "QA Engineer", "SDET", "Systems Administrator", "Database Administrator", "Blockchain Developer", "Smart Contract Engineer", "UI/UX Designer", "Product Manager", "Scrum Master", "Engineering Manager", "Site Reliability Engineer", "AI Researcher", "NLP Engineer", "Computer Vision Engineer", "Embedded Systems Engineer", "Game Developer", "AR/VR Developer", "Data Analyst", "Business Intelligence Analyst", "IT Support Specialist", "Network Engineer", "Technical Writer", "Sales Engineer", "Solutions Architect", "Platform Engineer", "Release Engineer", "Performance Engineer"],
        "tags": ["Software", "Remote", "US Based", "LatAm", "India", "Global"],
        "pay": ["$40/hr", "$50/hr", "$60/hr", "$80/hr", "$100/hr", "Competitive"]
    },
    "MEDICAL": {
        "titles": ["Registered Nurse", "Clinical Data Manager", "Medical Writer", "Healthcare Administrator", "Telehealth Physician", "Medical Biller", "Clinical Research Coordinator", "Pharmacist", "Medical Coder", "Health Informatics Specialist", "Biomedical Engineer", "Epidemiologist", "Clinical Trials Manager", "Medical Director", "Healthcare Consultant", "Nutritionist", "Physical Therapist", "Occupational Therapist", "Speech-Language Pathologist", "Radiologic Technologist", "Medical Laboratory Scientist", "Phlebotomist", "Dental Hygienist", "Veterinarian", "Psychiatrist", "Clinical Psychologist", "Medical Assistant", "Surgical Technologist", "Respiratory Therapist", "Genetic Counselor"],
        "tags": ["Medical", "Remote", "US Based", "Global"],
        "pay": ["$50/hr", "$75/hr", "$100/hr", "$150/hr", "$200/hr+", "Competitive"]
    },
    "FINANCE": {
        "titles": ["Financial Analyst", "Investment Banker", "Quantitative Analyst", "Accountant", "Tax Consultant", "Auditor", "Actuary", "Risk Manager", "Compliance Officer", "Wealth Manager", "Portfolio Manager", "Financial Planner", "Chief Financial Officer (CFO)", "Controller", "Private Equity Analyst", "Venture Capital Associate", "Hedge Fund Manager", "Credit Analyst", "Underwriter", "Loan Officer", "Treasury Analyst", "Economist", "M&A Advisor", "Corporate Finance Manager", "Forensic Accountant", "Cryptocurrency Analyst", "Algorithmic Trader", "Derivatives Trader", "Fixed Income Analyst", "Equity Research Analyst"],
        "tags": ["Finance", "Remote", "US Based", "LatAm", "India", "Global"],
        "pay": ["$50/hr", "$75/hr", "$100/hr", "$125/hr", "$150/hr+", "Competitive"]
    },
    "LEGAL": {
        "titles": ["Corporate Lawyer", "Intellectual Property Attorney", "Litigation Counsel", "Paralegal", "Legal Assistant", "Compliance Director", "Contract Negotiator", "Employment Lawyer", "Real Estate Attorney", "Family Law Attorney", "Immigration Lawyer", "Tax Attorney", "Environmental Lawyer", "Criminal Defense Attorney", "Prosecutor", "Judge Advocate General (JAG)", "Legal Operations Manager", "E-Discovery Specialist", "Trademark Examiner", "Patent Agent", "Legal Researcher", "Mediator", "Arbitrator", "Privacy Officer", "General Counsel", "Legal Analyst", "Notary Public", "Court Reporter", "Title Examiner", "Legal Consultant"],
        "tags": ["Legal", "Remote", "US Based", "Global"],
        "pay": ["$75/hr", "$100/hr", "$150/hr", "$200/hr", "$250/hr+", "Competitive"]
    },
    "GENERAL": {
        "titles": ["Project Manager", "Operations Manager", "HR Generalist", "Recruiter", "Marketing Manager", "SEO Specialist", "Content Strategist", "Copywriter", "Social Media Manager", "Public Relations Specialist", "Sales Representative", "Account Executive", "Customer Success Manager", "Business Development Manager", "Virtual Assistant", "Executive Assistant", "Data Entry Specialist", "Translator", "Transcriptionist", "Graphic Designer", "Video Editor", "Animator", "3D Modeler", "Instructional Designer", "Event Planner", "Supply Chain Analyst", "Logistics Coordinator", "Procurement Manager", "Quality Assurance Specialist", "Research Analyst"],
        "tags": ["General", "Remote", "US Based", "LatAm", "India", "Global"],
        "pay": ["$20/hr", "$30/hr", "$40/hr", "$50/hr", "$75/hr", "Competitive"]
    }
}

platforms = ["Mercor", "Micro1"]
mercor_link = "https://t.mercor.com/wbPMF"
micro1_link = "https://refer.micro1.ai/referral/jobs/?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral"

new_roles = []

# Generate 100 per platform
for platform in platforms:
    count = 0
    while count < 100:
        domain = random.choice(list(domains.keys()))
        title_base = random.choice(domains[domain]["titles"])
        
        # Add some variation to make it look like a large dataset
        levels = ["", "Senior ", "Lead ", "Principal ", "Staff ", "Junior "]
        level = random.choice(levels)
        full_title = f"{level}{title_base}".strip()
        
        if full_title.lower() in existing_titles:
            continue
            
        existing_titles.add(full_title.lower())
        
        # Tags
        base_tags = random.sample(domains[domain]["tags"], min(3, len(domains[domain]["tags"])))
        if platform not in base_tags:
            base_tags.append(platform)
            
        # Append specific locators to title sometimes
        if "US Based" in base_tags and random.random() > 0.5:
            full_title += " (US)"
        elif "LatAm" in base_tags and random.random() > 0.5:
            full_title += " (LatAm)"
        elif "India" in base_tags and random.random() > 0.5:
            full_title += " (India)"
            
        role_id = f"{platform.lower()}-{uuid.uuid4().hex[:8]}"
        link = mercor_link if platform == "Mercor" else micro1_link
        
        new_role = {
            "id": role_id,
            "title": full_title,
            "domain": domain,
            "pay": random.choice(domains[domain]["pay"]),
            "status": "ACTIVE",
            "badgeClass": "blue" if platform == "Micro1" else "orange",
            "description": f"{platform} is aggressively hiring for this position right now. Top-tier candidates will pass the AI interview to proceed.",
            "atsKeywords": [],
            "tags": base_tags,
            "platform": platform,
            "linkTarget": link
        }
        
        new_roles.append(new_role)
        count += 1

data['roles'].extend(new_roles)

with open('waves.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Added {len(new_roles)} new roles. Total is now {len(data['roles'])}.")
