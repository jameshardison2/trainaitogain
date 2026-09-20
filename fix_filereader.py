import re

with open('apply.html', 'r', encoding='utf-8') as f:
    apply_html = f.read()

# Replace the modern file.arrayBuffer() with the universally supported FileReader
old_buffer_logic = "const arrayBuffer = await file.arrayBuffer();"
new_buffer_logic = """const arrayBuffer = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = e => resolve(e.target.result);
              reader.onerror = e => reject(new Error("File read failed"));
              reader.readAsArrayBuffer(file);
          });"""

apply_html = apply_html.replace(old_buffer_logic, new_buffer_logic)

# Revert the debug error message back to the graceful failsafe
apply_html = apply_html.replace(
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please take a screenshot of this red text and send it to your developer.</span>';""",
    """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Error analyzing format. Please scroll down and select a role manually to continue.</span>';"""
)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(apply_html)


# Do the same for resume-ats-guide.html
with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    ats_html = f.read()

ats_html = ats_html.replace(old_buffer_logic, new_buffer_logic)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(ats_html)

print("FileReader fix applied.")
