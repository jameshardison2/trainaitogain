import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Hide the old screen-upload and replace the top nav to include a button
# Wait, actually we can just leave screen-upload but add a button to screen-queue that triggers file upload.
# Let's put an "Import CSV" button in the nav-tabs area or filters.
import_btn = """
        <button class="btn" id="tab-dashboard" style="background:transparent; color:var(--gray-600);" onclick="switchTab('dashboard')">Dashboard</button>
        <button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="margin-left:12px; padding:6px 12px; font-size:13px; background:#047857; border:none;">➕ Import CSV</button>
"""
content = content.replace('<button class="btn" id="tab-dashboard" style="background:transparent; color:var(--gray-600);" onclick="switchTab(\'dashboard\')">Dashboard</button>', import_btn)

# Make screen-upload display:none by default and ALWAYS show screen-queue if there are contacts, or just always show screen-queue but empty?
# The user wants to combine them. Let's just remove screen-upload and move file-input into the body.
remove_upload_screen = r"""  <!-- Screen 1: Upload -->
  <div id="screen-upload">
    <h2 style="margin-top:0;">Upload Outreach Queue</h2>
    <p style="color:var(--gray-500);">Upload the ranked CSV from the LinkedIn export tool to begin.</p>
    
    <div class="drop-zone" id="drop-zone">
      <div style="font-size:32px; margin-bottom:12px;">📁</div>
      <p style="margin:0; font-weight:600; color:var(--gray-700);">Drag and drop CSV file here</p>
      <p style="margin:8px 0 0 0; font-size:13px; color:var(--gray-500);">or click to browse</p>
      <input type="file" id="file-input" accept=".csv" style="display:none;">
    </div>
  </div>"""

content = content.replace(remove_upload_screen, '<input type="file" id="file-input" accept=".csv" style="display:none;">')

# 2. Add the Mapper Modal HTML right before </body>
mapper_html = """
<!-- Field Mapper Modal -->
<div id="mapper-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:100000; align-items:center; justify-content:center;">
    <div style="background:white; padding:32px; border-radius:16px; width:90%; max-width:500px; box-shadow:0 12px 32px rgba(0,0,0,0.2);">
        <h2 style="margin-top:0; font-size:20px; font-weight:800;">Map CSV Columns</h2>
        <p style="color:var(--gray-500); font-size:14px; margin-bottom:24px;">Match your CSV headers to the CRM fields.</p>
        
        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
            <div>
                <label style="font-weight:700; font-size:13px; margin-bottom:4px; display:block;">Full Name <span style="color:#ef4444;">*</span></label>
                <select id="map-name" class="status-dropdown" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--gray-300);"></select>
            </div>
            <div>
                <label style="font-weight:700; font-size:13px; margin-bottom:4px; display:block;">LinkedIn URL <span style="color:#ef4444;">*</span></label>
                <select id="map-url" class="status-dropdown" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--gray-300);"></select>
            </div>
            <div>
                <label style="font-weight:700; font-size:13px; margin-bottom:4px; display:block;">Job Title</label>
                <select id="map-title" class="status-dropdown" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--gray-300);"></select>
            </div>
            <div>
                <label style="font-weight:700; font-size:13px; margin-bottom:4px; display:block;">Company</label>
                <select id="map-company" class="status-dropdown" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--gray-300);"></select>
            </div>
            <div>
                <label style="font-weight:700; font-size:13px; margin-bottom:4px; display:block;">Email Address</label>
                <select id="map-email" class="status-dropdown" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--gray-300);"></select>
            </div>
        </div>
        
        <div style="display:flex; gap:12px;">
            <button class="btn btn-outline" style="flex:1;" onclick="document.getElementById('mapper-modal').style.display='none'">Cancel</button>
            <button class="btn btn-primary" style="flex:1;" onclick="applyMapping()">Import Contacts</button>
        </div>
    </div>
</div>
"""
content = content.replace('</body>', mapper_html + '\n</body>')

