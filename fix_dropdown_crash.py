import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to find where the JS crashed.
# Let's find:
#         // Ensure at least 6-8 keywords for ATS scanning
#         if (kws.size < 6) {
#            kws.add("Evaluation");
#            kws.add("Accuracy");
#            kws.add("Quality");
#         }
#         keywordSets[role.title] = Array.from(kws);
#         
#         // Generic placeholder
#         resumePlaceholders[role.title] = `John Doe\n${role.title}\n\nExperience\n- Evaluated AI outputs and enforced strict domain criteria...\n- Applied extensive background in ${role.tags ? role.tags.join(', ') : 'Evaluation'}...`;

# Wait, all of this is broken because role is not defined here (we deleted the forEach).
# Let's replace the whole block with a new pass over data.roles

buggy_code_start = html.find('// Ensure at least 6-8 keywords for ATS scanning')
if buggy_code_start != -1:
    buggy_code_end = html.find('resumePlaceholders[role.title] =', buggy_code_start)
    buggy_code_end = html.find(';', buggy_code_end) + 1
    
    # We will replace this orphaned block with a proper loop over data.roles
    fixed_code = """
      // Populate keywords and placeholders for ATS scanning
      data.roles.forEach(role => {
        let kws = new Set(role.tags || []);
        if (kws.size < 6) {
           kws.add("Evaluation");
           kws.add("Accuracy");
           kws.add("Quality");
        }
        keywordSets[role.title] = Array.from(kws);
        
        let tags_str = role.tags ? role.tags.join(', ') : 'Evaluation';
        resumePlaceholders[role.title] = `John Doe\\n${role.title}\\n\\nExperience\\n- Evaluated AI outputs and enforced strict domain criteria...\\n- Applied extensive background in ${tags_str}...`;
        
        // We also need jobDescriptions to be populated!
        jobDescriptions[role.title] = role.description || '';
      });
"""
    html = html[:buggy_code_start] + fixed_code + html[buggy_code_end:]

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed JS crash!")
