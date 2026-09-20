import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I need to change:
#      data.roles.forEach(role => {
#        let kws = new Set(role.tags || []);
#        if (kws.size < 6) {
#           kws.add("Evaluation");
#           kws.add("Accuracy");
#           kws.add("Quality");
#        }
#        keywordSets[role.title] = Array.from(kws);

js_find = """      data.roles.forEach(role => {
        let kws = new Set(role.tags || []);
        if (kws.size < 6) {
           kws.add("Evaluation");
           kws.add("Accuracy");
           kws.add("Quality");
        }
        keywordSets[role.title] = Array.from(kws);"""

js_replace = """      data.roles.forEach(role => {
        // Fallback to tags if atsKeywords isn't ready, otherwise use the rich AI keywords
        let kws = new Set(role.atsKeywords || role.tags || []);
        if (kws.size < 12) {
           kws.add("Evaluation");
           kws.add("Accuracy");
           kws.add("Quality");
           kws.add("Analysis");
           kws.add("Metrics");
           kws.add("Testing");
           kws.add("Review");
        }
        keywordSets[role.title] = Array.from(kws);"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated resume-ats-guide.html to use rich keywords.")
else:
    print("Could not find HTML block.")
