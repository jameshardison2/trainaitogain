import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Modify the fileInput change handler to ACTUALLY read the PDF
js_find = """      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const selectedRole = roleSelect.value;
        if (!selectedRole || selectedRole === "") {
          alert("Please select a Target Role first so we know what to scan for!");
          fileInput.value = '';
          return;
        }

        uploadZone.innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Extracting text...</div>';
        uploadZone.style.pointerEvents = 'none';

        // Simulate extraction delay
        setTimeout(() => {"""

js_replace = """      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const selectedRole = roleSelect.value;
        if (!selectedRole || selectedRole === "") {
          alert("Please select a Target Role first so we know what to scan for!");
          fileInput.value = '';
          return;
        }

        uploadZone.innerHTML = '<div style="font-size:24px; margin-bottom:12px;">⚙️</div><div style="font-weight:700; color:var(--black);">Extracting text locally...</div>';
        uploadZone.style.pointerEvents = 'none';

        try {
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
            
        } catch (error) {
            console.error("PDF Parsing Error:", error);
            alert("Error parsing PDF. Please make sure it is a valid text-based PDF.");
            uploadZone.innerHTML = '<div style="margin-bottom:12px; display:flex; justify-content:center;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg></div><div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF Resume</div>';
            uploadZone.style.pointerEvents = 'auto';
            return;
        }

        // Delay slightly for UI smoothness
        setTimeout(() => {"""

if js_find in html:
    html = html.replace(js_find, js_replace)
    print("Injected PDF parser logic!")
else:
    print("Could not find fileInput handler.")

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
