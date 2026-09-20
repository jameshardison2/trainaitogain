import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inject mammoth.js
find_pdfjs = """<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>"""
replace_pdfjs = """<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>"""

if find_pdfjs in html:
    html = html.replace(find_pdfjs, replace_pdfjs)

# 2. Update accept on the input file
html = html.replace('accept=".pdf"', 'accept=".pdf,.docx"')
html = html.replace('Upload PDF Instead', 'Upload PDF or DOCX')
html = html.replace('Upload PDF Resume', 'Upload PDF or DOCX Resume')
html = html.replace('Click to Upload PDF or DOCX Resume', 'Click to Upload PDF or DOCX') # if needed

# 3. Modify the file extraction logic
find_try_block = """        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
          let extractedText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map(item => item.str).join(' ') + '\\n';
          }"""

replace_try_block = """        try {
          const arrayBuffer = await file.arrayBuffer();
          let extractedText = '';
          
          if (file.name.toLowerCase().endsWith('.docx')) {
              const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
              extractedText = result.value;
          } else {
              const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                extractedText += textContent.items.map(item => item.str).join(' ') + '\\n';
              }
          }"""

if find_try_block in html:
    html = html.replace(find_try_block, replace_try_block)
    print("Injected docx extraction logic!")
else:
    print("Could not find try block for file extraction!")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
