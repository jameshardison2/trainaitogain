/**
 * LIVE SITE PRODUCTION VERIFICATION SUITE
 * Fetches and audits live assets on https://trainaitogain.com
 */

const https = require('https');
const assert = require('assert');

function fetchLiveUrl(path) {
  return new Promise((resolve, reject) => {
    const url = 'https://trainaitogain.com' + path;
    const req = https.get(url, { headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Mozilla/5.0 LiveAuditBot' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function runLiveVerification() {
  console.log('==================================================================');
  console.log('RUNNING LIVE PRODUCTION DEPLOY VERIFICATION ON TRAINAITOGAIN.COM');
  console.log('==================================================================');

  // 1. Check ai-interview.html
  console.log('\n[1/7] Auditing live https://trainaitogain.com/ai-interview...');
  const aiRes = await fetchLiveUrl('/ai-interview');
  assert.strictEqual(aiRes.status, 200, '/ai-interview must return HTTP 200');
  
  assert(aiRes.body.includes('STEP 2: PASS YOUR AI INTERVIEW'), 'Live header pill must contain STEP 2: PASS YOUR AI INTERVIEW');
  assert(!aiRes.body.includes('STEP 2 (OPTIONAL)'), 'Live header must NOT contain STEP 2 (OPTIONAL)');
  console.log('✓ PASS: Live header reads "STEP 2: PASS YOUR AI INTERVIEW"');

  assert(aiRes.body.includes('Practice only. Don\'t use notes, prompters or overlays in a real interview.'), 'Live prompter must include practice-only banner');
  console.log('✓ PASS: Live prompter includes "Practice only" warning banner');

  assert(aiRes.body.includes('Email me a 7-day practice plan.'), 'Live page must include 7-day practice plan opt-in checkbox');
  console.log('✓ PASS: Live page includes 7-day practice plan opt-in checkbox');

  assert(aiRes.body.includes('mode-opt-resumedefense'), 'Live page must include Resume Defense mode card');
  assert(aiRes.body.includes('mode-opt-passcheck'), 'Live page must include Pass Check mode card');
  console.log('✓ PASS: Live page includes Resume Defense and Pass Check modes');

  assert(aiRes.body.includes('Answer–Why–Check'), 'Live page must include Answer–Why–Check structure');
  assert(aiRes.body.includes('window._pauseCutoffSec'), 'Live page must include 2s/3s/4s pause cutoff engine');
  assert(aiRes.body.includes('Recall Ladder'), 'Live page must include Recall Ladder engine');
  console.log('✓ PASS: Live page includes Recall Ladder, Answer–Why–Check, and 2/3/4s pause cutoff engine');

  assert(!aiRes.body.includes('(Mercor, micro1, Anthropic)'), 'Live copy must NOT reference Anthropic');
  assert(aiRes.body.includes('AI screeners are built to flag repeated or canned answers.'), 'Live copy must have honest anti-gaming debrief');
  console.log('✓ PASS: Live duplicate-answer copy updated without "Anthropic"');

  // 2. Check evaluator_cards.json
  console.log('\n[2/7] Auditing live https://trainaitogain.com/evaluator_cards.json...');
  const evalRes = await fetchLiveUrl('/evaluator_cards.json');
  assert.strictEqual(evalRes.status, 200, 'evaluator_cards.json must return HTTP 200 (not 404)');
  const evalData = JSON.parse(evalRes.body);
  assert(evalData.software && evalData.software.length >= 2, 'Live evaluator cards must contain software cards');
  assert(evalData.medical && evalData.medical.length >= 2, 'Live evaluator cards must contain medical cards');
  console.log('✓ PASS: Live evaluator_cards.json returns 200 with domain evaluator cards');

  // 3. Check readiness-checklist.html
  console.log('\n[3/7] Auditing live https://trainaitogain.com/readiness-checklist...');
  const chkRes = await fetchLiveUrl('/readiness-checklist');
  assert.strictEqual(chkRes.status, 200, '/readiness-checklist must return HTTP 200');
  assert(chkRes.body.includes('id="day-of-checklist"'), 'Live checklist must contain #day-of-checklist');
  assert(chkRes.body.includes('7. Bridge phrase ready for when you need a moment to think'), 'Live checklist must contain all 7 day-of items');
  console.log('✓ PASS: Live Day-Of Checklist present on /readiness-checklist');

  // 4. Check saved-roles.html
  console.log('\n[4/7] Auditing live https://trainaitogain.com/saved-roles...');
  const srRes = await fetchLiveUrl('/saved-roles');
  assert.strictEqual(srRes.status, 200, '/saved-roles must return HTTP 200');
  assert(srRes.body.includes('Passed AI interview'), 'Live saved roles must include "Passed AI interview"');
  assert(srRes.body.includes("Didn't pass"), 'Live saved roles must include "Didn\'t pass"');
  assert(srRes.body.includes('Which question type felt hardest?'), 'Live saved roles must include hardest question survey');
  console.log('✓ PASS: Live dashboard contains "Passed AI interview", "Didn\'t pass", and hardest question survey');

  // 5. Check privacy.html
  console.log('\n[5/7] Auditing live https://trainaitogain.com/privacy...');
  const privRes = await fetchLiveUrl('/privacy');
  assert.strictEqual(privRes.status, 200, '/privacy must return HTTP 200');
  assert(privRes.body.includes('Anonymous Outcome Tracking'), 'Live privacy policy must cover Anonymous Outcome Tracking');
  assert(privRes.body.includes('No resume or answer text stored'), 'Live privacy policy must guarantee no resume or answer text stored');
  console.log('✓ PASS: Live privacy policy documents anonymous outcome tracking and data boundaries');

  // 6. Check apply.html & render_waves.js
  console.log('\n[6/7] Auditing live https://trainaitogain.com/render_waves.js...');
  const rwRes = await fetchLiveUrl('/render_waves.js');
  assert.strictEqual(rwRes.status, 200, '/render_waves.js must return HTTP 200');
  assert(rwRes.body.includes('fit-badge fit-good'), 'render_waves.js must include fit-good badge class');
  assert(rwRes.body.includes('Good fit to pass'), 'render_waves.js must include "Good fit to pass"');
  assert(rwRes.body.includes('Stretch: practice Resume Defense first'), 'render_waves.js must include Stretch label');
  assert(rwRes.body.includes('Weak fit'), 'render_waves.js must include Weak fit label');
  assert(rwRes.body.includes('Pass Check ✓'), 'render_waves.js must include Pass Check badge');
  console.log('✓ PASS: Live render_waves.js contains Good fit, Stretch, Weak fit labels, and Pass Check badge');

  // 7. Check waves.json
  console.log('\n[7/8] Auditing live https://trainaitogain.com/waves.json...');
  const wavesRes = await fetchLiveUrl('/waves.json');
  assert.strictEqual(wavesRes.status, 200, '/waves.json must return HTTP 200');
  const wavesData = JSON.parse(wavesRes.body);
  const micro1Roles = (wavesData.roles || []).filter(r => (r.platform || '').toLowerCase().includes('micro') || (r.linkTarget || '').includes('micro1'));
  const allMicro1Attributed = micro1Roles.every(r => (r.linkTarget || '').includes('05216c9f-87cc-49af-b448-f9f8a18d2efe'));
  assert(allMicro1Attributed, 'All micro1 roles must carry referral code 05216c9f-87cc-49af-b448-f9f8a18d2efe');
  assert.strictEqual(micro1Roles.length, 271, 'Must have canonical 271 micro1 roles');
  console.log(`✓ PASS: ${micro1Roles.length} micro1 roles verified live (canonical 271), 100% carrying verified referral code`);

  // 8. Check QA Report Bug Fixes Live
  console.log('\n[8/8] Auditing QA Report bug fixes live on trainaitogain.com...');
  assert(aiRes.body.includes('resume-defense-error-banner'), 'Live ai-interview must have resume-defense-error-banner (Bug 1)');
  assert(aiRes.body.includes('typed-followup-prompt'), 'Live ai-interview must have typed-followup-prompt (Bug 2)');
  assert(aiRes.body.includes('speakAsInterviewer'), 'Live ai-interview must have speakAsInterviewer (Bug 3)');
  assert(!aiRes.body.includes('/audio/q_resume_1.mp3'), 'Live ai-interview must not have MP3 audio links (Bug 3)');
  assert(rwRes.body.includes('failsDomain'), 'Live render_waves.js must include Domain Guard (Bug 4)');
  assert(rwRes.body.includes('failsLocation'), 'Live render_waves.js must include Location Guard (Bug 4)');
  assert(rwRes.body.includes('isCivilOrBlasting'), 'Live render_waves.js must include hardened domain guard');
  assert(aiRes.body.includes('hasRequiredKeywords'), 'Live ai-interview must include Pass Check keyword check');
  assert(aiRes.body.includes('minRequiredKwHits'), 'Live ai-interview must include minRequiredKwHits');
  assert(aiRes.body.includes('isCivilOrBlasting'), 'Live ai-interview must include Domain Guard');
  assert(aiRes.body.includes('id="screen1-practice-plan-optin"') && aiRes.body.includes('min-height:44px;'), 'Live ai-interview must have 44px opt-in tap target');
  assert(chkRes.body.includes('so the interviewer can see you clearly'), 'Live readiness-checklist must have updated human copy (Bug 12)');
  assert(rwRes.body.includes('doctor of osteopathy') && rwRes.body.includes('\\bMD\\b|\\bDO\\b'), 'Live render_waves.js must have strict medical credential guard');
  assert(aiRes.body.includes('isOffTopicNoKeywords'), 'Live ai-interview must have isOffTopicNoKeywords cap');
  assert(aiRes.body.includes('Retake Pass Check ➔'), 'Live ai-interview must have Retake Pass Check CTA');
  assert(aiRes.body.includes('id="page-hero-subtitle"'), 'Live ai-interview must have #page-hero-subtitle');
  assert(privRes.body.includes('Expert Network Applications') && privRes.body.includes('Jotform'), 'Live privacy policy must mention Expert Network Jotform');
  console.log('✓ PASS: All QA Report and Retest bug fixes verified on live production bundle');

  // 9. Check /enterprise Phase 1 Updates Live
  console.log('\n[9/9] Auditing live https://trainaitogain.com/enterprise (Phase 1)...');
  const entRes = await fetchLiveUrl('/enterprise');
  assert.strictEqual(entRes.status, 200, '/enterprise must return HTTP 200');
  assert(entRes.body.includes('Domain experts for AI evaluation, vetted before they reach you.'), 'Live hero must have updated headline');
  assert(entRes.body.includes('href="#inquiry"') && entRes.body.includes('Request evaluators'), 'Live page must have Request evaluators button');
  assert(entRes.body.includes('href="#expert-network"') && entRes.body.includes('Join the expert network'), 'Live page must have Join the expert network button');
  assert(entRes.body.includes('id="expert-network"'), 'Live page must have #expert-network section');
  assert(entRes.body.includes('https://form.jotform.com/263078785644067'), 'Live page must embed Jotform form');
  assert(entRes.body.includes('height:1400px'), 'Live Jotform iframe must have height:1400px');
  assert(entRes.body.includes('Can I work corp-to-corp?'), 'Live page must have C2C FAQ');
  assert(entRes.body.includes('Is joining the expert network free?'), 'Live page must have free FAQ');
  assert(entRes.body.includes('How is this different from Active Roles?'), 'Live page must have Active Roles FAQ');
  assert(!entRes.body.includes('Official Referral Partner'), 'Live page must NOT claim Official Referral Partner');
  assert(!entRes.body.includes('Mercor Data-Partner Program'), 'Live page must NOT claim Mercor Data-Partner Program');
  assert(entRes.body.includes('Technical Transition Advisory'), 'Live page must name Track 02 Technical Transition Advisory');
  assert(!entRes.body.includes('$80–$160/hr') && !entRes.body.includes('$65–$130/hr'), 'Live page must NOT contain pay ranges');
  assert(entRes.body.includes('Now building our network in medical devices, QA and regulatory software. Rates quoted per project.'), 'Live page must have updated Track 3 copy');
  assert(!entRes.body.includes('within 24 hours'), 'Live page must NOT contain within 24 hours');
  assert(entRes.body.includes('within 1 business day'), 'Live page must contain within 1 business day');
  console.log('✓ PASS: Live /enterprise Phase 1 requirements fully verified');

  console.log('\n==================================================================');
  console.log('ALL LIVE SITE CHECKS PASSED ON TRAINAITOGAIN.COM! 🚀');
  console.log('==================================================================');
}

runLiveVerification().catch(err => {
  console.error('\n❌ LIVE AUDIT ERROR:', err.message);
  process.exit(1);
});
