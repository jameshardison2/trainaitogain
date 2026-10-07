import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="flex: 1; min-width: 250px;">
          <h3 style="font-size:18px; font-weight:800; margin-bottom:4px;">Fast-Track: Match My Resume</h3>
          <p style="color:var(--gray-500); font-size:14px; margin: 0; line-height:1.5;">Upload your resume to instantly see which open roles match your expertise.</p>
        </div>
        
        <div id="aws-upload-zone" style="position: relative; background: var(--gray-100); border: 1.5px dashed var(--gray-300); border-radius: var(--radius); padding: 12px 24px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-100)';">
          <div style="font-size:24px; line-height: 1;">📄</div>
          <div style="text-align: left;">
            <div style="font-weight:700; color:var(--black); font-size: 14px;">Upload Resume</div>
            <div style="font-size:11px; color:var(--gray-500);">PDF or DOCX (Max: 5MB)</div>
          </div>
          <input type="file" id="aws-file-input" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; font-size: 0; cursor: pointer; z-index: 999;" title="Click to Upload" />
        </div>
      </div>"""

new_block = """      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="flex: 1; min-width: 250px;">
          <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">Not sure which role fits you best?</h3>
          <div style="color:var(--gray-700); font-size:15px; margin: 0; line-height:1.6; display:flex; flex-direction:column; gap:6px;">
            <div><strong style="color:var(--primary);">1.</strong> Drop your PDF resume here.</div>
            <div><strong style="color:var(--primary);">2.</strong> Our AI will securely scan your skills in seconds.</div>
            <div><strong style="color:var(--primary);">3.</strong> We will highlight the exact jobs below that you have the highest chance of winning!</div>
          </div>
        </div>
        
        <div id="aws-upload-zone" style="position: relative; background: var(--gray-100); border: 2px dashed var(--primary); border-radius: var(--radius); padding: 16px 32px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 16px;" onmouseover="this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.backgroundColor='var(--gray-100)';">
          <div style="font-size:32px; line-height: 1;">📄</div>
          <div style="text-align: left;">
            <div style="font-weight:800; color:var(--primary-dark); font-size: 16px;">Click here to upload</div>
            <div style="font-size:13px; color:var(--gray-600); font-weight:500;">PDF or DOCX format</div>
          </div>
          <input type="file" id="aws-file-input" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; font-size: 0; cursor: pointer; z-index: 999;" title="Click to Upload" />
        </div>
      </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('apply.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find old block")
