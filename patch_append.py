import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# Replace LinkedIn block
old_linkedin = """          if (isLinkedIn) {
              contacts = results.data.filter(r => r['First Name'] && r['URL']).map((row, i) => {
                  return {
                      _id: i,
                      name: (row['First Name'] || '') + ' ' + (row['Last Name'] || ''),
                      linkedin_url: row['URL'] || '',
                      title: row['Position'] || '',
                      company: row['Company'] || '',
                      email: row['Email Address'] || '',
                      domain: 'Other',
                      priority_score: 50,
                      outreach_status: 'READY',
                      notes: 'Connected on: ' + (row['Connected On'] || '')
                  };
              });
              saveData();
              showQueue();
              return;
          }"""

new_linkedin = """          if (isLinkedIn) {
              let added = 0;
              let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
              results.data.filter(r => r['First Name'] && r['URL']).forEach(row => {
                  let url = row['URL'] || '';
                  if (!existingUrls.has(url)) {
                      contacts.push({
                          _id: contacts.length,
                          name: (row['First Name'] || '') + ' ' + (row['Last Name'] || ''),
                          linkedin_url: url,
                          title: row['Position'] || '',
                          company: row['Company'] || '',
                          email: row['Email Address'] || '',
                          domain: 'Other',
                          priority_score: 50,
                          outreach_status: 'READY',
                          notes: 'Connected on: ' + (row['Connected On'] || '')
                      });
                      existingUrls.add(url);
                      added++;
                  }
              });
              saveData();
              showToast("Successfully added " + added + " new LinkedIn contacts to your pipeline! (Duplicates skipped)", "success");
              showQueue();
              return;
          }"""
content = content.replace(old_linkedin, new_linkedin)

# Replace Apollo block
# Note: In outreach-tool.html, the Apollo block doesn't immediately return. It falls through. Let's fix that too.
old_apollo_regex = re.compile(r"          if \(isApollo\) \{.*?contacts = results\.data\.filter\(r => r\['First Name'\]\)\.map\(\(row, i\) => \{.*?return \{.*?_id: i,.*?name: \(row\['First Name'\] \|\| ''\) \+ ' ' \+ \(row\['Last Name'\] \|\| ''\),.*?linkedin_url: row\['Person Linkedin Url'\] \|\| '',.*?title: row\['Title'\] \|\| '',.*?company: row\['Company Name'\] \|\| '',.*?email: row\['Email'\] \|\| '',.*?domain: row\['Industry'\] \|\| 'Other',.*?priority_score: 50,.*?outreach_status: 'READY',.*?notes: row\['Notes'\] \|\| ''.*?\};.*?\}\);\n          \} else \{", re.DOTALL)

# Let's inspect the actual apollo block first to be safe
