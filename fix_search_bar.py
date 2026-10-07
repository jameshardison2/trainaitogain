with open('render_waves.ts', 'r', encoding='utf-8') as f:
    content = f.read()

search_bar_html = """
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
      </div>
"""

# Insert it before the loop of categories
content = content.replace("categories.forEach(cat => {", search_bar_html + "\n    categories.forEach(cat => {")

# Also, update the filter logic so it doesn't fail if domainFilter is missing
filter_logic_old = """    function filterJobs() {
      const term = searchInput.value.toLowerCase();
      const domain = domainFilter.value;"""
filter_logic_new = """    function filterJobs() {
      const term = searchInput ? searchInput.value.toLowerCase() : '';
      const domain = domainFilter ? domainFilter.value : 'ALL';"""
content = content.replace(filter_logic_old, filter_logic_new)

with open('render_waves.ts', 'w', encoding='utf-8') as f:
    f.write(content)
