import re

with open('resume-ats-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

find_input = """        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
        <input type="file" id="ats-file-input" accept=".pdf,.docx" style="display:none;" />
      </div>"""

replace_input = """        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to Upload PDF or DOCX</div>
      </div>
      <input type="file" id="ats-file-input" accept=".pdf,.docx" style="display:none;" />"""

html = html.replace(find_input, replace_input)

with open('resume-ats-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
