import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_try = """        try {
            // READ THE PDF LOCALLY USING PDF.JS!
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            let extractedText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                extractedText += pageText + "\n";
            }
            
            // Set the REAL extracted text instead of John Doe
            resumeBox.value = extractedText;
            
        } catch (error) {"""

replace_try = """        try {
            const arrayBuffer = await file.arrayBuffer();
            let extractedText = "";
            
            if (file.name.toLowerCase().endsWith('.docx')) {
                const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                extractedText = result.value;
            } else {
                const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    extractedText += pageText + "\n";
                }
            }
            
            resumeBox.value = extractedText;
            
        } catch (error) {"""

if find_try in html:
    html = html.replace(find_try, replace_try)
    print("Injected docx extraction logic!")
else:
    print("Could not find try block!")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
