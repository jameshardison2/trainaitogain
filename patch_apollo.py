import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_block = """          if (isApollo) {
              contacts = results.data.filter(r => r['First Name']).map((row, i) => {
                  return {
                      _id: i,
                      name: (row['First Name'] || '') + ' ' + (row['Last Name'] || ''),
                      linkedin_url: row['Person Linkedin Url'] || '',
                      title: row['Title'] || '',
                      company: row['Company Name'] || '',
                      email: row['Email'] || '',
                      domain: row['Industry'] || 'Other',
                      priority_score: 50,
                      outreach_status: 'READY',
                      notes: row['Notes'] || ''
                  };
              });
          } else {
              let missing = required.filter(r => !fields.includes(r));
              if (missing.length > 0) {
                showToast("Unrecognized CSV Format.<br><br>Please upload a standard LinkedIn Connections export, an Apollo.io export, or a Messages.csv file. The system will auto-format it.", "error");
                return;
              }
              contacts = results.data.map((row, i) => {
                row._id = i;
                if(!row.notes) row.notes = "";
                return row;
              });
          }"""

new_block = """          if (isApollo) {
              let added = 0;
              let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
              results.data.filter(r => r['First Name']).forEach(row => {
                  let url = row['Person Linkedin Url'] || '';
                  if (!url || !existingUrls.has(url)) {
                      contacts.push({
                          _id: contacts.length,
                          name: (row['First Name'] || '') + ' ' + (row['Last Name'] || ''),
                          linkedin_url: url,
                          title: row['Title'] || '',
                          company: row['Company Name'] || '',
                          email: row['Email'] || '',
                          domain: row['Industry'] || 'Other',
                          priority_score: 50,
                          outreach_status: 'READY',
                          notes: row['Notes'] || ''
                      });
                      if(url) existingUrls.add(url);
                      added++;
                  }
              });
              showToast("Successfully added " + added + " new Apollo contacts to your pipeline! (Duplicates skipped)", "success");
          } else {
              let missing = required.filter(r => !fields.includes(r));
              if (missing.length > 0) {
                showToast("Unrecognized CSV Format.<br><br>Please upload a standard LinkedIn Connections export, an Apollo.io export, or a Messages.csv file. The system will auto-format it.", "error");
                return;
              }
              let added = 0;
              let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
              results.data.forEach(row => {
                  let url = row.linkedin_url || '';
                  if (!url || !existingUrls.has(url)) {
                      row._id = contacts.length;
                      if(!row.notes) row.notes = "";
                      contacts.push(row);
                      if(url) existingUrls.add(url);
                      added++;
                  }
              });
              showToast("Successfully added " + added + " new standard contacts to your pipeline! (Duplicates skipped)", "success");
          }"""

content = content.replace(old_block, new_block)

with open('outreach-tool.html', 'w') as f:
    f.write(content)

print("Applied apollo append patch")
