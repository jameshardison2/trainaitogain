import os

ga_script = """
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-7Z54KYTV6B"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-7Z54KYTV6B');
  </script>
"""

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r') as f:
        html = f.read()
        
    if 'G-7Z54KYTV6B' not in html:
        # Inject right before the closing </head> tag
        html = html.replace('</head>', f'{ga_script}</head>')
        
        with open(file, 'w') as f:
            f.write(html)
            
print("Successfully injected Google Analytics into all HTML files.")
