import re

with open('resume-ats-guide.html', 'r') as f:
    content = f.read()

old_trigger = """                    // Automatically select the very best match (the first one)
                    if (matches && matches.length > 0) {
                        if(typeof gtag === 'function') gtag('event', 'auto_matched_role', {'event_category': 'funnel', 'event_label': matches[0].role, 'value': parseInt(matches[0].match)});
                        const bestMatch = matches[0];
                        hiddenSelect.value = bestMatch.role;
                        customDisplay.innerText = `${bestMatch.role} (${bestMatch.match} AI Fit)`;"""

new_trigger = """                    // Automatically select the very best match (the first one)
                    if (matches && matches.length > 0) {
                        if(typeof gtag === 'function') gtag('event', 'auto_matched_role', {'event_category': 'funnel', 'event_label': matches[0].role, 'value': parseInt(matches[0].match)});
                        const bestMatch = matches[0];
                        const finalRole = getValidRole(bestMatch.role) || bestMatch.role;
                        hiddenSelect.value = finalRole;
                        customDisplay.innerText = `${finalRole} (${bestMatch.match} AI Fit)`;"""

content = content.replace(old_trigger, new_trigger)

with open('resume-ats-guide.html', 'w') as f:
    f.write(content)
print("second patch applied")
