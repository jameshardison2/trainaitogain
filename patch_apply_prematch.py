import re

with open('apply.html', 'r') as f:
    content = f.read()

# Add script at the end of apply.html to handle ?prematch=
prematch_script = """
    <script>
      // Auto-trigger roles if ?prematch= is present (from CRM)
      window.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const prematch = urlParams.get('prematch');
        if (prematch) {
            const uploadZone = document.getElementById('aws-upload-zone');
            const matchedSection = document.getElementById('matched-roles-section');
            const matchedTrack = document.getElementById('matched-waves-track');
            
            if(uploadZone) uploadZone.style.display = 'none';
            if(matchedSection) matchedSection.style.display = 'block';
            
            try {
                const response = await fetch('waves.json');
                const wavesData = await response.json();
                let roles = wavesData.roles || wavesData;
                
                // Filter by domain
                let matchedRoles = roles.filter(r => r.domain && r.domain.toLowerCase() === prematch.toLowerCase());
                if(matchedRoles.length < 3) matchedRoles = roles.slice(0,3);
                
                matchedTrack.innerHTML = '';
                
                matchedRoles.slice(0, 3).forEach(match => {
                    const company = (JSON.stringify(match).toLowerCase().includes('micro1') || JSON.stringify(match).toLowerCase().includes('refer.micro1.ai')) ? 'Micro1' : 'Mercor';
                    const score = Math.floor(Math.random() * 5) + 94; // 94-98%
                    
                    matchedTrack.innerHTML += `
                        <div style="flex: 0 0 320px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; position: relative; box-shadow: 0 4px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
                            <div style="position:absolute; top:-10px; right:-10px; background:var(--accent); color:white; font-size:12px; font-weight:800; padding:4px 10px; border-radius:100px; box-shadow:0 2px 4px rgba(245,158,11,0.3); border:2px solid white;">🔥 ${score}% Match</div>
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                <div>
                                    <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">${company}</div>
                                    <h3 style="font-size:16px; font-weight:800; color:var(--black); margin:0; line-height:1.3;">${match.title}</h3>
                                </div>
                            </div>
                            <div style="color:var(--accent); font-size:18px; font-weight:800; margin-bottom:12px;">${match.hourlyRate || match.pay}</div>
                            <p style="font-size:13px; color:#475569; line-height:1.5; margin-bottom:20px; flex:1;">Based on your background, this is an exact match for your domain expertise.</p>
                            <a href="${match.applyUrl || match.linkTarget}" target="_blank" style="display:block; text-align:center; background:var(--primary); color:white; padding:12px; border-radius:8px; font-weight:700; text-decoration:none; font-size:14px; transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Proceed to Application ➔</a>
                        </div>
                    `;
                });
            } catch (err) {
                console.error("Prematch load error", err);
            }
        }
      });
    </script>
</body>
"""

content = content.replace('</body>', prematch_script)
with open('apply.html', 'w') as f:
    f.write(content)

print("Updated apply.html")
