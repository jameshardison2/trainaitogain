import json
import random

software_titles = [
    "Senior Python / ML Evaluator", "C++ Systems & Performance", "Frontend / React Architecture", 
    "Data Engineering / SQL Architect", "Security & Cryptography", "General SWE / Leetcode Master",
    "Rust Backend Engineer", "Go Cloud Infrastructure", "AI Research Scientist", "DevOps / SRE Architect",
    "Blockchain / Web3 Developer", "iOS / Swift Engineer", "Android / Kotlin Expert", "Embedded Systems C/C++"
]
medical_titles = [
    "Oncology AI Reviewer", "Neurology / BCI Annotator", "General Practitioner Evaluator",
    "Pharmacology Expert", "Surgical Methodology", "Radiology / MRI Annotator",
    "Cardiology Diagnostic Reviewer", "Pediatrics Case Specialist", "Psychiatry / Therapy AI Analyst",
    "Dermatology Vision Model Expert", "Pathology Slide Reviewer"
]
finance_titles = [
    "Quant Dev / Algo Trader", "Actuarial Science Reviewer", "Corporate Finance / M&A",
    "PhD Level Mathematician", "Tax Strategy & Compliance", "Hedge Fund Risk Analyst",
    "Derivatives Pricing Expert", "Crypto Economics Researcher", "Venture Capital Analyst",
    "Macroeconomics Forecaster"
]
translation_titles = [
    "Legal Document Reviewer (Bilingual)", "Japanese/English Cultural Context",
    "Arabic Natural Language Processing", "Spanish / English Localization",
    "Mandarin Tone & Nuance Evaluator", "French Medical Translation",
    "German Financial Documentation", "Hindi Speech-to-Text Annotator",
    "Korean Sentiment Analysis", "Russian Political Context Reviewer"
]
general_titles = [
    "Creative Writer / Fiction Author", "Journalism Fact Checker", "History / Humanities Expert",
    "Instruction Following Evaluator", "Prompt Engineering Specialist"
]

def generate_role(title, domain, tag):
    pay = random.choice([80, 90, 100, 120, 130, 150])
    if domain == "translation" or domain == "general":
        pay = random.choice([40, 50, 60, 80])
    
    desc_templates = [
        f"Evaluate reasoning chains and logic paths for frontier models using {title.lower()} expertise.",
        f"Design complex prompting scenarios and analyze model outputs for accuracy in {title.lower()}.",
        f"Audit LLM hallucinations and enforce strict safety constraints within {title.lower()} domains.",
        f"Curate high-quality, expert-level training datasets specifically for {title.lower()}.",
        f"Review AI-generated code/text against domain-specific rubrics for {title.lower()} tasks."
    ]
    
    return {
        "title": title,
        "pay": f"${pay}/hr",
        "tag": tag,
        "hot": random.random() > 0.7,
        "desc": random.choice(desc_templates),
        "skills": [domain.capitalize(), "AI Evaluation", "Critical Thinking"]
    }

roles = {
    "software": [generate_role(t, "software", "SOFTWARE") for t in software_titles],
    "medical": [generate_role(t, "medical", "MEDICAL") for t in medical_titles],
    "finance": [generate_role(t, "finance", "FINANCE") for t in finance_titles],
    "translation": [generate_role(t, "translation", "TRANSLATION") for t in translation_titles],
    "general": [generate_role(t, "general", "GENERAL") for t in general_titles]
}

with open("roles.json", "w") as f:
    json.dump(roles, f, indent=2)

print(f"Generated {sum(len(v) for v in roles.values())} roles.")
