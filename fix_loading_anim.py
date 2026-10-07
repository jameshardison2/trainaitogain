import re
with open('apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# On start, reset animation
start_old = """        uploadZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusText.innerHTML = '📄 Securely reading your resume...';"""

start_new = """        uploadZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusDiv.style.animation = 'pulse-bg 2s infinite';
        statusDiv.style.borderColor = 'var(--primary)';
        statusDiv.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; gap:16px;">
          <div class="loading-spinner"></div>
          <span id="aws-status-text">📄 Securely reading your resume...</span>
        </div>`;
        const statusText = document.getElementById('aws-status-text');"""

content = content.replace(start_old, start_new)

# On success, clear animation
success_old = """statusDiv.innerHTML = '<span style="color:var(--primary); font-weight:700;">✅ AI Analysis Complete! Found your best matches.</span>';"""
success_new = """statusDiv.style.animation = 'none';
          statusDiv.innerHTML = '<span style="color:var(--primary); font-weight:700;">✅ AI Analysis Complete! Found your best matches.</span>';"""
content = content.replace(success_old, success_new)

# On error, clear animation
err_old = """statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please screenshot this exact text and send it to your developer.</span>';"""
err_new = """statusDiv.style.animation = 'none';
          statusDiv.style.borderColor = '#ef4444';
          statusDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">❌ Technical Error: ' + (error.message || JSON.stringify(error) || error) + '<br>Please screenshot this exact text and send it to your developer.</span>';"""
content = content.replace(err_old, err_new)

with open('apply.html', 'w', encoding='utf-8') as f:
    f.write(content)
