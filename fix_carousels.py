with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_categories = """    const categories = [
      { domain: 'SOFTWARE', title: 'Software & Tech Pipelines', emoji: '💻' },
      { domain: 'MEDICAL', title: 'Medical & Clinical Pipelines', emoji: '🩺' },
      { domain: 'FINANCE', title: 'Finance & Quant Pipelines', emoji: '📈' },
      { domain: 'LEGAL', title: 'Translation & Law Pipelines', emoji: '⚖️' },
      { domain: 'GENERAL', title: 'General & Domain Expert Pipelines', emoji: '🧠' }
    ];"""

new_categories = """    const categories = [
      { domain: 'SOFTWARE', title: 'Software & Engineering Pipelines', emoji: '💻' },
      { domain: 'MEDICAL', title: 'Medical & Clinical Pipelines', emoji: '🩺' },
      { domain: 'FINANCE', title: 'Finance & Quant Pipelines', emoji: '📈' },
      { domain: 'LEGAL', title: 'Legal & Compliance Pipelines', emoji: '⚖️' },
      { domain: 'LANGUAGE', title: 'Translation & Voice Pipelines', emoji: '🗣️' },
      { domain: 'SALES', title: 'Sales & Growth Pipelines', emoji: '🚀' },
      { domain: 'GENERAL', title: 'General & Domain Expert Pipelines', emoji: '🧠' }
    ];"""

content = content.replace(old_categories, new_categories)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
