const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = '/Users/176693/.gemini/antigravity/brain/7efe27bc-46e4-4f0a-ae17-5aa328376871';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950 });

    await page.goto('https://trainaitogain.com/ai-interview', { waitUntil: 'networkidle2' });

    // Seed raw pasted resume directly copied from PDF with name and headline on the first line separated by 2 spaces
    await page.evaluate(() => {
      localStorage.removeItem('candidateName');
      sessionStorage.removeItem('candidateName');
      localStorage.setItem('candidateResumeText', `JAMES N. HARDISON II  Robotics Test Engineer & AI Evaluation Leader | Data Scientist | Medical Devices
Senior Software Verification Engineer | Johnson & Johnson MedTech
• Authored and executed 30+ verification protocols aligned to IEC 62304 and FDA guidance for robotic surgery platforms.
• Designed automated test pipelines using Python and PyTest, reducing test cycle turnaround by 45%.
• Led risk hazard analysis and root-cause investigations across 15+ complex medical device subsystem releases.`);
      localStorage.setItem('atsRole', 'Senior Software Verification Engineer');
    });

    await page.goto('https://trainaitogain.com/ai-interview', { waitUntil: 'networkidle2' });

    // Listen for the popup window created by window.open('', '_blank')
    const newTargetPromise = new Promise(resolve => browser.once('targetcreated', target => resolve(target.page())));

    // Trigger PDF download/preview
    await page.evaluate(() => {
      window.downloadStarPracticePdf();
    });

    const pdfPage = await newTargetPromise;
    await pdfPage.waitForSelector('.sheet-container', { visible: true });

    // Inspect the cover page metadata grid
    const metadataText = await pdfPage.evaluate(() => {
      const el = document.querySelector('.sheet-container');
      return el ? el.innerText : '';
    });

    console.log("PDF Sheet Cover Text Preview:\n" + metadataText.slice(0, 350));

    const screenshotPath = path.join(ARTIFACT_DIR, 'live_pasted_pdf_name_cover.png');
    await pdfPage.screenshot({ path: screenshotPath, fullPage: false });
    console.log("Saved live screenshot:", screenshotPath);

    if (metadataText.includes('James N. Hardison II')) {
      console.log("SUCCESS: 'James N. Hardison II' correctly extracted from PDF-pasted first line and formatted in normal capitalization!");
    } else {
      console.error("FAILURE: Name did not match 'James N. Hardison II' on live site!");
      process.exit(1);
    }
  } catch (err) {
    console.error("Error during verification:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
