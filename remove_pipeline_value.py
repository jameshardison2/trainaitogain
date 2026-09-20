import re

with open('worker-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_kpi = """            <div class="kpi-card">
                <div class="kpi-label">Total Pipeline Value</div>
                <div class="kpi-value" style="color: #3b82f6;" id="kpi-value">$-</div>
            </div>"""

if find_kpi in html:
    html = html.replace(find_kpi, "")
else:
    print("Warning: Could not find KPI card in worker-dashboard.html")
    
find_js = """                document.getElementById('kpi-leads').innerText = count;
                document.getElementById('kpi-value').innerText = '$' + (count * 1000).toLocaleString();"""

replace_js = """                document.getElementById('kpi-leads').innerText = count;"""

if find_js in html:
    html = html.replace(find_js, replace_js)

with open('worker-dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed Pipeline Value from employee dashboard")
