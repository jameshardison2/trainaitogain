with open('guide-download.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Revert the "Read the Blueprint" back to "Download PDF Guide"
html = html.replace('Read the Blueprint', 'Download PDF Guide')
html = html.replace('Open the interactive web guide on your phone or computer so you can easily reference it during the application process.', 'Download the PDF to your phone or computer so you can easily reference it during the application process.')
html = html.replace('This interactive web guide acts as your personal cheat sheet.', 'This mobile-friendly PDF acts as your personal cheat sheet.')
html = html.replace('Click the button above to unlock and read the Blueprint directly on your device.', 'Click the button above to download or view the PDF guide directly on your device.')
html = html.replace('href="blueprint-guide.html"', 'href="/trainaitogain-hiring-blueprint.pdf"')
html = html.replace('Read The Blueprint', 'Download PDF Guide')

with open('guide-download.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Reverted guide-download.html back to PDF download.")
