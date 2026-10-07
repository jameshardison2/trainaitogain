const fs = require('fs');
let html = fs.readFileSync('apply', 'utf8');

const footerIndex = html.indexOf('<footer');
if (footerIndex !== -1) {
  const section = `
<section class="section" style="padding-top:24px; padding-bottom:64px;">
  <div class="container" id="dynamic-jobs-container">
  </div>
</section>
`;
  html = html.substring(0, footerIndex) + section + html.substring(footerIndex);
  fs.writeFileSync('apply', html);
  console.log("Added dynamic container");
}
