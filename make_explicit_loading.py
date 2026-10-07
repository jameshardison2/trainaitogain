import re

with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_status = """      <!-- Upload Progress / Success State -->
      <div id="aws-upload-status" style="display:none; margin-top:16px; padding:12px; border-radius:6px; background:var(--gray-100); font-size:14px;">
        <span id="aws-status-text">Analyzing document...</span>
      </div>"""

new_status = """      <!-- Upload Progress / Success State -->
      <style>
        @keyframes pulse-bg { 0% { background-color: var(--primary-light); box-shadow: 0 0 0 rgba(16,185,129,0); } 50% { background-color: #d1fae5; box-shadow: 0 0 15px rgba(16,185,129,0.3); } 100% { background-color: var(--primary-light); box-shadow: 0 0 0 rgba(16,185,129,0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner { border: 3px solid rgba(16, 185, 129, 0.2); border-top: 3px solid var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
      </style>
      <div id="aws-upload-status" style="display:none; margin-top:16px; padding:20px; border-radius:12px; border:2px solid var(--primary); animation: pulse-bg 2s infinite; font-size:16px; font-weight:800; color:var(--primary-dark); text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; gap:16px;">
          <div class="loading-spinner"></div>
          <span id="aws-status-text">Analyzing document...</span>
        </div>
      </div>"""

content = content.replace(old_status, new_status)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
