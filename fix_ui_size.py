import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_ui_start = '<!-- AWS Serverless Resume Processor -->'
old_ui_end = '<!-- Upload Progress / Success State -->'

# We'll just replace the whole block up to the status div
start_idx = content.find(old_ui_start)
end_idx = content.find(old_ui_end, start_idx)

new_ui = """<!-- AWS Serverless Resume Processor -->
    <div style="background: white; padding: 20px 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); text-align: left; margin-top: 32px; display: flex; flex-direction: column; gap: 12px;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="flex: 1; min-width: 250px;">
          <h3 style="font-size:18px; font-weight:800; margin-bottom:4px;">Fast-Track: AI Resume Analysis</h3>
          <p style="color:var(--gray-500); font-size:14px; margin: 0; line-height:1.5;">Securely upload your resume (PDF). Our serverless AWS pipeline will instantly match you to the highest paying active hiring waves.</p>
        </div>
        
        <div id="aws-upload-zone" style="background: var(--gray-100); border: 1.5px dashed var(--gray-300); border-radius: var(--radius); padding: 12px 24px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='var(--gray-100)';">
          <div style="font-size:24px; line-height: 1;">📄</div>
          <div style="text-align: left;">
            <div style="font-weight:700; color:var(--black); font-size: 14px;">Upload PDF Resume</div>
            <div style="font-size:11px; color:var(--gray-500);">Max size: 5MB (S3 Direct)</div>
          </div>
          <input type="file" id="aws-file-input" accept=".pdf" style="display:none;" />
        </div>
      </div>

      """

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_ui + content[end_idx:]
    with open('apply.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("UI Shrunk!")
else:
    print("Could not find bounds")
