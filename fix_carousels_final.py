with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re
old_categories_pattern = r'const categories = \[\s*\{ id: \'carousel-software\'.*?\s*\];'
new_categories = """const categories = [
      { id: 'carousel-software', name: 'Software & Engineering Pipelines', icon: '💻', domain: 'SOFTWARE' },
      { id: 'carousel-medical', name: 'Medical & Clinical Pipelines', icon: '⚕️', domain: 'MEDICAL' },
      { id: 'carousel-finance', name: 'Finance & Quant Pipelines', icon: '📈', domain: 'FINANCE' },
      { id: 'carousel-legal', name: 'Legal & Compliance Pipelines', icon: '⚖️', domain: 'LEGAL' },
      { id: 'carousel-language', name: 'Translation & Voice Pipelines', icon: '🗣️', domain: 'LANGUAGE' },
      { id: 'carousel-sales', name: 'Sales & Growth Pipelines', icon: '🚀', domain: 'SALES' },
      { id: 'carousel-general', name: 'General & Domain Expert Pipelines', icon: '📋', domain: 'GENERAL' }
    ];"""

new_content = re.sub(old_categories_pattern, new_categories, content, flags=re.DOTALL)
if new_content == content:
    print("WARNING: Replacement failed!")
else:
    print("Replacement succeeded!")

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
