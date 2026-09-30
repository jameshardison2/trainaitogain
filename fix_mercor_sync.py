import json, urllib.request, ssl
from bs4 import BeautifulSoup

def run_sync():
    print("Fetching live job data from Mercor...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request('https://mercor.com/jobs', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    script = soup.find('script', id='__NEXT_DATA__')
    
    data = json.loads(script.string)
    listings = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [{}])[0].get('state', {}).get('data', {}).get('listings', [])
    
    active_waves = []
    
    for job in listings:
        title = job.get('title')
        if not title: continue
        
        # Add the Micro1 specific role the user wanted too?
        # Actually just output all Mercor jobs.
        rate = f"${job.get('rateMax', 100)}/hr"
        tags = []
        if job.get('skills'):
            tags = [s.get('name') for s in job.get('skills')[:3]]
            
        active_waves.append({
            "id": title.lower().replace(' ', '-').replace('/', ''),
            "title": title,
            "domain": "SOFTWARE" if "Engineer" in title or "Developer" in title else "GENERAL",
            "pay": rate,
            "status": "ACTIVE",
            "badgeClass": "orange",
            "description": "Auto-synced from Mercor live listings.",
            "tags": tags,
            "linkTarget": "https://t.mercor.com/wbPMF"
        })
        
    # Append the Micro1 role requested by user
    active_waves.insert(0, {
        "id": "senior-book-editor",
        "title": "Senior Book Editor",
        "domain": "GENERAL",
        "pay": "$80/hr",
        "status": "ACTIVE",
        "badgeClass": "orange",
        "description": "Review AI-generated text for long-form narrative coherence and editorial quality.",
        "tags": ["Editing", "Narrative", "Publishing"],
        "linkTarget": "https://app.micro1.ai/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe"
    })
    
    output = {
        "lastUpdated": "Auto-Synced",
        "roles": active_waves,
        "closedRoles": []
    }
    
    with open('waves.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Success! Synced {len(active_waves)} active roles to waves.json")

if __name__ == "__main__":
    run_sync()
