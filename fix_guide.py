with open('guide-download.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the "Save the PDF" instruction with "Read the Online Guide"
html = html.replace('Save the PDF', 'Read the Blueprint')
html = html.replace('Download the PDF to your phone or computer so you can easily reference it during the application process.', 'Open the interactive web guide on your phone or computer so you can easily reference it during the application process.')

# Replace references to the PDF being a cheat sheet
html = html.replace('This mobile-friendly PDF acts as your personal cheat sheet.', 'This interactive web guide acts as your personal cheat sheet.')
html = html.replace('Click the button above to download or view the PDF guide directly on your device.', 'Click the button above to unlock and read the Blueprint directly on your device.')

with open('guide-download.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Fixed guide-download.html copy.")
