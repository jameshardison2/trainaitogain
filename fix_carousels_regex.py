with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re
old_categories_pattern = r'const categories = \[\s*\{ domain: \'SOFTWARE\'.*?\s*\];'
new_categories = """const categories = [
      { domain: 'SOFTWARE', title: 'Software & Engineering Pipelines', emoji: '💻' },
      { domain: 'MEDICAL', title: 'Medical & Clinical Pipelines', emoji: '🩺' },
      { domain: 'FINANCE', title: 'Finance & Quant Pipelines', emoji: '📈' },
      { domain: 'LEGAL', title: 'Legal & Compliance Pipelines', emoji: '⚖️' },
      { domain: 'LANGUAGE', title: 'Translation & Voice Pipelines', emoji: '🗣️' },
      { domain: 'SALES', title: 'Sales & Growth Pipelines', emoji: '🚀' },
      { domain: 'GENERAL', title: 'General & Domain Expert Pipelines', emoji: '🧠' }
    ];"""

new_content = re.sub(old_categories_pattern, new_categories, content, flags=re.DOTALL)
if new_content == content:
    print("WARNING: Replacement failed!")
else:
    print("Replacement succeeded!")

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