# 3. Rewrite the CSV parsing logic
# Old showQueue() handled screen-upload. Let's fix showQueue()
content = content.replace("document.getElementById('screen-upload').style.display = 'none';", "")

# We need to completely replace `parseFile(file)`
old_parse_file_regex = r"function parseFile\(file\) \{.*?saveData\(\);\s*\}\s*\}\);\s*\}"

new_parse_file = r"""
    let pendingCSVData = [];
    
    function parseFile(file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          pendingCSVData = results.data;
          const fields = results.meta.fields || [];
          
          if(fields.length === 0) {
              alert("No columns found in CSV.");
              return;
          }
          
          // Auto-detect Messages CSV vs Contacts CSV
          if(fields.includes('CONTENT') && (fields.includes('FROM') || fields.includes('SENDER PROFILE URL'))) {
             if (contacts.length === 0) {
                  alert("Please upload your Connections.csv FIRST to build the CRM queue!");
                  return;
              }
              let matchedCount = 0;
              results.data.forEach(row => {
                  let msgContent = row['CONTENT'] || '';
                  if(!msgContent) return;
                  let senderUrl = row['SENDER PROFILE URL'] || '';
                  if(senderUrl) {
                      let c = contacts.find(x => x.linkedin_url === senderUrl || senderUrl.includes(x.linkedin_url));
                      if(c && !c.notes.includes(msgContent)) { c.notes += "\nMsg: " + msgContent; matchedCount++; }
                  }
              });
              saveData();
              alert("Successfully attached " + matchedCount + " past messages!");
              renderTable();
              return;
          }
          
          // Show Mapping Modal
          const selects = ['map-name', 'map-url', 'map-title', 'map-company', 'map-email'];
          selects.forEach(id => {
              const el = document.getElementById(id);
              el.innerHTML = '<option value="">-- Ignore / Not Present --</option>';
              fields.forEach(f => {
                  el.innerHTML += `<option value="${f}">${f}</option>`;
              });
          });
          
          // Auto-select smart defaults
          const guess = (id, keywords) => {
              const f = fields.find(x => keywords.some(k => x.toLowerCase().includes(k)));
              if(f) document.getElementById(id).value = f;
          };
          guess('map-name', ['name', 'first name']);
          guess('map-url', ['url', 'linkedin', 'profile']);
          guess('map-title', ['title', 'position', 'headline']);
          guess('map-company', ['company', 'employer']);
          guess('map-email', ['email']);
          
          document.getElementById('mapper-modal').style.display = 'flex';
        }
      });
    }

    function applyMapping() {
        const mName = document.getElementById('map-name').value;
        const mUrl = document.getElementById('map-url').value;
        
        if(!mName || !mUrl) {
            alert("Name and LinkedIn URL are strictly required to create a contact.");
            return;
        }
        
        const mTitle = document.getElementById('map-title').value;
        const mCompany = document.getElementById('map-company').value;
        const mEmail = document.getElementById('map-email').value;
        
        let added = 0;
        const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c._id)) : -1;
        
        pendingCSVData.forEach((row, i) => {
            const nameVal = row[mName];
            const urlVal = row[mUrl];
            if(!nameVal || !urlVal) return;
            
            // Prevent duplicates
            if(contacts.find(c => c.linkedin_url === urlVal)) return;
            
            contacts.push({
                _id: maxId + 1 + added,
                name: nameVal,
                linkedin_url: urlVal,
                title: mTitle ? (row[mTitle] || '') : '',
                company: mCompany ? (row[mCompany] || '') : '',
                email: mEmail ? (row[mEmail] || '') : '',
                domain: 'Other',
                priority_score: 50,
                outreach_status: 'READY',
                notes: ''
            });
            added++;
        });
        
        document.getElementById('mapper-modal').style.display = 'none';
        saveData();
        renderTable();
        alert(`Successfully imported ${added} new contacts!`);
    }
"""

content = re.sub(old_parse_file_regex, new_parse_file, content, flags=re.DOTALL)

with open('outreach-tool.html', 'w') as f:
    f.write(content)

print("Updated CSV Mapper Logic")
