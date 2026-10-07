with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = content.replace("const jobsSnap = await db.collection('jobs').get();", "const db = admin.firestore();\n        const jobsSnap = await db.collection('jobs').get();")

with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
