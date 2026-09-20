import json, urllib.request, ssl, re
from bs4 import BeautifulSoup
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

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
    
    mercor_roles = {}
    for job in listings:
        title = job.get('title')
        if title:
            mercor_roles[title] = {
                'rateMin': job.get('rateMin', 0),
                'rateMax': job.get('rateMax', 0),
                'status': job.get('status', 'active')
            }
            
    print(f"-> Found {len(mercor_roles)} live roles on Mercor.")
    
    print("2. Parsing local apply.html for evergreen roles...")
    try:
        with open('apply.html', 'r', encoding='utf-8') as f:
            apply_html = f.read()
    except Exception as e:
        print("Could not read apply.html:", e)
        return
        
    apply_soup = BeautifulSoup(apply_html, 'html.parser')
    cards = apply_soup.find_all('div', class_='opp-card')
    
    local_roles = {}
    for card in cards:
        # Ignore dynamically injected ones (we just look at raw HTML which has all 50)
        title_el = card.find('h3')
        if not title_el: continue
        title = title_el.text.strip()
        
        domain_el = card.find('div', style=lambda s: s and 'letter-spacing:0.05em' in s)
        domain = domain_el.text.strip() if domain_el else "GENERAL"
        
        desc_el = card.find('p')
        desc = desc_el.text.strip() if desc_el else ""
        
        tags = []
        for span in card.find_all('span'):
            if 'background:var(--gray-200)' in str(span.get('style', '')):
                tags.append(span.text.strip())
                
        local_roles[title] = {
            'domain': domain,
            'description': desc,
            'tags': tags
        }
        
    print(f"-> Found {len(local_roles)} local roles.")
    
    print("3. Matching and syncing...")
    active_waves = []
    closed_roles = []
    
    for local_title, local_data in local_roles.items():
        # Very simple matching: is there a Mercor role that is highly similar?
        # Or just check if local_title keywords are in mercor_roles
        best_match = None
        best_ratio = 0
        for m_title in mercor_roles.keys():
            ratio = similar(local_title, m_title)
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = m_title
                
        # If we have a decent match (> 0.5) we consider it active
        if best_ratio > 0.85:
            m_data = mercor_roles[best_match]
            rate = f"${m_data['rateMax']}/hr" if m_data['rateMax'] else "$100/hr"
            active_waves.append({
                "id": local_title.lower().replace(' ', '-').replace('/', ''),
                "title": local_title,
                "domain": local_data['domain'],
                "pay": rate,
                "status": "ACTIVE",
                "badgeClass": "orange",
                "description": local_data['description'],
                "tags": local_data['tags'],
                "linkTarget": "apply.html"
            })
        else:
            # If no match, it's closed
            closed_roles.append(local_title)
            
    # For demonstration, limit active waves to top 6 so it doesn't overwhelm the UI
    
    
    output = {
        "lastUpdated": "Auto-Synced",
        "roles": active_waves,
        "closedRoles": closed_roles
    }
    
    with open('waves.json', 'w') as f:
        json.dump(output, f, indent=2)
        
    print(f"Success! Synced {len(active_waves)} active roles and {len(closed_roles)} closed roles to waves.json")

if __name__ == "__main__":
    run_sync()
