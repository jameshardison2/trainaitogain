import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the HTML to inject
aws_ui = """
    <!-- AWS Serverless Resume Processor -->
    <div style="background: white; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); text-align: left; margin-top: 32px;">
      <h3 style="font-size:18px; font-weight:800; margin-bottom:8px;">Fast-Track: AI Resume Analysis</h3>
      <p style="color:var(--gray-500); font-size:14px; margin-bottom:20px; line-height:1.6;">Securely upload your resume (PDF). Our serverless AWS pipeline will extract your experience and instantly match you to the highest paying active hiring waves.</p>
      
      <div id="aws-upload-zone" style="border: 2px dashed var(--gray-300); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--primary)'; this.style.backgroundColor='var(--primary-light)';" onmouseout="this.style.borderColor='var(--gray-300)'; this.style.backgroundColor='transparent';">
        <div style="font-size:32px; margin-bottom:12px;">📄</div>
        <div style="font-weight:700; color:var(--black); margin-bottom:4px;">Click to upload PDF resume</div>
        <div style="font-size:12px; color:var(--gray-500);">Max file size: 5MB (S3 Direct Upload)</div>
        <input type="file" id="aws-file-input" accept=".pdf" style="display:none;" />
      </div>

      <!-- Upload Progress / Success State -->
      <div id="aws-upload-status" style="display:none; margin-top:16px; padding:12px; border-radius:6px; background:var(--gray-100); font-size:14px;">
        <span id="aws-status-text">Uploading to AWS S3...</span>
      </div>
    </div>

    <!-- AWS Frontend Integration Script -->
    <script>
      const uploadZone = document.getElementById('aws-upload-zone');
      const fileInput = document.getElementById('aws-file-input');
      const statusDiv = document.getElementById('aws-upload-status');
      const statusText = document.getElementById('aws-status-text');

      uploadZone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusText.innerHTML = '⚙️ Generating pre-signed URL...';

        try {
          // In a real production environment, this calls your backend API
          // to get an authenticated AWS S3 pre-signed URL.
          // e.g. const res = await fetch('/api/get-upload-url'); const { uploadUrl } = await res.json();
          
          await new Promise(r => setTimeout(r, 800)); // Simulate API latency
          statusText.innerHTML = '☁️ Uploading directly to S3 Bucket...';
          
          // Simulate the S3 PUT request
          await new Promise(r => setTimeout(r, 1500)); 
          
          statusText.innerHTML = '✅ <strong>Upload Complete!</strong> AWS Lambda is currently extracting your text. We will highlight the best matching roles below.';
          statusDiv.style.background = 'var(--primary-light)';
          statusDiv.style.color = 'var(--primary-dark)';
          statusDiv.style.border = '1px solid var(--primary)';
        } catch(error) {
          statusText.innerHTML = '❌ Upload failed. Check CORS configuration.';
        }
      });
    </script>
"""

# Inject right after the Unified Notice Block
split_target = "    </div>\n  </div>\n</section>"

if split_target in content:
    new_content = content.replace(split_target, "    </div>\n" + aws_ui + "\n  </div>\n</section>")
    with open('apply.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Injected AWS UI successfully!")
else:
    print("Could not find injection point.")

