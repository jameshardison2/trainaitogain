const { JSDOM } = require('jsdom');

const html = `
<!DOCTYPE html>
<html><body>
<script>
window.handleApplyClick = function(title, linkTarget, btn) {
    let targetUrl = linkTarget;
    if (!targetUrl || targetUrl === 'undefined' || targetUrl === 'null' || targetUrl === '') {
        targetUrl = 'https://t.mercor.com/wbPMF';
    }
    console.log("targetUrl is:", targetUrl);
}
</script>
<button id="btn1" onclick="window.handleApplyClick('Agent Engineer', 'undefined', this)">Apply Now 1</button>
<button id="btn2" onclick="window.handleApplyClick('Agent Engineer', undefined, this)">Apply Now 2</button>
</body></html>
`;
const dom = new JSDOM(html, { runScripts: "dangerously" });
dom.window.document.getElementById('btn1').click();
dom.window.document.getElementById('btn2').click();
