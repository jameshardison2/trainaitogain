import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the old script with the new one
old_script_start = "<!-- AWS Frontend Integration Script -->"
old_script_end = "</script>"

if old_script_start in content:
    start_idx = content.find(old_script_start)
    end_idx = content.find(old_script_end, start_idx) + len(old_script_end)
    
    new_script = """<!-- AWS Frontend Integration Script -->
    <div id="matched-roles-section" style="display:none; margin-top: 48px;">
      <div class="section-eyebrow" style="color:var(--primary-dark); background:var(--primary-light);">Resume Match Complete</div>
      <h2 style="font-size:24px; font-weight:800; margin-bottom:24px;">Your Top Qualified Roles</h2>
      <div class="feature-grid" id="matched-waves-track" style="grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Injected via JS -->
      </div>
    </div>

    <script>
      const uploadZone = document.getElementById('aws-upload-zone');
      const fileInput = document.getElementById('aws-file-input');
      const statusDiv = document.getElementById('aws-upload-status');
      const statusText = document.getElementById('aws-status-text');
      const matchedSection = document.getElementById('matched-roles-section');
      const matchedTrack = document.getElementById('matched-waves-track');

      uploadZone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusText.innerHTML = '⚙️ Generating pre-signed URL...';

        try {
          await new Promise(r => setTimeout(r, 800)); 
          statusText.innerHTML = '☁️ Uploading directly to S3 Bucket...';
          
          await new Promise(r => setTimeout(r, 1500)); 
          statusText.innerHTML = '🔍 AWS Lambda is analyzing your experience...';
          
          await new Promise(r => setTimeout(r, 1200)); 
          
          statusText.innerHTML = '✅ <strong>Analysis Complete!</strong> We found high-probability matches based on your background.';
          statusDiv.style.background = 'var(--primary-light)';
          statusDiv.style.color = 'var(--primary-dark)';
          statusDiv.style.border = '1px solid var(--primary)';
          
          // Fetch waves.json to mock the backend response
          const response = await fetch('waves.json');
          const data = await response.json();
          
          // Mock logic: grab the first two active roles as "matches"
          const matches = data.roles.slice(0, 2);
          
          matchedTrack.innerHTML = '';
          matches.forEach(role => {
            matchedTrack.innerHTML += `
              <div class="opp-card" style="border: 2px solid var(--primary); box-shadow: 0 8px 24px rgba(52, 211, 153, 0.15);">
                <div style="position:absolute; top:-12px; right:20px; background:var(--primary); color:white; font-size:11px; font-weight:800; padding:4px 10px; border-radius:100px;">98% MATCH</div>
                <div style="display:flex; justify-content:space-between; margin-bottom:16px; align-items:center;">
                  <div style="padding:6px 10px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
                  <div style="color:var(--primary-dark); font-weight:800; font-size:18px;">${role.pay}</div>
                </div>
                <h3 style="font-size:18px; margin-bottom:8px; color:var(--black); line-height:1.2;">${role.title}</h3>
                <p style="color:var(--gray-500); font-size:14px; margin-bottom:20px; flex-grow:1; line-height:1.6;">${role.description}</p>
                <button style="width:100%; text-align:center; background:var(--primary); color:var(--white); font-weight:700; font-size:14px; padding:12px; border-radius:var(--radius-sm); border:none; cursor:pointer;" onclick="window.location.href='${role.linkTarget}'">Apply as Top Match</button>
              </div>
            `;
          });
          
          matchedSection.style.display = 'block';
          
        } catch(error) {
          statusText.innerHTML = '❌ Upload failed. Check CORS configuration.';
        }
      });
    </script>"""
    
    new_content = content[:start_idx] + new_script + content[end_idx:]
    with open('apply.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated script successfully!")
else:
    print("Could not find the old script.")

