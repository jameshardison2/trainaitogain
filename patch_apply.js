const fs = require('fs');
let html = fs.readFileSync('apply', 'utf8');

const startIndex = html.indexOf('<section class="section" style="padding-top:24px; padding-bottom:64px;">');
const endIndex = html.indexOf('<footer');

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + html.substring(endIndex);
  fs.writeFileSync('apply', html);
  console.log("Removed hardcoded cards from apply");
} else {
  console.log("Could not find blocks");
}
