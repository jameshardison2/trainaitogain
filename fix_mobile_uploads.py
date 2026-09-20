import re

# 1. FIX APPLY.HTML
with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Inject Mammoth script
if 'mammoth' not in apply_html:
    apply_html = apply_html.replace(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>'
    )

# Fix the CSS for the file input and upload zone
apply_html = apply_html.replace(
    'id="aws-upload-zone" style="background: var(--gray-100); border: 1.5px dashed var(--gray-300); border-radius: var(--radius); padding: 12px 24px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;"',
    'id="aws-upload-zone" style="position: relative; background: var(--gray-100); border: 1.5px dashed var(--gray-300); border-radius: var(--radius); padding: 12px 24px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;"'
)

apply_html = apply_html.replace(
    '<input type="file" id="aws-file-input" accept=".pdf" style="display:none;" />',
    '<input type="file" id="aws-file-input" accept=".pdf,.docx" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;" />'
)

# Remove the JS click listener since the input is now directly clickable
apply_html = apply_html.replace("uploadZone.addEventListener('click', () => fileInput.click());", "// uploadZone click removed for mobile")

# Update JS to handle mammoth parsing
old_parse = """          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
          let resumeText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              resumeText += textContent.items.map(item => item.str).join(" ") + "\\n";
          }"""

new_parse = """          const arrayBuffer = await file.arrayBuffer();
          let resumeText = "";
          if (file.name.toLowerCase().endsWith('.docx')) {
              const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
              resumeText = result.value;
          } else {
              const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
              for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  resumeText += textContent.items.map(item => item.str).join(" ") + "\\n";
              }
          }"""

apply_html = apply_html.replace(old_parse, new_parse)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)


# 2. FIX RESUME-ATS-GUIDE.HTML
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    ats_html = f.read()

# Add position relative to the zone
ats_html = ats_html.replace(
    'id="ats-upload-zone" style="background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;"',
    'id="ats-upload-zone" style="position: relative; background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 24px;"'
)

# Move the input inside the zone and style it
ats_html = ats_html.replace(
    '</div>\n      <input type="file" id="ats-file-input" accept=".pdf,.docx" style="display:none;" />',
    '<input type="file" id="ats-file-input" accept=".pdf,.docx" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;" />\n      </div>'
)

# Remove programmatic click
ats_html = ats_html.replace("uploadZone.addEventListener('click', () => fileInput.click());", "// Programmatic click removed")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(ats_html)

print("Mobile upload fixes applied.")
