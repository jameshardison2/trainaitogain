with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

style_block = """
<style>
  .hero-h1 { font-size: 56px; line-height: 1.1; }
  @media (max-width: 600px) {
    .hero-h1 { font-size: 40px !important; }
    .hero-btn-container { flex-direction: column; width: 100%; }
    .hero-btn-container a { width: 100%; text-align: center; justify-content: center; }
  }
</style>
</head>"""

html = html.replace('</head>', style_block)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Injected CSS")
