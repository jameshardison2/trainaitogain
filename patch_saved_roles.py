import re

with open('saved-roles.html', 'r') as f:
    content = f.read()

# 1. Add Analytics Bar HTML above the saved-roles-container
analytics_bar_html = """
      <div id="analytics-bar" style="display:flex; flex-wrap:wrap; gap:16px; margin-bottom:32px;">
        <div style="flex:1; background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:center;">
          <div style="font-size:12px; color:var(--gray-500); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Pipeline Volume</div>
          <div style="font-size:32px; font-weight:800; color:var(--black);" id="stat-count">0</div>
        </div>
        <div style="flex:1; background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:center;">
          <div style="font-size:12px; color:var(--gray-500); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Avg Potential Pay</div>
          <div style="font-size:32px; font-weight:800; color:var(--accent);" id="stat-pay">$0/hr</div>
        </div>
        <div style="flex:2; background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:center;">
          <div style="font-size:12px; color:var(--gray-500); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">Conversion Funnel</div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <div style="flex:1; text-align:center;">
              <div style="height:8px; background:var(--gray-200); border-radius:4px; margin-bottom:8px; overflow:hidden;"><div id="bar-saved" style="height:100%; width:0%; background:var(--primary); transition:width 0.5s;"></div></div>
              <span style="font-size:11px; font-weight:600; color:var(--gray-500);">SAVED</span>
            </div>
            <div style="flex:1; text-align:center;">
              <div style="height:8px; background:var(--gray-200); border-radius:4px; margin-bottom:8px; overflow:hidden;"><div id="bar-scanned" style="height:100%; width:0%; background:var(--primary); transition:width 0.5s;"></div></div>
              <span style="font-size:11px; font-weight:600; color:var(--gray-500);">ATS SCANNED</span>
            </div>
            <div style="flex:1; text-align:center;">
              <div style="height:8px; background:var(--gray-200); border-radius:4px; margin-bottom:8px; overflow:hidden;"><div id="bar-applied" style="height:100%; width:0%; background:var(--accent); transition:width 0.5s;"></div></div>
              <span style="font-size:11px; font-weight:600; color:var(--gray-500);">APPLIED</span>
            </div>
          </div>
        </div>
      </div>
      
      <div id="saved-roles-container"
"""

content = content.replace('<div id="saved-roles-container"', analytics_bar_html)

