import PyPDF2

pdf_path = "/Users/176693/.gemini/antigravity/brain/4452c3ac-6616-4c53-9892-0912e8734f41/.user_uploaded/media_1791406831654_ce71e87a.pdf"
with open(pdf_path, 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    for i in range(len(reader.pages)):
        text = reader.pages[i].extract_text()
        if "fix_copy_icons.py" in text:
            print(text)
