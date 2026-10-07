const fs = require('fs');
let code = fs.readFileSync('apply.html', 'utf8');

// 1. Add social proof badge to modal
const oldModalTop = `<div style="padding:24px;">
          <p style="margin-bottom:16px; color:var(--gray-700); line-height:1.6;">You are leaving TrainAIToGain to apply on the official external network. Optional: Join our free newsletter to get interview prep tips sent to your inbox before you start.</p>`;
const newModalTop = `<div style="padding:24px;">
          <div style="background:var(--primary-light); color:var(--primary-dark); padding:8px 12px; border-radius:6px; font-size:13px; font-weight:700; margin-bottom:16px; display:inline-block; border: 1px solid var(--primary);">✨ Join 4,200+ applicants who bypassed the waitlist this week</div>
          <p style="margin-bottom:16px; color:var(--gray-700); line-height:1.6;">You are leaving TrainAIToGain to apply on the official external network. Optional: Join our free newsletter to get interview prep tips sent to your inbox before you start.</p>`;
code = code.replace(oldModalTop, newModalTop);

// 2. Change openApplyModal to take link and handle direct routing
const oldOpenApply = `function openApplyModal(source) {
        window.currentApplySource = source;
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            var targetUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
            if (ref) targetUrl += "&ref=" + encodeURIComponent(ref);
            window.open(targetUrl, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }`;

const newOpenApply = `function openApplyModal(source, link) {
        window.currentApplySource = source;
        window.currentApplyLink = link || "https://t.mercor.com/wbPMF";
        var params = new URLSearchParams(window.location.search);
        var ref = params.get('ref') || localStorage.getItem('affiliate_ref') || '';
        if (params.get('ref')) localStorage.setItem('affiliate_ref', params.get('ref'));
        
        // If they already entered their email, don't ask again
        if (localStorage.getItem('hasEnteredEmailForApply') === 'true') {
            if(typeof gtag === 'function') gtag('event', 'apply_click', {'event_category':'referral', 'event_label':source});
            window.open(window.currentApplyLink, '_blank');
            return;
        }

        var modal = document.getElementById('applyModal');
        modal.style.display = 'flex';
      }`;
code = code.replace(oldOpenApply, newOpenApply);

// 3. Update handleModalSubmit to use window.currentApplyLink
// First replace the success try block
const oldTargetSuccess = `var targetUrl = "https://t.mercor.com/wbPMF";
            if (refCode) {
                targetUrl += "?ref=" + encodeURIComponent(refCode);
            }`;
const newTargetSuccess = `var targetUrl = window.currentApplyLink || "https://t.mercor.com/wbPMF";`;
code = code.replace(oldTargetSuccess, newTargetSuccess);

// Replace the fallback catch block
const oldTargetFallback = `var targetUrl = "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
            var refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            if (refCode) targetUrl += "?ref=" + encodeURIComponent(refCode);`;
const newTargetFallback = `var targetUrl = window.currentApplyLink || "https://refer.micro1.ai/referral/jobs?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral";`;
code = code.replace(oldTargetFallback, newTargetFallback);


// 4. Update the AWS Serverless Resume Processor to be wrapped in <details>
const oldAWSStart = `<!-- AWS Serverless Resume Processor -->
    <div style="background: white; padding: 20px 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); text-align: left; margin-top: 32px; display: flex; flex-direction: column; gap: 12px;">`;
const newAWSStart = `<!-- AWS Serverless Resume Processor -->
    <details style="background: white; padding: 20px 24px; border-radius: var(--radius-lg); border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); text-align: left; margin-top: 32px; margin-bottom: 32px; display: block; outline:none;" id="aws-resume-matcher">
      <summary style="font-size:18px; font-weight:800; color:var(--primary-dark); cursor:pointer; list-style:none; outline:none; display:flex; align-items:center; gap:8px;">
        <span>✨ Optional: Match my resume with AI</span>
      </summary>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top:16px;">`;

code = code.replace(oldAWSStart, newAWSStart);

// Now find the end of that block. It ends right before `<!-- AWS Frontend Integration Script -->`
const oldAWSEnd = `  <span id="aws-status-text">Analyzing document...</span>
        </div>
      </div>
    </div>

    <!-- AWS Frontend Integration Script -->`;
const newAWSEnd = `  <span id="aws-status-text">Analyzing document...</span>
        </div>
      </div>
      </div>
    </details>

    <!-- AWS Frontend Integration Script -->`;
code = code.replace(oldAWSEnd, newAWSEnd);

fs.writeFileSync('apply.html', code);
console.log("Patched apply.html successfully.");
