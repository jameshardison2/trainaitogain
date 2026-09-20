import re

with open('marketer-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_html = """        <h3 style="margin-bottom: 16px; font-size: 16px; font-weight: 600;">Recent Candidate Activity</h3>
        <table class="data-table">"""

replace_html = """        <div style="display:flex; gap:24px; margin-bottom:16px;">
            <h3 style="margin:0; font-size: 16px; font-weight: 600; cursor:pointer; color:var(--primary); border-bottom:2px solid var(--primary); padding-bottom:8px;" id="tab-leads">Raw Leads Feed</h3>
            <h3 style="margin:0; font-size: 16px; font-weight: 600; cursor:pointer; color:#666; padding-bottom:8px;" id="tab-workers">Worker Leaderboard (Affiliates)</h3>
        </div>
        
        <div id="view-workers" style="display:none;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Worker ID (UTM / Ref)</th>
                        <th>Total Leads Generated</th>
                        <th>Est. Pipeline Value</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="workers-table-body">
                    <tr><td colspan="4" style="text-align: center; color: #666; padding: 48px;">Loading Worker Data...</td></tr>
                </tbody>
            </table>
        </div>

        <div id="view-leads">
            <table class="data-table">"""

if find_html in html:
    html = html.replace(find_html, replace_html)
else:
    print("Warning: Could not find table header")

find_table_close = """        </table>
    </div>"""

replace_table_close = """        </table>
        </div>
    </div>"""

if find_table_close in html:
    html = html.replace(find_table_close, replace_table_close)

find_js = """                querySnapshot.forEach((doc) => {"""

replace_js = """                const workers = {}; // To aggregate worker stats
                
                querySnapshot.forEach((doc) => {"""

if find_js in html:
    html = html.replace(find_js, replace_js)


find_js_loop = """                    let source = data.source || 'Direct';
                    if (data.referred_by) source += ` <br><span style="font-size:10px; color:#888;">Ref: ${data.referred_by}</span>`;"""

replace_js_loop = """                    let source = data.source || 'Direct';
                    let workerId = data.referred_by || 'Organic (No Affiliate)';
                    if (data.referred_by) source += ` <br><span style="font-size:10px; color:#888;">Ref: ${data.referred_by}</span>`;
                    
                    if (!workers[workerId]) workers[workerId] = 0;
                    workers[workerId]++;"""

if find_js_loop in html:
    html = html.replace(find_js_loop, replace_js_loop)

find_js_end = """                tbody.innerHTML = html;
                totalEl.innerText = count;"""

replace_js_end = """                tbody.innerHTML = html;
                
                // Render Worker Leaderboard
                const wBody = document.getElementById('workers-table-body');
                let wHtml = '';
                const sortedWorkers = Object.entries(workers).sort((a,b) => b[1] - a[1]);
                for (const [wId, wCount] of sortedWorkers) {
                    wHtml += `
                        <tr>
                            <td style="font-weight:700; color:var(--white);">${wId}</td>
                            <td style="font-weight:800; color:var(--primary);">${wCount} leads</td>
                            <td style="color:#3b82f6;">$${(wCount * 1000).toLocaleString()}</td>
                            <td><span class="status-badge status-complete">Active</span></td>
                        </tr>
                    `;
                }
                wBody.innerHTML = wHtml;
                
                totalEl.innerText = count;"""

if find_js_end in html:
    html = html.replace(find_js_end, replace_js_end)

# Add tab logic
tab_logic = """
        document.getElementById('tab-leads').addEventListener('click', (e) => {
            e.target.style.color = 'var(--primary)';
            e.target.style.borderBottom = '2px solid var(--primary)';
            document.getElementById('tab-workers').style.color = '#666';
            document.getElementById('tab-workers').style.borderBottom = 'none';
            document.getElementById('view-leads').style.display = 'block';
            document.getElementById('view-workers').style.display = 'none';
        });
        
        document.getElementById('tab-workers').addEventListener('click', (e) => {
            e.target.style.color = 'var(--primary)';
            e.target.style.borderBottom = '2px solid var(--primary)';
            document.getElementById('tab-leads').style.color = '#666';
            document.getElementById('tab-leads').style.borderBottom = 'none';
            document.getElementById('view-workers').style.display = 'block';
            document.getElementById('view-leads').style.display = 'none';
        });
"""

html = html.replace('// Auto load', tab_logic + '\n        // Auto load')

with open('marketer-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added Worker Leaderboard to Dashboard")
