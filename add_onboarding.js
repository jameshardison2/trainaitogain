const fs = require('fs');

let content = fs.readFileSync('extension/content.js', 'utf8');

const injection = `
      pResume.value = res.tgMasterProfile.resume || '';
      pBio.value = res.tgMasterProfile.bio || '';
      pLink.value = res.tgMasterProfile.linkedin || '';
    }
    
    // START HERE onboarding logic
    if (!res.tgMasterProfile || !res.tgMasterProfile.resume) {
        // Switch to profile tab automatically
        document.querySelector('[data-tab="profile"]').click();
        
        // Add a "Start Here" banner
        const profileTab = document.getElementById('trainai-tab-profile');
        if (!document.getElementById('tg-start-here')) {
            const banner = document.createElement('div');
            banner.id = 'tg-start-here';
            banner.className = 'trainai-alert';
            banner.style.marginTop = '0';
            banner.style.marginBottom = '16px';
            banner.style.borderColor = '#10b981';
            banner.style.color = '#10b981';
            banner.style.background = 'rgba(16,185,129,0.1)';
            banner.innerHTML = '<strong>👋 START HERE:</strong> Paste your resume below and click Save. This unlocks the Autofill tool!';
            profileTab.prepend(banner);
        }
    }
`;

content = content.replace(
  /pResume\.value = res\.tgMasterProfile\.resume \|\| '';\n\s+pBio\.value = res\.tgMasterProfile\.bio \|\| '';\n\s+pLink\.value = res\.tgMasterProfile\.linkedin \|\| '';\n\s+\}/g,
  injection
);

fs.writeFileSync('extension/content.js', content, 'utf8');
console.log('Added Start Here onboarding');