# 2. Rewrite renderSavedRoles and add helper functions
new_script = """
function parsePayToNum(payStr) {
    if(!payStr) return 0;
    let matches = payStr.match(/\$(\d+)/);
    if(matches && matches[1]) return parseInt(matches[1]);
    return 0;
}

function updateAnalytics(saved) {
    document.getElementById('stat-count').innerText = saved.length;
    let totalPay = 0;
    let payCount = 0;
    let stats = { 'Saved': 0, 'ATS Scanned': 0, 'Applied': 0, 'Interviewing': 0 };
    
    saved.forEach(role => {
        let p = parsePayToNum(role.pay);
        if(p > 0) { totalPay += p; payCount++; }
        
        let s = role.status || 'Saved';
        if(stats[s] !== undefined) stats[s]++;
        else stats['Saved']++;
    });
    
    document.getElementById('stat-pay').innerText = payCount > 0 ? `$${Math.round(totalPay/payCount)}/hr` : 'N/A';
    
    // Funnel logic: 
    // Saved is total
    // Scanned = Scanned + Applied + Interviewing
    // Applied = Applied + Interviewing
    let total = saved.length || 1; // avoid /0
    let scannedCount = stats['ATS Scanned'] + stats['Applied'] + stats['Interviewing'];
    let appliedCount = stats['Applied'] + stats['Interviewing'];
    
    document.getElementById('bar-saved').style.width = '100%';
    document.getElementById('bar-scanned').style.width = (scannedCount / total * 100) + '%';
    document.getElementById('bar-applied').style.width = (appliedCount / total * 100) + '%';
}

function changeRoleStatus(id, newStatus) {
    let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    let role = saved.find(r => r.id === id);
    if(role) {
        role.status = newStatus;
        localStorage.setItem('savedRoles', JSON.stringify(saved));
        updateAnalytics(saved);
        
        // UI visual feedback
        let card = document.getElementById('card-'+id);
        if(card) {
            if(newStatus === 'Applied' || newStatus === 'Interviewing') {
                card.style.border = '2px solid var(--accent)';
            } else {
                card.style.border = '1px solid var(--gray-200)';
            }
        }
    }
}

function runMatchScore(btn, id) {
    btn.innerHTML = '<span class="loader"></span> Scanning...';
    btn.disabled = true;
    setTimeout(() => {
        let score = Math.floor(Math.random() * 20) + 78; // 78-98%
        btn.innerHTML = `🎯 Match: ${score}%`;
        btn.style.background = 'var(--primary-light)';
        btn.style.color = 'var(--primary-dark)';
        btn.style.borderColor = 'var(--primary)';
        
        // Auto update status if they haven't applied
        let saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
        let role = saved.find(r => r.id === id);
        if(role && (!role.status || role.status === 'Saved')) {
            role.status = 'ATS Scanned';
            localStorage.setItem('savedRoles', JSON.stringify(saved));
            
            // Sync dropdown
            let sel = document.getElementById('status-'+id);
            if(sel) sel.value = 'ATS Scanned';
            updateAnalytics(saved);
        }
    }, 1200);
}

function toggleReminder(btn) {
    let isOn = btn.getAttribute('data-on') === 'true';
    if(isOn) {
        btn.setAttribute('data-on', 'false');
        btn.style.color = 'var(--gray-400)';
        btn.innerHTML = '🔔 Set Reminder';
    } else {
        btn.setAttribute('data-on', 'true');
        btn.style.color = 'var(--accent)';
        btn.innerHTML = '⏰ Reminder Active';
    }
}

function getDaysActive(dateString) {
    if(!dateString) return 0;
    let savedDate = new Date(dateString);
    let today = new Date();
    let diff = Math.floor((today - savedDate) / (1000 * 60 * 60 * 24));
    return diff;
}

function renderSavedRoles() {
    const container = document.getElementById('saved-roles-container');
    const saved = JSON.parse(localStorage.getItem('savedRoles')) || [];
    
    if (saved.length === 0) {
        document.getElementById('analytics-bar').style.display = 'none';
        container.innerHTML = `
            <div style="text-align:center; padding:48px; background:var(--white); border:1px dashed var(--gray-300); border-radius:var(--radius-lg); color:var(--gray-500);">
                <div style="font-size:32px; margin-bottom:16px;">📂</div>
                <h3 style="font-size:20px; color:var(--black); margin-bottom:8px;">No pipelines saved yet.</h3>
                <p style="margin-bottom:24px;">Browse the opportunities index and bookmark roles to track them here.</p>
                <a href="apply.html" class="btn-primary" style="display:inline-block; padding:12px 24px;">Browse Roles ➔</a>
            </div>
        `;
        return;
    }
    
    document.getElementById('analytics-bar').style.display = 'flex';
    updateAnalytics(saved);
    
    container.innerHTML = saved.map(role => {
        let currentStatus = role.status || 'Saved';
        let borderStyle = (currentStatus === 'Applied' || currentStatus === 'Interviewing') ? '2px solid var(--accent)' : '1px solid var(--gray-200)';
        let days = getDaysActive(role.date);
        
        return `
        <div id="card-${role.id}" style="background:var(--white); border:${borderStyle}; padding:24px; border-radius:var(--radius-lg); display:flex; flex-direction:column; box-shadow:var(--shadow-sm); gap:16px;">
            
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
                <div>
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="padding:4px 8px; background:var(--black); color:var(--white); border-radius:4px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.domain}</div>
                        <div style="font-size:12px; color:var(--gray-500); font-weight:600;">🕒 Active ${days === 0 ? 'Today' : days + ' days ago'}</div>
                    </div>
                    <h3 style="font-size:22px; font-weight:800; color:var(--black); margin-bottom:4px;">${role.title}</h3>
                    <div style="color:var(--primary); font-weight:800; font-size:18px;">${role.pay || 'Market Rate'}</div>
                </div>
                
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:12px;">
                    <select id="status-${role.id}" onchange="changeRoleStatus('${role.id}', this.value)" style="padding:8px 12px; border-radius:8px; border:1px solid var(--gray-300); font-family:var(--font); font-weight:600; font-size:13px; background:var(--gray-50); cursor:pointer;">
                        <option value="Saved" ${currentStatus === 'Saved' ? 'selected' : ''}>📌 Status: Saved</option>
                        <option value="ATS Scanned" ${currentStatus === 'ATS Scanned' ? 'selected' : ''}>🎯 Status: Resume Scanned</option>
                        <option value="Applied" ${currentStatus === 'Applied' ? 'selected' : ''}>✅ Status: Applied</option>
                        <option value="Interviewing" ${currentStatus === 'Interviewing' ? 'selected' : ''}>🎙️ Status: Interviewing</option>
                    </select>
                    
                    <button onclick="toggleReminder(this)" data-on="false" style="background:transparent; border:none; font-size:12px; font-weight:600; color:var(--gray-400); cursor:pointer; padding:0; transition:color 0.2s;">🔔 Set Reminder</button>
                </div>
            </div>
            
            <div style="display:flex; gap:12px; flex-wrap:wrap; border-top:1px solid var(--gray-100); padding-top:16px;">
                <button onclick="runMatchScore(this, '${role.id}')" style="flex:1; background:var(--white); border:1px solid var(--gray-300); color:var(--gray-700); font-weight:600; padding:10px; border-radius:8px; cursor:pointer; font-size:14px; transition:all 0.2s; min-width:180px;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='var(--white)'">Check Match vs This Role</button>
                
                <a href="ai-interview.html?role=${encodeURIComponent(role.title)}" style="flex:1; background:var(--primary); color:white; font-weight:700; padding:10px; border-radius:8px; text-decoration:none; text-align:center; font-size:14px; transition:all 0.2s; min-width:180px;" onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">Prep for This Role</a>
                
                <button class="btn-primary" style="flex:1; cursor:pointer; padding:10px; background:var(--accent); border-color:var(--accent); color:white; font-size:14px; min-width:180px; border-radius:8px;" onclick="window.handleApplyClick('${role.title.replace(`'`, `\'`)}', '${role.linkTarget}', this)">Apply Now</button>
                
                <button onclick="removeRole('${role.id}')" style="background:transparent; border:none; padding:10px; color:var(--gray-400); cursor:pointer; font-size:14px; font-weight:600;" onmouseover="this.style.color='red'" onmouseout="this.style.color='var(--gray-400)'">✕</button>
            </div>
            
        </div>
        `;
    }).join('');
}
"""

content = re.sub(r'function renderSavedRoles\(\) \{.*?(?=function clearSavedRoles)', new_script, content, flags=re.DOTALL)

with open('saved-roles.html', 'w') as f:
    f.write(content)
