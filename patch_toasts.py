import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Inject showToast function
toast_func = """
    function showToast(msg, type='success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:999999; display:flex; flex-direction:column; gap:12px;';
            document.body.appendChild(container);
        }
        let toast = document.createElement('div');
        let bgColor = type === 'error' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : '#10b981');
        toast.style.cssText = `background:${bgColor}; color:white; padding:16px 24px; border-radius:8px; font-size:14px; font-weight:600; box-shadow:0 10px 25px rgba(0,0,0,0.2); transform:translateY(100px); opacity:0; transition:all 0.3s cubic-bezier(0.16,1,0.3,1); max-width:400px; display:flex; align-items:flex-start; gap:12px; line-height:1.5;`;
        
        let icon = type === 'error' ? '⚠️' : (type === 'warning' ? '⏳' : '✅');
        toast.innerHTML = `<span style="font-size:18px; flex-shrink:0;">${icon}</span> <span>${msg.replace(/\\n/g, '<br>')}</span>`;
        
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
"""

# Insert before function switchTab
if "function showToast" not in content:
    content = content.replace("function switchTab(tab)", toast_func + "\n    function switchTab(tab)")

# 2. Replace alerts in CSV logic
old_msg_alert = 'alert("Please upload your Connections.csv FIRST to build the CRM queue, then upload Messages.csv to attach message history to those contacts!");'
new_msg_alert = 'showToast("Please upload your Contacts (Apollo/LinkedIn) FIRST to build the queue before uploading Messages.", "warning");'
content = content.replace(old_msg_alert, new_msg_alert)

old_success_alert = 'alert("Successfully attached " + matchedCount + " past messages to your CRM contacts!");'
new_success_alert = 'showToast("Successfully attached " + matchedCount + " past messages to your CRM contacts!", "success");'
content = content.replace(old_success_alert, new_success_alert)

old_error_alert = 'alert("Error: Missing required columns: " + missing.join(", ") + "\\n\\nTip: You can upload a raw Apollo.io export and it will auto-format it!");'
new_error_alert = 'showToast("Unrecognized CSV Format.<br><br>Please upload a standard LinkedIn Connections export, an Apollo.io export, or a Messages.csv file. The system will auto-format it.", "error");'
content = content.replace(old_error_alert, new_error_alert)

# 3. Replace alerts in AI generator
content = content.replace('alert("Please paste text or an image of the candidate\'s LinkedIn profile first!");', 'showToast("Please paste text or an image of the candidate\'s LinkedIn profile first!", "warning");')
content = content.replace('alert("AI Generation failed: " + err.message);', 'showToast("AI Generation failed: " + err.message, "error");')

with open('outreach-tool.html', 'w') as f:
    f.write(content)

print("Applied toast patches")
