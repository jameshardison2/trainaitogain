import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Update CSS
css_patch = """
    textarea {
      width: 100%; padding: 12px; border: 1px solid var(--gray-300);
      border-radius: 8px; font-family: var(--font); font-size: 14px;
      min-height: 220px !important; line-height: 1.5; margin-bottom: 16px;
    }
    .drawer-actions-row {
      display: flex; gap: 10px; margin-top: 12px; margin-bottom: 24px;
    }
    .drawer-actions-row button {
      flex: 1; padding: 12px; font-weight: 600; border-radius: 8px; margin: 0 !important;
    }
"""
content = re.sub(r'textarea\s*\{.*?\}', css_patch, content, flags=re.DOTALL)

# 2. Update Drawer Action Buttons HTML
old_buttons = r"""<button class="btn btn-primary" style="width:100%; margin-bottom:8px; background:#0a66c2; color:white; border:none; box-shadow:0 4px 12px rgba\(10,102,194,0.3\);" onclick="copyAndMessage\(\)">🚀 Copy Pitch & Auto-Open LinkedIn</button>
<button class="btn btn-outline" style="width:100%; margin-bottom:8px; border-color:#047857; color:#047857;" onclick="loadFunnelTemplate\(\)">🔄 Load 3-Step Conversion Funnel</button>
<button class="btn btn-outline" style="width:100%; margin-bottom:24px;" onclick="copyMessage\(\)">Copy Only</button>"""

new_buttons = """<button class="btn btn-primary" style="width:100%; background:#0a66c2; color:white; border:none; box-shadow:0 4px 12px rgba(10,102,194,0.3); padding:12px; border-radius:8px; font-weight:700;" onclick="copyAndMessage()">🚀 Copy Pitch & Auto-Open LinkedIn</button>
<div class="drawer-actions-row">
  <button class="btn btn-outline" style="border-color:#047857; color:#047857;" onclick="loadFunnelTemplate()">🔄 3-Step Funnel</button>
  <button class="btn btn-outline" onclick="copyMessage()">Copy Only</button>
</div>"""
content = re.sub(old_buttons, new_buttons, content)


# 3. Streamlined Status Dropdown in Footer
old_footer = r"""<div class="drawer-footer" style="flex-direction:column; gap:12px;">.*?</div>\s*</div>\s*</div>\s*</div>"""

# Wait, the footer looks like this:
#     <div class="drawer-footer" style="flex-direction:column; gap:12px;">
#       <div style="display:flex; gap:8px; width:100%;">
#         <button class="btn btn-primary" onclick="updateStatus('Contacted')" style="flex:1;">Mark Contacted</button>
#         <button class="btn btn-outline" onclick="updateStatus('Replied')" style="flex:1;">Mark Replied</button>
#       </div>
#       <div style="display:flex; gap:8px; width:100%;">
#         <select id="micro1-status-selector" style="flex:1; padding:10px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; background:#f9fafb; font-weight:600;" onchange="if(this.value) updateStatus(this.value); this.value='';">
#            ...
#         </select>
#       </div>
#     </div>

# Let's replace the innerHTML of .drawer-footer
new_footer_inner = """
      <select id="corePipelineStatus" class="status-dropdown" onchange="if(this.value) updateStatus(this.value); this.value='';" style="width:100%; padding:14px; border-radius:8px; font-weight:700; background:var(--gray-100); font-size:14px; border:1px solid var(--gray-300); cursor:pointer;">
        <option value="">Update Pipeline Status...</option>
        <optgroup label="Core Pipeline">
          <option value="READY">Status: READY</option>
          <option value="Contacted">Status: Contacted</option>
          <option value="Replied">Status: Replied</option>
          <option value="Applying">Status: Applying / Interviewing</option>
          <option value="Hired">Status: Hired / Paid</option>
        </optgroup>
        <optgroup label="Micro1 Payout Milestones">
          <option value="MCC Met">MCC Met</option>
          <option value="Certified">Certified</option>
          <option value="Payment released">Payment Released</option>
        </optgroup>
      </select>
"""
content = re.sub(r'<div class="drawer-footer" style="flex-direction:column; gap:12px;">.*?</div>\s*</div>', '<div class="drawer-footer" style="flex-direction:column; gap:12px;">' + new_footer_inner + '\n    </div>', content, flags=re.DOTALL)


# 4. High-Conversion Outreach Template
new_template = r"""let msg = `Hi ${firstName},

I noticed your background in ${c.title || 'your field'} stands out for our current hiring wave. At TrainAIToGain, we’ve partnered directly with top AI labs (Mercor and Micro1) to fast-track qualified professionals past ATS gatekeepers.

Based on your profile, your expertise is an exact match for our active roles paying $70–$120/hr (remote and flexible). Here is how we get you placed this week:

1. Direct Role Match: View your matched active positions at https://trainaitogain.com/apply
2. ATS Resume Optimization: Scan your resume on our platform to secure a 98%+ match score.
3. Mock Interview Prep: Practice on our live AI mock interview tool (https://trainaitogain.com/ai-interview) to ace the screening video panel.

Let me know once your profile is submitted, and I'll move you to our priority queue.

Best regards,
James Hardison II
Founder, TrainAIToGain`;"""

content = re.sub(r'let msg = `Hey \$\{firstName\},.*?James`;', new_template, content, flags=re.DOTALL)


with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Updated CRM mobile styling and templates")
