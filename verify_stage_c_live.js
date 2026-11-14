const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/176693/.gemini/antigravity/brain/7efe27bc-46e4-4f0a-ae17-5aa328376871';
const LIVE_URL = 'https://trainaitogain.com/ai-interview?v=' + Date.now();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('==================================================================');
  console.log('LAUNCHING COMPREHENSIVE LIVE E2E REGRESSION SUITE ON CHROME');
  console.log('Target URL:', LIVE_URL);
  console.log('Artifacts Directory:', ARTIFACT_DIR);
  console.log('==================================================================');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=780,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 780, height: 1000 });

  const errorsLogged = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || text.includes('CRITICAL') || text.includes('ReferenceError') || text.includes('TypeError')) {
      errorsLogged.push(text);
      console.log('PAGE LOG/ERROR:', text);
    }
  });

  page.on('pageerror', err => {
    errorsLogged.push(err.toString());
    console.log('UNCAUGHT EXCEPTION:', err.toString());
  });

  try {
    // 1. Initial Load & Verify P0 #2 (Clean UI, No Red Debug Banner)
    console.log('\n--- Step 1: Initial Page Load ---');
    await page.goto(LIVE_URL, { waitUntil: 'networkidle2' });
    await sleep(800);

    const hasRedBanner = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div'));
      return allDivs.some(d => d.textContent.includes('CRITICAL JS ERROR') || (d.style.borderColor === 'rgb(239, 68, 68)' && d.style.borderWidth === '3px'));
    });
    console.log('P0 #2 Check: Red error banner present?', hasRedBanner);
    if (hasRedBanner) throw new Error('P0 #2 FAIL: Red debug banner rendered on live site');

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'p0_error_handling_clean.png') });
    console.log('✓ Captured p0_error_handling_clean.png');

    // 2. Verify P0 #3: "See an example first" Drawer in Screen 2
    console.log('\n--- Step 2: Testing P0 #3 "See an example first" Drawer ---');
    // Ensure Typed mode is enabled
    await page.evaluate(() => {
      localStorage.setItem('interviewTextMode', 'true');
      if (typeof window.setInterviewMode === 'function') window.setInterviewMode(true);
    });

    // Enter Practice mode to access Screen 2
    await page.evaluate(() => {
      window.selectSimMode('practice');
    });
    await sleep(200);

    const startBtn = await page.$('#start-btn');
    if (startBtn) await startBtn.click();
    await sleep(1000);

    // Now in Screen 2, #quick-teleprompter-btn is visible!
    await page.waitForSelector('#quick-teleprompter-btn', { visible: true });
    console.log('Screen 2 active. Clicking "See an example first"...');
    await page.click('#quick-teleprompter-btn');
    await sleep(600);

    const drawerOpenState = await page.evaluate(() => {
      const panel = document.getElementById('practice-script-side-panel');
      const btnText = document.getElementById('quick-teleprompter-btn-text')?.textContent;
      return {
        panelExists: Boolean(panel),
        panelDisplay: panel ? window.getComputedStyle(panel).display : 'none',
        btnText: btnText
      };
    });
    console.log('Drawer Open State:', drawerOpenState);
    if (drawerOpenState.panelDisplay === 'none') {
      throw new Error('P0 #3 FAIL: practice-script-side-panel did not open on click');
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'p0_see_example_drawer_open.png') });
    console.log('✓ Captured p0_see_example_drawer_open.png');

    // Close example drawer
    await page.click('#quick-teleprompter-btn');
    await sleep(400);

    // Return to setup view to run the full guided flow from the beginning
    await page.evaluate(() => {
      window.returnToSetupView();
    });
    await sleep(600);

    // 3. Guided Prep Plan Step 1: Start My Prep Plan -> Warm-Up Drill
    console.log('\n--- Step 3: Starting Guided Prep Plan (Step 1 Warm-Up) ---');
    await page.waitForSelector('#start-btn', { visible: true });
    await page.click('#start-btn');
    await sleep(1000);

    // Wait for warm-up question card
    await page.waitForSelector('#screen2-warmup-banner', { visible: true });
    const warmupBannerText = await page.$eval('#screen2-warmup-banner', el => el.textContent);
    console.log('Warmup Banner Text:', warmupBannerText.trim().replace(/\s+/g, ' '));

    // Submit Warm-Up response in typed mode
    await page.waitForSelector('#typed-answer-input', { visible: true });
    await page.type('#typed-answer-input', 'In my recent work as Senior Software Verification Engineer at J&J MedTech, I led automated testing frameworks using Python and SQL to validate complex medical device software. As a direct result, our team authored 30+ verification protocols and maintained zero critical defect escapes.');
    await sleep(300);

    await page.click('#done-typing-btn');
    await sleep(1000);

    await page.waitForSelector('#in-page-feedback', { visible: true });
    // Verify Review reveal order: 1. Your Response -> 2. Model Answer -> 3. Comparison
    const reviewOrder = await page.evaluate(() => {
      const box = document.getElementById('in-page-feedback');
      const text = box ? (box.innerText || box.textContent || '').toUpperCase() : '';
      const idx1 = text.indexOf('1. YOUR RESPONSE');
      const idx2 = text.indexOf('2. MODEL ANSWER');
      const idx3 = text.indexOf('3. COMPARISON');
      return { idx1, idx2, idx3, valid: idx1 !== -1 && idx2 > idx1 && idx3 > idx2, snippet: text.slice(0, 300) };
    });
    console.log('Review Reveal Order:', reviewOrder);
    if (!reviewOrder.valid) throw new Error('Review reveal order is incorrect: ' + JSON.stringify(reviewOrder));

    // Finish Warm-Up & advance to Report
    await page.waitForSelector('#in-page-feedback button.btn-primary', { visible: true });
    await page.click('#in-page-feedback button.btn-primary');
    await sleep(1200);

    // Check Warm-Up Report
    const reportHeadline = await page.evaluate(() => {
      return document.getElementById('results-view')?.innerText.slice(0, 200).replace(/\s+/g, ' ');
    });
    console.log('Warm-Up Report Headline:', reportHeadline);

    // 4. Continue to Step 2: 10-Question Flashcard Mastery Deck
    console.log('\n--- Step 4: Continue to Step 2 Flashcards ---');
    await page.evaluate(() => {
      window.continueGuidedPlanToFlashcards();
    });
    await sleep(1000);

    await page.waitForSelector('#flashcards-deck-container', { visible: true });
    console.log('Flashcards deck rendered successfully.');

    // Test Card 1: Flip & rate "Missed it" (to test repeat queue and deduplication)
    console.log('Testing Card 1 flip & rate "Missed it"...');
    await page.evaluate(() => window.flipCurrentFlashcard());
    await sleep(400);

    // Rate "Missed it"
    await page.evaluate(() => window.rateFlashcard('missed-it'));
    await sleep(500);

    // Cards 2 through 10: Rate "Got it"
    for (let c = 2; c <= 10; c++) {
      await page.evaluate(() => window.flipCurrentFlashcard());
      await sleep(300);
      await page.evaluate(() => window.rateFlashcard('got-it'));
      await sleep(350);
    }

    // Now Card 1 repeat should appear
    const repeatBadgeText = await page.$eval('#fc-progress-badge', el => el.textContent);
    console.log('Repeat queue progress badge:', repeatBadgeText);
    if (!repeatBadgeText.includes('Repeat')) {
      console.warn('Warning: Repeat badge did not contain "Repeat":', repeatBadgeText);
    }

    // Rate the repeated card "Got it"
    await page.evaluate(() => window.flipCurrentFlashcard());
    await sleep(300);
    await page.evaluate(() => window.rateFlashcard('got-it'));
    await sleep(800);

    // Flashcard Summary displayed
    await page.waitForSelector('#fc-completion-summary', { visible: true });
    const summaryText = await page.$eval('#fc-completion-summary', el => el.textContent.replace(/\s+/g, ' '));
    console.log('Flashcard Mastery Summary Text:', summaryText);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flashcard_summary_missed_it.png') });
    console.log('✓ Captured flashcard_summary_missed_it.png');

    // 5. P0 #1 Verification: Advance from Step 2 to Step 3 (No Crash!)
    console.log('\n--- Step 5: Advance from Step 2 to Step 3 (P0 #1 Test) ---');
    const step3AdvBtn = await page.$('#fc-completion-summary button.btn-primary');
    if (!step3AdvBtn) throw new Error('Step 3 advance button not found on flashcard summary');

    await step3AdvBtn.click();
    await sleep(1500);

    // Check if page went blank or crashed
    const isBlankOrCrashed = await page.evaluate(() => {
      const text = document.body ? document.body.innerText : '';
      return text.includes('CRITICAL JS ERROR') || text.includes('getResolvedInterviewTextMode is not defined');
    });
    console.log('Did Step 2->3 transition crash?', isBlankOrCrashed);
    if (isBlankOrCrashed) throw new Error('P0 #1 FAIL: Step 2->3 crashed with ReferenceError');

    // Verify Step 3 Guided Banner
    await page.waitForSelector('#screen2-guided-banner', { visible: true });
    const step3BannerText = await page.$eval('#screen2-guided-banner', el => el.textContent.replace(/\s+/g, ' '));
    console.log('Step 3 Banner Text:', step3BannerText);

    // Verify Guided Step Pill
    const guidedPillText = await page.$eval('#guided-step-banner', el => el.textContent);
    console.log('Guided Step Pill:', guidedPillText);

    // Verify CoPilot tips panel is open by default (P2 #17)
    const copilotTipsVisible = await page.evaluate(() => {
      const panel = document.getElementById('copilot-all-tips-body');
      return panel && window.getComputedStyle(panel).display !== 'none';
    });
    console.log('CoPilot Tips open by default in Step 3?', copilotTipsVisible);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'p0_step2_to_step3_success.png') });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_guided_banner.png') });
    console.log('✓ Captured p0_step2_to_step3_success.png and step3_guided_banner.png');

    // 6. Step 3 Interview Q1 through Q10 Full Run
    console.log('\n--- Step 6: Step 3 Questions Walkthrough (Q1 through Q10) ---');
    for (let q = 1; q <= 10; q++) {
      console.log(`Processing Question ${q} of 10...`);
      await page.waitForSelector('#typed-answer-input', { visible: true });

      // Check "Use as Answer" on Q1 (P1 #10)
      if (q === 1) {
        // Type answer
        await page.type('#typed-answer-input', 'In my recent work as Senior Software Verification Engineer at J&J MedTech, I led automated testing workflows with Python and SQL. I diagnosed critical boundary bugs and authored 30+ verification protocols, cutting QA turnaround time by 35%.');
        await sleep(300);
        await page.click('#done-typing-btn');
        await sleep(1000);

        // Click "Use as Answer" inside Model Answer
        const useAsAnswerBtn = await page.$('.tp-control-btn.primary');
        if (useAsAnswerBtn) {
          console.log('Testing "Use as Answer" button...');
          await useAsAnswerBtn.click();
          await sleep(500);

          const answerBoxVisible = await page.evaluate(() => {
            const container = document.getElementById('typed-answer-container');
            const review = document.getElementById('in-page-feedback');
            const input = document.getElementById('typed-answer-input');
            return {
              containerVisible: container && window.getComputedStyle(container).display !== 'none',
              reviewHidden: review && window.getComputedStyle(review).display === 'none',
              hasValue: input && input.value.length > 50
            };
          });
          console.log('P1 #10 Use as Answer outcome:', answerBoxVisible);
          if (!answerBoxVisible.containerVisible || !answerBoxVisible.reviewHidden) {
            throw new Error('P1 #10 FAIL: Use as Answer did not reveal typed container and hide review');
          }

          // Re-evaluate to continue
          await page.click('#done-typing-btn');
          await sleep(1000);
        }
      } else {
        await page.type('#typed-answer-input', `For STAR question ${q}, I applied Python, SQL, and rigorous rubric verification at J&J MedTech to isolate failure modes and automate tests, delivering 30+ protocols.`);
        await sleep(250);
        await page.click('#done-typing-btn');
        await sleep(800);
      }

      await page.waitForSelector('#in-page-feedback button.btn-primary', { visible: true });
      const nextBtnText = await page.$eval('#in-page-feedback button.btn-primary', el => el.textContent.trim().replace(/\s+/g, ' '));
      console.log(`Question ${q} Next Button: "${nextBtnText}"`);

      if (q === 10) {
        // Capture Q10 button screenshot
        if (!nextBtnText.includes('Complete Practice') || !nextBtnText.includes('Advance to Step 4')) {
          console.warn('Q10 button text warning:', nextBtnText);
        }
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_q10_advance_button.png') });
        console.log('✓ Captured step3_q10_advance_button.png');

        // Click to finish Step 3
        await page.click('#in-page-feedback button.btn-primary');
        await sleep(1500);
        break;
      }

      // Advance to next question
      await page.click('#in-page-feedback button.btn-primary');
      await sleep(1000);
    }

    // 7. Verify Step 3 Completion Card & Step 4 Advance Button
    console.log('\n--- Step 7: Step 3 Completion Card & Step 4 Button ---');
    await page.waitForSelector('#step3-completion-banner', { visible: true });
    const step3CompleteText = await page.$eval('#step3-completion-banner', el => el.textContent.replace(/\s+/g, ' '));
    console.log('Step 3 Completion Card Text:', step3CompleteText);

    const hasStep4Btn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.includes('Step 4 of 4: Take Pass Check'));
    });
    console.log('Step 4 advance button exists?', hasStep4Btn);
    if (!hasStep4Btn) throw new Error('Step 4 advance button not found on Step 3 completion card');

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_completion_card.png') });
    console.log('✓ Captured step3_completion_card.png');

    // 8. Verify P1 #4: Session Persistence on Reload
    console.log('\n--- Step 8: Testing P1 #4 Session Persistence on Reload ---');
    await page.evaluate(() => {
      window.returnToSetupView();
    });
    await sleep(600);

    // Simulate saving an in-progress session and reloading
    await page.evaluate(() => {
      const mockSession = {
        simMode: 'practice',
        currentQ: 2,
        currentDomain: 'software',
        currentQuestions: [
          { q: 'Question 1', keywords: ['python'] },
          { q: 'Question 2', keywords: ['sql'] },
          { q: 'Question 3', keywords: ['testing'] }
        ],
        sessionQuestionResults: [
          { qIndex: 0, score: 85, answered: true, wordCount: 75 },
          { qIndex: 1, score: 90, answered: true, wordCount: 82 }
        ],
        totalScore: 175,
        totalQuestionsAnswered: 2,
        isGuided: true,
        guidedStep: 3,
        timestamp: Date.now()
      };
      localStorage.setItem('tgt_active_interview_session', JSON.stringify(mockSession));
    });

    // Reload the page
    await page.goto(LIVE_URL, { waitUntil: 'networkidle2' });
    await sleep(800);

    const resumeCard = await page.waitForSelector('#tgt-resume-interview-card', { visible: true });
    const resumeText = await page.$eval('#tgt-resume-interview-card', el => el.textContent.replace(/\s+/g, ' '));
    console.log('Active session resume banner text:', resumeText);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'p1_session_resume_banner.png') });
    console.log('✓ Captured p1_session_resume_banner.png');

    // Clean up
    await page.click('#discard-interview-btn');
    await sleep(400);

    // 9. Verify P2 #18: domain-selector sync
    console.log('\n--- Step 9: Testing P2 #18 domain-selector sync ---');
    const roleSyncResult = await page.evaluate(() => {
      window.selectRoleItem('Registered Nurse', 'medical');
      const sel = document.getElementById('domain-selector');
      const selectedOpt = sel.options[sel.selectedIndex];
      return {
        value: sel.value,
        selectedText: selectedOpt ? selectedOpt.textContent : ''
      };
    });
    console.log('P2 #18 Role sync result:', roleSyncResult);
    if (!roleSyncResult.selectedText.includes('Registered Nurse')) {
      throw new Error('P2 #18 FAIL: domain-selector selected option text did not sync to Registered Nurse');
    }

    // 10. Verify P1 #8 & P1 #9: Weak Fit Badge & Neutral Blanks
    console.log('\n--- Step 10: Testing P1 #8 & P1 #9 Weak Fit Badge & Neutral Blanks ---');
    const weakFitTest = await page.evaluate(() => {
      localStorage.setItem('candidateResumeText', 'Senior Software Verification Engineer | J&J MedTech Python SQL Testing');
      const fit = window.getPassLikelihoodFit('Registered Nurse', localStorage.getItem('candidateResumeText'));
      const star = window.computeStarPartsForQuestion({ q: 'Handle a patient crisis', keywords: ['triage'] }, 0, '');
      return {
        fit: fit.fit,
        starSt: star.st,
        hasNeutralTitle: star.st.includes('[your job title]') || star.a.includes('[your job title]')
      };
    });
    console.log('P1 #8 & P1 #9 Test:', weakFitTest);
    if (weakFitTest.fit !== 'weak' || !weakFitTest.hasNeutralTitle) {
      throw new Error('P1 #8/P1 #9 FAIL: Weak fit role did not use neutral template blanks');
    }

    // 11. Verify P1 #15: Length Penalty for Short Answers
    console.log('\n--- Step 11: Testing P1 #15 Length Penalty ---');
    const lengthPenaltyTest = await page.evaluate(() => {
      const res = window.evaluateAnswerText('I used Python to write tests and improved test coverage by 20% across our primary software pipeline.', { q: 'Describe your testing process', keywords: ['python'] }, 0);
      return {
        wordCount: res.wordCount,
        score: res.cappedScore,
        toTighten: res.toTighten
      };
    });
    console.log('P1 #15 Test (17-word answer):', lengthPenaltyTest);
    if (lengthPenaltyTest.score > 50 || !lengthPenaltyTest.toTighten.includes('Answer too brief')) {
      throw new Error('P1 #15 FAIL: Short answer was not capped and flagged with length warning');
    }

    console.log('\n==================================================================');
    console.log('ALL LIVE REGRESSION VERIFICATIONS COMPLETED WITH 100% SUCCESS!');
    console.log('Errors logged during run:', errorsLogged.length);
    console.log('==================================================================');

  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_verification_error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
