import glob
import os

html_files = glob.glob('*.html')
tracking_script = """
<script>
  // Global Affiliate Tracker
  (function() {
    var ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('affiliate_ref', ref);
    var activeRef = localStorage.getItem('affiliate_ref');
    if (activeRef) {
      document.addEventListener('DOMContentLoaded', function() {
        var links = document.querySelectorAll('a[href^="https://t.mercor.com"]');
        links.forEach(function(link) {
          try {
            var url = new URL(link.href);
            url.searchParams.set('ref', activeRef);
            link.href = url.toString();
          } catch(e) {}
        });
      });
    }
  })();
</script>
</body>
"""

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # 1. Patch openApplyModal logic
    old_logic = "var ref = params.get('ref');"
    new_logic = "var ref = params.get('ref') || localStorage.getItem('affiliate_ref');\n        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));"
    if old_logic in content:
        content = content.replace(old_logic, new_logic)
    
    # 2. Patch hardcoded links by injecting the global tracker before </body>
    if "Global Affiliate Tracker" not in content and '</body>' in content:
        content = content.replace('</body>', tracking_script)
    
    with open(file, 'w') as f:
        f.write(content)
    print(f"Patched {file}")
