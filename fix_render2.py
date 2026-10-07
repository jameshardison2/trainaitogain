with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_tags = r"let tagsHtml = role\.tags\.map\(t => `<span style=\"background:var\(--gray-200\); color:var\(--gray-700\); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;\">\$\{t\}</span>`\)\.join\(''\);"

new_tags = """let platformBadge = '';
        if (role.platform === 'Micro1') {
            platformBadge = `<span style="background:#e0e7ff; color:#4338ca; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:800; border:1px solid #c7d2fe;">MICRO1</span>`;
        } else {
            platformBadge = `<span style="background:#eef2ff; color:#3730a3; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:800; border:1px solid #c7d2fe;">MERCOR</span>`;
        }
        let tagsHtml = platformBadge + (role.tags || []).map((t: any) => `<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">${t}</span>`).join('');"""

content = re.sub(old_tags, new_tags, content)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
