import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_block = """        try {
            // READ THE PDF LOCALLY USING PDF.JS!
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            let extractedText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                extractedText += pageText + "\\n";
            }
            
            // Set the REAL extracted text instead of John Doe
            resumeBox.value = extractedText;
            
        } catch (error) {"""

replace_block = """        try {
            const arrayBuffer = await file.arrayBuffer();
            let extractedText = "";
            
            if (file.name.toLowerCase().endsWith(".docx")) {
                const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                extractedText = result.value;
            } else {
                const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    extractedText += pageText + "\\n";
                }
            }
            
            // Set the REAL extracted text instead of John Doe
            resumeBox.value = extractedText;
            
        } catch (error) {"""

if find_block in html:
    html = html.replace(find_block, replace_block)
    print("SUCCESS")
else:
    print("NOT FOUND")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
