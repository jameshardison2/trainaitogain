import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

old_parse_file_regex = re.compile(r'function parseFile\(file\) \{.*?Papa\.parse\(file.*?reader\.readAsText\(file\);\n    \}', re.DOTALL)
old_parse_file_regex2 = re.compile(r'function parseFile\(file\) \{.*?Papa\.parse\(file.*?saveData\(\);\n\s*showQueue\(\);\n\s*\}\n\s*\}\);\n\s*\}', re.DOTALL)

new_parse_file = """function parseFile(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          let text = e.target.result;
          
          // Handle LinkedIn Export Preamble (Connections.csv often has "Notes:" at the top)
          if (text.startsWith("Notes:")) {
              let lines = text.split('\\n');
              let headerIdx = lines.findIndex(l => l.includes('First Name') || l.includes('name'));
              if (headerIdx > 0) {
                  text = lines.slice(headerIdx).join('\\n');
              }
          }
          
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
              const required = ['name', 'linkedin_url', 'domain', 'priority_score', 'outreach_status'];
              const fields = (results.meta.fields || []).map(f => f.trim().toUpperCase());
              
              // Robust auto-mapping checks
              let isApollo = fields.includes('PERSON LINKEDIN URL');
              let isLinkedIn = fields.includes('FIRST NAME') && (fields.includes('URL') || fields.includes('COMPANY'));
              let isMessages = fields.some(f => f.includes('CONTENT') || f.includes('MESSAGE')) && fields.some(f => f.includes('SENDER') || f.includes('FROM'));
              
              // Use original fields to fetch data
              const origFields = results.meta.fields || [];
              const getVal = (row, possibleNames) => {
                  for (let n of possibleNames) {
                      let match = origFields.find(f => f.trim().toUpperCase() === n.toUpperCase());
                      if (match && row[match]) return row[match];
                  }
                  return '';
              };

              if (isMessages) {
                  if (contacts.length === 0) {
                      showToast("Please upload your Contacts (Apollo/LinkedIn) FIRST to build the queue before uploading Messages.", "warning");
                      return;
                  }
                  let matchedCount = 0;
                  results.data.forEach(row => {
                      let msgContent = getVal(row, ['CONTENT', 'MESSAGE CONTENT']);
                      if (!msgContent) return;
                      
                      let sender = getVal(row, ['FROM', 'SENDER PROFILE NAME']);
                      let to = getVal(row, ['TO']); // If available
                      
                      // Try to find the contact by name
                      let contact = contacts.find(c => c.name && (sender.includes(c.name) || to.includes(c.name)));
                      if (contact) {
                          if (!contact.notes.includes(msgContent.substring(0, 20))) {
                              contact.notes += "\\n\\n[PAST MESSAGE]: " + msgContent;
                              matchedCount++;
                          }
                      }
                  });
                  saveData();
                  showToast("Successfully attached " + matchedCount + " past messages to your CRM contacts!", "success");
                  showQueue();
                  return;
              }
              
              if (isLinkedIn) {
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
                  });
                  saveData();
                  showToast("Successfully added " + added + " new LinkedIn contacts to your pipeline! (Duplicates skipped)", "success");
                  showQueue();
                  return;
              }
              
              if (isApollo) {
                  let added = 0;
                  let existingUrls = new Set(contacts.map(c => c.linkedin_url).filter(Boolean));
                  results.data.filter(r => getVal(r, ['First Name'])).forEach(row => {
                      let url = getVal(row, ['Person Linkedin Url']);
                      if (!url || !existingUrls.has(url)) {
                          contacts.push({
                              _id: contacts.length,
                              name: (getVal(row, ['First Name']) + ' ' + getVal(row, ['Last Name'])).trim(),
                              linkedin_url: url,
                              title: getVal(row, ['Title']),
                              company: getVal(row, ['Company Name', 'Company']),
                              email: getVal(row, ['Email']),
                              domain: getVal(row, ['Industry']) || 'Other',
                              priority_score: 50,
                              outreach_status: 'READY',
                              notes: getVal(row, ['Notes'])
                          });
                          if(url) existingUrls.add(url);
                          added++;
                      }
                  });
                  saveData();
                  showToast("Successfully added " + added + " new Apollo contacts to your pipeline! (Duplicates skipped)", "success");
                  showQueue();
                  return;
              }
              
              // Standard fallback
              let missing = required.filter(r => !origFields.includes(r));
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
              saveData();
              showToast("Successfully added " + added + " new standard contacts to your pipeline! (Duplicates skipped)", "success");
              showQueue();
            }
          });
      };
      reader.readAsText(file);
    }"""

content = old_parse_file_regex2.sub(new_parse_file, content)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Replaced parseFile logic")
