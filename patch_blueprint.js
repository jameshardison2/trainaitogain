const fs = require('fs');
let code = fs.readFileSync('hiring-blueprint.html', 'utf8');

// 1. Remove "Cheat Sheet"
code = code.replace(/<title>The AI Interview Cheat Sheet \| TrainAIToGain<\/title>/g, '<title>The AI Interview Blueprint | TrainAIToGain</title>');
code = code.replace(/<div class="badge">Official Cheat Sheet<\/div>/g, '<div class="badge">Official Hiring Blueprint</div>');

// 2. Add Inline CTA after Section 3
const section3End = `      <p style="margin-bottom:0;"><strong>Plus (10s):</strong> "This experience taught me [Takeaway], which I plan to bring to this role."</p>
    </div>`;
const inlineCTA = `
    <!-- INLINE CTA -->
    <div style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius:12px; padding:24px; margin:40px 0; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow:0 10px 25px -5px rgba(16,185,129,0.3);">
      <h3 style="color:white; margin:0 0 12px 0; font-size:22px; font-weight:800;">Does your resume have these keywords?</h3>
      <p style="color:#d1fae5; margin:0 0 20px 0; font-size:16px;">Don't wait until the interview to find out. Test your resume against the exact algorithmic scanner right now.</p>
      <a href="resume-ats-guide.html" style="background:white; color:#059669; font-weight:800; text-decoration:none; padding:12px 24px; border-radius:8px; font-size:16px; box-shadow:0 4px 6px rgba(0,0,0,0.1); transition:transform 0.2s;">Scan My Resume Now ➔</a>
    </div>
`;
code = code.replace(section3End, section3End + inlineCTA);

// 3. Break Up Text Density for UL/LI
// We will replace raw <ul> with a styled version
const oldUl = `<ul>`;
const newUl = `<ul style="list-style:none; padding:0; margin:24px 0;">`;
code = code.replace(/<ul>/g, newUl);

const oldLi = `<li>`;
const newLi = `<li style="background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:8px; margin-bottom:12px; color:var(--gray-800); line-height:1.5; position:relative; padding-left:40px;">
  <span style="position:absolute; left:16px; top:16px; color:var(--primary); font-weight:800;">✓</span>`;
code = code.replace(/<li>/g, newLi);

// Since some LIs already have a style inline (in section 5), let's replace those specifically:
const oldLi2 = `<li style="margin-bottom:12px;">`;
code = code.replace(/<li style="margin-bottom:12px;">/g, newLi);

fs.writeFileSync('hiring-blueprint.html', code);
console.log("Patched hiring-blueprint.html successfully.");
