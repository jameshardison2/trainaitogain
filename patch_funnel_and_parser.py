import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Fix renderDashboard()
old_dashboard = """        document.getElementById('dash-total').innerText = total;
        document.getElementById('dash-contacted').innerText = contacted;
        document.getElementById('dash-replied').innerText = replied;
        document.getElementById('dash-hired').innerText = hired;
        
        // Update inline funnel in queue screen
        const fTotal = document.getElementById('funnel-total');
        if (fTotal) {
            fTotal.innerText = total;
            document.getElementById('funnel-contacted').innerText = contacted;
            document.getElementById('funnel-replied').innerText = replied;
            document.getElementById('funnel-hired').innerText = hired;
        }"""

new_dashboard = """        const fTotal = document.getElementById('funnel-total');
        if (fTotal) {
            fTotal.innerText = total;
            document.getElementById('funnel-contacted').innerText = contacted;
            document.getElementById('funnel-replied').innerText = replied;
            document.getElementById('funnel-hired').innerText = hired;
        }"""
content = content.replace(old_dashboard, new_dashboard)

# 2. Add renderDashboard() to renderTable()
content = content.replace("function renderTable() {\n", "function renderTable() {\n      renderDashboard();\n")

# 3. Fix O(N^2) duplication and name bugs in parseFile for LinkedIn
old_li_parser = """              if (isLinkedIn) {
                  let added = 0;
                  let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
                  results.data.filter(r => getVal(r, ['First Name'])).forEach(row => {
                      let url = getVal(row, ['URL', 'Profile URL']);
                      let name = (getVal(row, ['First Name']) + ' ' + getVal(row, ['Last Name'])).trim();
                      let isDuplicate = url ? existingUrls.has(url) : contacts.some(c => c.name === name);
                      
                      if (!isDuplicate) {
                          contacts.push({
                              _id: contacts.length,
                              name: name,
                              linkedin_url: url,
                              title: getVal(row, ['Position']),
                              company: getVal(row, ['Company']),
                              email: getVal(row, ['Email Address', 'Email']),
                              domain: 'Other',
                              priority_score: 50,
                              outreach_status: 'READY',
                              notes: 'Connected on: ' + getVal(row, ['Connected On'])
                          });
                          if(url) existingUrls.add(url);
                          added++;
                      }
                  });"""

new_li_parser = """              if (isLinkedIn) {
                  let added = 0;
                  let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
                  let existingNameCompany = new Set(contacts.map(c => c.name + '|' + (c.company||'')).filter(Boolean));
                  
                  results.data.filter(r => getVal(r, ['First Name'])).forEach(row => {
                      let url = getVal(row, ['URL', 'Profile URL']);
                      let name = (getVal(row, ['First Name']) + ' ' + getVal(row, ['Last Name'])).trim();
                      let company = getVal(row, ['Company']);
                      let nameCompKey = name + '|' + company;
                      
                      let isDuplicate = url ? existingUrls.has(url) : existingNameCompany.has(nameCompKey);
                      
                      if (!isDuplicate) {
                          contacts.push({
                              _id: contacts.length,
                              name: name,
                              linkedin_url: url,
                              title: getVal(row, ['Position']),
                              company: company,
                              email: getVal(row, ['Email Address', 'Email']),
                              domain: 'Other',
                              priority_score: 50,
                              outreach_status: 'READY',
                              notes: 'Connected on: ' + getVal(row, ['Connected On'])
                          });
                          if(url) existingUrls.add(url);
                          existingNameCompany.add(nameCompKey);
                          added++;
                      }
                  });"""
content = content.replace(old_li_parser, new_li_parser)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Funnel and parser fixed")
