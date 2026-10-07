with open('apply.html', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '>💾</button>' in line:
        line = line.replace('transition:all 0.2s;"', 'display:flex; align-items:center; justify-content:center; transition:all 0.2s;"').replace('>💾</button>', ' title="Save role to dashboard"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg></button>')
    elif '>✅</button>' in line:
        line = line.replace('transition:all 0.2s;"', 'display:flex; align-items:center; justify-content:center; transition:all 0.2s;"').replace('>✅</button>', ' title="Mark as Applied / Completed"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></button>')
    elif '>🎯</button>' in line:
        line = line.replace('transition:all 0.2s;"', 'display:flex; align-items:center; justify-content:center; transition:all 0.2s;"').replace('>🎯</button>', ' title="Scan my resume to see if it matches this job"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></button>')
    new_lines.append(line)

with open('apply.html', 'w') as f:
    f.writelines(new_lines)
print("Done")
