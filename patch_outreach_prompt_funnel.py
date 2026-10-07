import re

with open('outreach-tool.html', 'r') as f:
    content = f.read()

# 1. Add the loadFunnelTemplate function
funnel_func = """
    function loadFunnelTemplate() {
      const c = contacts.find(x => x._id === currentContactGlobalIndex);
      const firstName = c ? c.name.split(' ')[0] : 'there';
      const affiliateRef = localStorage.getItem('affiliate_ref') || '';
      const applyUrl = `https://trainaitogain.com/apply${affiliateRef ? '?ref='+affiliateRef : ''}`;
      
      const msg = `Hi ${firstName},

Thanks for getting back to me! Based on your background, I highly recommend locking in your profile this week. 

To bypass the general waitlist and fast-track your verification, just complete this 3-step loop:

1. Direct Match Hook: See your top 3 matching roles on our live board here: ${applyUrl}
2. ATS Scan First: Upload your resume on the platform to guarantee a 98%+ match score before hitting apply.
3. Mock Interview Prep: Run a quick 2-minute practice session on our live simulator (https://trainaitogain.com/ai-interview) so you're ready for the automated screening bots.

Let me know once your profile is submitted and I'll keep an eye out for it!

Best,
James`;
      
      document.getElementById('drawer-message').value = msg;
      const tb = document.getElementById('drawer-message');
      tb.style.transition = 'background 0.3s';
      tb.style.background = '#dcfce7';
      setTimeout(() => tb.style.background = 'white', 600);
    }
"""
content = content.replace('function copyAndMessage() {', funnel_func + '\n    function copyAndMessage() {')

# 2. Add the button in the HTML drawer
new_button = """<button class="btn btn-outline" style="width:100%; margin-bottom:8px; border-color:#047857; color:#047857;" onclick="loadFunnelTemplate()">🔄 Load 3-Step Conversion Funnel</button>
<button class="btn btn-outline" style="width:100%; margin-bottom:24px;" onclick="copyMessage()">Copy Only</button>"""
content = content.replace('<button class="btn btn-outline" style="width:100%; margin-bottom:24px;" onclick="copyMessage()">Copy Only</button>', new_button)

# 3. Update the generateDeepAIPitch instructions
old_instructions = r"""INSTRUCTIONS:
1. Analyze the candidate's profile to figure out exactly what domain they are in and select the 4 absolute best matching active roles.
2. Calculate a realistic "ATS Match Percentage" (e.g., 94%, 98%) for each of those 4 roles based on their exact experience.
3. Write the outreach message EXACTLY matching the format below. Do not include markdown code blocks (like ```html) or subject lines. Just the raw text."""

new_instructions = r"""INSTRUCTIONS:
1. Identify their industry domain. 
   - If Medical (Doctor, Nurse, Healthcare, Bio, Pharma): Highlight medical device validation, FDA regulatory frameworks, and flexible $95-$120/hr side-hustle rates in the intro.
   - If Tech & Engineering (Software, Data, AI, Dev, IT): Emphasize automated ATS resume bypassing and direct placement into active AI training waves on Mercor and Micro1 in the intro.
2. Select the 4 absolute best matching active roles for their domain.
3. Calculate a realistic "ATS Match Percentage" (e.g., 94%, 98%) for each of those 4 roles.
4. Write the outreach message incorporating the custom hook from step 1 into the intro. Follow the format below exactly. Do not include markdown code blocks or subject lines."""

content = content.replace(old_instructions, new_instructions)

with open('outreach-tool.html', 'w') as f:
    f.write(content)
print("Updated prompt and funnel button")
