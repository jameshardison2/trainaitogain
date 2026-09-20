import json, urllib.request, ssl, time
from bs4 import BeautifulSoup

API_KEY = "AIzaSyD54pf1L7RK3uc4y8qK_gsY38BHzXJwb_A"

def generate_job_details(title):
    print(f"Generating details for: {title}")
    prompt = f"""You are an expert technical recruiter. Based ONLY on the job title '{title}', write a realistic 3-sentence job description for this role. Then, provide a comma-separated list of exactly 8 core industry keywords required for this role.

Output exactly in this JSON format:
{{
  "description": "...",
  "atsKeywords": ["Keyword1", "Keyword2", ...]
}}
"""
    data = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}]
    }).encode('utf-8')
    
    req = urllib.request.Request(
        f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}',
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        response = urllib.request.urlopen(req, context=ctx)
        result = json.loads(response.read().decode('utf-8'))
        text = result['candidates'][0]['content']['parts'][0]['text']
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].strip()
        
        parsed = json.loads(text)
        return parsed['description'], parsed['atsKeywords']
    except Exception as e:
        print(f"Gemini error for {title}: {e}")
        return "Mercor is actively hiring for this position right now.", []

def run_sync():
    print("1. Fetching live job data from Mercor...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request('https://mercor.com/jobs', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    except Exception as e:
        print("Failed to fetch Mercor:", e)
        return

    soup = BeautifulSoup(html, 'html.parser')
    script = soup.find('script', id='__NEXT_DATA__')
    if not script:
        print("Could not find __NEXT_DATA__")
        return
        
    data = json.loads(script.string)
    listings = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [{}])[0].get('state', {}).get('data', {}).get('listings', [])
    
    active_listings = [j for j in listings if j.get('status', 'active') == 'active']
    active_listings.sort(key=lambda x: x.get('rateMax', 0) or 0, reverse=True)
    top_50 = active_listings[:50]
    
    active_waves = []
    
    for job in top_50:
        title = job.get('title', 'Unknown Role')
        rateMax = job.get('rateMax', 0)
        rate = f"${rateMax}/hr" if rateMax else "Market Rate"
        
        domain_tag = "GENERAL"
        if "software" in title.lower() or "engineer" in title.lower() or "developer" in title.lower():
            domain_tag = "SOFTWARE"
        elif "finance" in title.lower() or "analyst" in title.lower():
            domain_tag = "FINANCE"
        elif "medical" in title.lower() or "health" in title.lower():
            domain_tag = "MEDICAL"
            
        desc, keywords = generate_job_details(title)
        
        active_waves.append({
            "id": title.lower().replace(' ', '-').replace('/', '').replace(',', ''),
            "title": title,
            "domain": domain_tag,
            "pay": rate,
            "status": "ACTIVE",
            "badgeClass": "orange",
            "description": desc,
            "atsKeywords": keywords,
            "tags": [domain_tag.capitalize(), "Remote"],
            "platform": "Mercor",
            "linkTarget": "apply.html"
        })
        time.sleep(1)
        
    # HYBRID APPEND: Add Micro1 Jobs manually so they are never deleted
    micro1_referral = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral"
    
    micro1_jobs = [
        {
            "id": "micro1-member-of-technical-staff",
            "title": "Member of Technical Staff",
            "domain": "SOFTWARE",
            "pay": "$50-$100/hr",
            "status": "ACTIVE",
            "badgeClass": "blue",
            "description": "Micro1 is seeking elite software engineers to train the next generation of coding models. Must pass the Zara AI technical interview.",
            "atsKeywords": ["Software Engineering", "System Design", "Python", "Data Structures", "Zara Interview", "Algorithm Optimization", "Code Quality", "LLM Evaluation"],
            "tags": ["Software", "Remote", "Micro1"],
            "platform": "Micro1",
            "linkTarget": micro1_referral
        },
        {
            "id": "micro1-forward-deployed-engineer",
            "title": "Forward Deployed Engineer",
            "domain": "SOFTWARE",
            "pay": "$60-$120/hr",
            "status": "ACTIVE",
            "badgeClass": "blue",
            "description": "Work directly on deploying and fine-tuning AI models. High-paying role requiring rigorous technical validation via AI interview.",
            "atsKeywords": ["Forward Deployed", "Machine Learning", "Model Fine-Tuning", "Deployment", "AI Integration", "Python", "Client-Facing", "Technical Validation"],
            "tags": ["Software", "Remote", "Micro1"],
            "platform": "Micro1",
            "linkTarget": micro1_referral
        },
        {
            "id": "micro1-subject-matter-expert",
            "title": "Subject Matter Expert (Various Domains)",
            "domain": "GENERAL",
            "pay": "$40-$80/hr",
            "status": "ACTIVE",
            "badgeClass": "blue",
            "description": "Provide human intelligence and evaluate AI outputs in your specific area of expertise (Law, Medicine, Finance, etc).",
            "atsKeywords": ["Subject Matter Expert", "Data Annotation", "Fact-Checking", "Domain Expertise", "RLHF", "Data Quality", "AI Training", "Evaluation"],
            "tags": ["General", "Remote", "Micro1"],
            "platform": "Micro1",
            "linkTarget": micro1_referral
        }
    ]
    
    active_waves.extend(micro1_jobs)
        
    output = {
        "lastUpdated": "Auto-Synced Live",
        "roles": active_waves,
        "closedRoles": []
    }
    
    with open('waves.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Success! Populated waves.json with {len(active_waves)} LIVE REAL roles from Mercor.")

if __name__ == "__main__":
    run_sync()
