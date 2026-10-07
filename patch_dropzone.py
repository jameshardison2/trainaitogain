import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

fix_js = r"""      // Drag and Drop
      const fileInput = document.getElementById('file-input');
      const dropZone = document.getElementById('drop-zone');
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
            if (e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              parseFile(file);
            }
          });
      }

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          parseFile(file);
        }
      });
"""

# replace the old block
old_js = r"""      // Drag and Drop
      const dropZone = document.getElementById\('drop-zone'\);
      const fileInput = document.getElementById\('file-input'\);

      dropZone.addEventListener\('click', \(\) => fileInput.click\(\)\);
      
      dropZone.addEventListener\('dragover', \(e\) => \{
        e.preventDefault\(\);
        dropZone.classList.add\('dragover'\);
      \}\);
      dropZone.addEventListener\('dragleave', \(\) => dropZone.classList.remove\('dragover'\)\);
      
      dropZone.addEventListener\('drop', \(e\) => \{
        e.preventDefault\(\);
        dropZone.classList.remove\('dragover'\);
        if \(e.dataTransfer.files.length > 0\) \{
          const file = e.dataTransfer.files\[0\];
          parseFile\(file\);
        \}
      \}\);

      fileInput.addEventListener\('change', \(e\) => \{
        if \(e.target.files.length > 0\) \{
          const file = e.target.files\[0\];
          parseFile\(file\);
        \}
      \}\);"""
      
content = re.sub(old_js, fix_js, content, flags=re.DOTALL)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
