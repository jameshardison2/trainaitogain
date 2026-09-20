import re

def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Wrap arrayBuffer in Uint8Array for Safari compatibility
    html = html.replace(
        'const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;',
        'const pdf = await pdfjsLib.getDocument({data: new Uint8Array(arrayBuffer)}).promise;'
    )

    # Output the exact error message to the user UI so we can debug it if it fails again
    html = html.replace(
        """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing resume. Please ensure it is a valid text PDF.</span>';""",
        """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing resume: ' + (error.message || error) + '</span>';"""
    )
    
    html = html.replace(
        """alert("Error parsing PDF. Please make sure it is a valid text-based PDF.");""",
        """alert("Error parsing PDF: " + (error.message || error));"""
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)

fix_file('apply.html')
fix_file('resume-ats-guide.html')

print("Safari Uint8Array fixes and error tracing applied.")
