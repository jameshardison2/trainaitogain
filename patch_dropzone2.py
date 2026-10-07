import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

fix_js = r"""      // Drag and Drop
      const dropZone = document.getElementById('drop-zone');
      const fileInput = document.getElementById('file-input');

      if (dropZone) {
          dropZone.addEventListener('click', () => fileInput.click());
          dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
          });
          dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
          dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
              parseFile(e.dataTransfer.files[0]);
            }
          });
      }

      if (fileInput) {
          fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
              parseFile(e.target.files[0]);
            }
          });
      }"""

old_js = r"""      // Drag and Drop
      const dropZone = document.getElementById\('drop-zone'\);
      const fileInput = document.getElementById\('file-input'\);

      dropZone\.addEventListener\('click', \(\) => fileInput\.click\(\)\);
      
      dropZone\.addEventListener\('dragover', \(e\) => \{
        e\.preventDefault\(\);
        dropZone\.classList\.add\('dragover'\);
      \}\);
      dropZone\.addEventListener\('dragleave', \(\) => dropZone\.classList\.remove\('dragover'\)\);
      
      dropZone\.addEventListener\('drop', \(e\) => \{
        e\.preventDefault\(\);
        dropZone\.classList\.remove\('dragover'\);
        if \(e\.dataTransfer\.files\.length\) \{
          parseFile\(e\.dataTransfer\.files\[0\]\);
        \}
      \}\);

      fileInput\.addEventListener\('change', \(e\) => \{
        if \(e\.target\.files\.length\) \{
          parseFile\(e\.target\.files\[0\]\);
        \}
      \}\);"""
      
content = re.sub(old_js, fix_js, content, flags=re.DOTALL)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
