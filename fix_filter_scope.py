import re
with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_vars = """    const searchInput = document.getElementById('jobSearchInput') as HTMLInputElement;
    const domainFilter = document.getElementById('jobDomainFilter') as HTMLSelectElement;
    
    function filterJobs() {"""

new_vars = """    const searchInput = document.getElementById('jobSearchInput') as HTMLInputElement;
    const domainFilter = document.getElementById('jobDomainFilter') as HTMLSelectElement;
    const locationFilter = document.getElementById('jobLocationFilter') as HTMLSelectElement;
    const sortFilter = document.getElementById('jobSortFilter') as HTMLSelectElement;
    
    function filterJobs() {"""

content = content.replace(old_vars, new_vars)

old_events = """    const locationFilter = document.getElementById('jobLocationFilter') as HTMLSelectElement;
    const sortFilter = document.getElementById('jobSortFilter') as HTMLSelectElement;
    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (domainFilter) domainFilter.addEventListener('change', filterJobs);
    if (locationFilter) locationFilter.addEventListener('change', filterJobs);
    if (sortFilter) sortFilter.addEventListener('change', filterJobs);"""

new_events = """    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (domainFilter) domainFilter.addEventListener('change', filterJobs);
    if (locationFilter) locationFilter.addEventListener('change', filterJobs);
    if (sortFilter) sortFilter.addEventListener('change', filterJobs);"""

content = content.replace(old_events, new_events)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
