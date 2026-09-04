import glob

html_files = glob.glob('*.html')

old_logic = """        var links = document.querySelectorAll('a[href^="https://t.mercor.com/wbPMF"]');
        links.forEach(function(link) {
          if (!link.href.includes('?ref=')) {
            link.href = "https://t.mercor.com/wbPMF?ref=" + encodeURIComponent(activeRef);
          }
        });"""

new_logic = """        var links = document.querySelectorAll('a[href^="https://t.mercor.com"]');
        links.forEach(function(link) {
          try {
            var url = new URL(link.href);
            url.searchParams.set('ref', activeRef);
            link.href = url.toString();
          } catch(e) {}
        });"""

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(file, 'w') as f:
            f.write(content)
        print(f"Fixed {file}")
