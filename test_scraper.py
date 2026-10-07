import json, urllib.request, ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://mercor.com/jobs', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')
script = soup.find('script', id='__NEXT_DATA__')

data = json.loads(script.string)
listings = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {}).get('queries', [{}])[0].get('state', {}).get('data', {}).get('listings', [])

if listings:
    print(json.dumps(listings[0], indent=2))
