import re

with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add event listeners for locationFilter and sortFilter
old_events = """    searchInput?.addEventListener('input', filterJobs);
    domainFilter?.addEventListener('change', filterJobs);"""

new_events = """    searchInput?.addEventListener('input', filterJobs);
    domainFilter?.addEventListener('change', filterJobs);
    const locationFilter = document.getElementById('jobLocationFilter') as HTMLSelectElement;
    const sortFilter = document.getElementById('jobSortFilter') as HTMLSelectElement;
    locationFilter?.addEventListener('change', filterJobs);
    sortFilter?.addEventListener('change', filterJobs);"""

content = content.replace(old_events, new_events)

# 2. Add appearance: none and custom chevron to dropdowns
def fix_dropdown(html):
    return html.replace('<select ', '<select style="appearance:none; -webkit-appearance:none; background-image:url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E\'); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; " ')

old_domain_select = '<select id="jobDomainFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">'
content = content.replace(old_domain_select, fix_dropdown(old_domain_select))

old_loc_select = '<select id="jobLocationFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">'
content = content.replace(old_loc_select, fix_dropdown(old_loc_select))

old_sort_select = '<select id="jobSortFilter" style="padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; background:white; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">'
content = content.replace(old_sort_select, fix_dropdown(old_sort_select))

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)

