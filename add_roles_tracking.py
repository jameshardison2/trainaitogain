import re

# 1. Update resume-ats-guide.html
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_add_doc = """            await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started' // They are applying right now
            });"""

replace_add_doc = """            
            const targetRole = localStorage.getItem('atsRole') || 'Unspecified Role';
            
            await addDoc(collection(db, "leads"), {
              firstName: nameInput || 'Applicant',
              email: emailInput,
              timestamp: serverTimestamp(),
              source: window.location.href + ' (Apply Modal)',
              referred_by: refCode,
              status: 'Application Started', // They are applying right now
              target_role: targetRole
            });"""

if find_add_doc in html:
    html = html.replace(find_add_doc, replace_add_doc)
else:
    print("Warning: Could not find addDoc in resume-ats-guide.html")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update dashboard.html to show it
with open('dashboard.html', 'r', encoding='utf-8') as f:
    dashboard = f.read()

find_card = """      const statusHtml = `<span class="status-badge" style="background:${statusColor}20; color:${statusColor}; border:1px solid ${statusColor}40;">${lead.status}</span>`;"""

replace_card = """      const statusHtml = `<span class="status-badge" style="background:${statusColor}20; color:${statusColor}; border:1px solid ${statusColor}40;">${lead.status}</span>`;
      const roleBadge = lead.target_role ? `<div style="font-size:10px; font-weight:800; text-transform:uppercase; color:var(--primary); background:rgba(16,185,129,0.1); border-radius:4px; padding:4px 8px; margin-bottom:8px; display:inline-block;">${lead.target_role}</div>` : '';"""

if find_card in dashboard:
    dashboard = dashboard.replace(find_card, replace_card)
else:
    print("Warning: Could not find statusHtml in dashboard.html")


find_card_inner = """        <div class="lead-email">${lead.email}</div>
        <div style="font-size:11px; color:var(--gray-500); margin-top:8px;">${dateStr}</div>"""

replace_card_inner = """        ${roleBadge}
        <div class="lead-email">${lead.email}</div>
        <div style="font-size:11px; color:var(--gray-500); margin-top:8px;">${dateStr}</div>"""

if find_card_inner in dashboard:
    dashboard = dashboard.replace(find_card_inner, replace_card_inner)
else:
    print("Warning: Could not find card inner html in dashboard.html")

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dashboard)

print("Added Role Tracking to ATS and Dashboard")
