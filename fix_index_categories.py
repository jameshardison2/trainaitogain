with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_logic = r"""            const domainStr = \(job\.title \+ ' ' \+ \(job\.description\|\|''\)\)\.toLowerCase\(\);\n            let finalDomain = 'SOFTWARE';\n            if \(domainStr\.includes\('medical'\) \|\| domainStr\.includes\('doctor'\) \|\| domainStr\.includes\('clinical'\) \|\| domainStr\.includes\('nurse'\)\) finalDomain = 'MEDICAL';\n            else if \(domainStr\.includes\('financ'\) \|\| domainStr\.includes\('account'\) \|\| domainStr\.includes\('tax'\) \|\| domainStr\.includes\('quant'\)\) finalDomain = 'FINANCE';\n            else if \(domainStr\.includes\('law'\) \|\| domainStr\.includes\('legal'\) \|\| domainStr\.includes\('attorney'\)\) finalDomain = 'LEGAL';"""

new_logic = """            const domainStr = (job.title + ' ' + (job.description||'')).toLowerCase();
            let finalDomain = 'GENERAL';
            if (domainStr.includes('software') || domainStr.includes('engineer') || domainStr.includes('developer') || domainStr.includes('data') || domainStr.includes('cybersecurity') || domainStr.includes('react') || domainStr.includes('python') || domainStr.includes('cloud') || domainStr.includes('aws') || domainStr.includes('mcp')) {
                finalDomain = 'SOFTWARE';
            } else if (domainStr.includes('medical') || domainStr.includes('physician') || domainStr.includes('clinician') || domainStr.includes('epidemiologist') || domainStr.includes('health') || domainStr.includes('pharma') || domainStr.includes('psychiatrist') || domainStr.includes('dermatologist') || domainStr.includes('disease') || domainStr.includes('nurse')) {
                finalDomain = 'MEDICAL';
            } else if (domainStr.includes('legal') || domainStr.includes('lawyer') || domainStr.includes('counsel') || domainStr.includes('attorney') || domainStr.includes('defender')) {
                finalDomain = 'LEGAL';
            } else if (domainStr.includes('finance') || domainStr.includes('financial') || domainStr.includes('equity') || domainStr.includes('investment') || domainStr.includes('revenue') || domainStr.includes('tax') || domainStr.includes('quant') || domainStr.includes('account')) {
                finalDomain = 'FINANCE';
            } else if (domainStr.includes('sales') || domainStr.includes('marketing') || domainStr.includes('growth') || domainStr.includes('b2b')) {
                finalDomain = 'SALES';
            } else if (domainStr.includes('language') || domainStr.includes('transcription') || domainStr.includes('voice') || domainStr.includes('audiobook') || domainStr.includes('spanish') || domainStr.includes('french') || domainStr.includes('german') || domainStr.includes('english') || domainStr.includes('marathi') || domainStr.includes('tamil') || domainStr.includes('kannada') || domainStr.includes('swedish') || domainStr.includes('italian') || domainStr.includes('urdu') || domainStr.includes('norwegian')) {
                finalDomain = 'LANGUAGE';
            }"""

content = re.sub(old_logic, new_logic, content)

with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
