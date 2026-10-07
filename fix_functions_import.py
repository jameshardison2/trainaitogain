with open('functions/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'exports\.nukeAndRebuild = functions\.https\.onRequest', 'exports.nukeAndRebuild = onRequest', content)

with open('functions/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
