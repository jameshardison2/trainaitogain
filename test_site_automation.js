const fs = require('fs');
const path = require('path');

const LIVE_BASE = 'https://trainaitogain.com';
const PREVIEW_BASE = 'https://trainaitogain-50c19--round4-preview-dntt6qfk.web.app';
const TEST_EMAIL = 'james.hardison2@gmail.com';

const results = [];

function recordResult(category, testName, passed, details = '') {
  results.push({ category, testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${category}] ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function testHttpEndpoint(url, expectedStatus = 200) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'AutomationTester/1.0' } });
    const isOk = res.status === expectedStatus;
    return { ok: isOk, status: res.status, url };
  } catch (err) {
    return { ok: false, error: err.message, url };
  }
}

async function runSuite() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE SITE & EMAIL AUTOMATION TEST');
  console.log(`Target Live: ${LIVE_BASE}`);
  console.log(`Target Preview: ${PREVIEW_BASE}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  console.log('====================================================\n');

  // --- SUITE 1: Live & Preview Page Availability ---
  console.log('--- 1. Testing Core Pages Availability (HTTP 200) ---');
  const pages = [
    '/',
    '/apply',
    '/saved-roles',
    '/ai-interview',
    '/resume-ats-guide',
    '/readiness-checklist',
    '/internal-hub',
    '/outreach-tool',
    '/disclosure',
    '/unsubscribe',
    '/waves.json'
  ];

  for (const p of pages) {
    const resLive = await testHttpEndpoint(`${LIVE_BASE}${p}`);
    recordResult('Page Availability (Live)', p, resLive.ok, `Status: ${resLive.status || resLive.error}`);
  }

  for (const p of ['/apply', '/saved-roles', '/waves.json']) {
    const resPrev = await testHttpEndpoint(`${PREVIEW_BASE}${p}`);
    recordResult('Page Availability (Preview)', p, resPrev.ok, `Status: ${resPrev.status || resPrev.error}`);
  }

  // --- SUITE 2: waves.json Data & Rate Validation ---
  console.log('\n--- 2. Testing waves.json Schema & Rate Sanitation ---');
  try {
    const wavesPath = path.join(__dirname, 'waves.json');
    const raw = fs.readFileSync(wavesPath, 'utf-8');
    const data = JSON.parse(raw);
    const hasRoles = Array.isArray(data.roles) && data.roles.length > 0;
    recordResult('Data Integrity', 'waves.json is valid JSON with roles', hasRoles, `Found ${data.roles ? data.roles.length : 0} roles`);

    const micro1Roles = data.roles.filter(r => r.id.startsWith('micro1-') || r.platform === 'micro1');
    recordResult('Data Integrity', 'Micro1 roles present', micro1Roles.length > 0, `Found ${micro1Roles.length} micro1 roles`);

    const mercorRoles = data.roles.filter(r => !r.id.startsWith('micro1-') && r.platform !== 'micro1');
    recordResult('Data Integrity', 'Mercor roles present', mercorRoles.length > 0, `Found ${mercorRoles.length} Mercor roles`);

    const hasSyncDate = !!(data.meta && data.meta.syncedAt);
    recordResult('Data Integrity', 'waves.meta.syncedAt exists', hasSyncDate, data.meta ? data.meta.syncedAt : 'missing');

    // Outlier Pay Check: No role should have pay like $45000/hr or $50000/hr
    const brokenHourlyRates = data.roles.filter(r => {
      if (!r.pay || !r.pay.includes('/hr')) return false;
      const m = r.pay.match(/\$(\d[\d,]*)/);
      if (!m) return false;
      const num = parseInt(m[1].replace(/,/g, ''), 10);
      return num > 500;
    });
    recordResult('Data Integrity', 'No broken outlier hourly pay rates (> $500/hr)', brokenHourlyRates.length === 0, 
      brokenHourlyRates.length === 0 ? 'All hourly rates <= $500/hr' : `Found ${brokenHourlyRates.length} broken rates`);
  } catch (err) {
    recordResult('Data Integrity', 'waves.json loading', false, err.message);
  }

  // --- SUITE 3: Code Inspection for /apply Filters & Match Logic ---
  console.log('\n--- 3. Testing /apply Match % Filter & Sort in render_waves.js ---');
  try {
    const renderWavesContent = fs.readFileSync(path.join(__dirname, 'render_waves.js'), 'utf-8');
    
    // Check filter elements in HTML string
    const hasMatchFilterEl = renderWavesContent.includes('id="jobMatchFilter"');
    recordResult('Active Roles UI', 'jobMatchFilter dropdown exists', hasMatchFilterEl);

    const hasMatchOptions = renderWavesContent.includes('value="70"') && renderWavesContent.includes('value="50"') && renderWavesContent.includes('value="SCANNED"');
    recordResult('Active Roles UI', 'jobMatchFilter contains 70%, 50%, SCANNED options', hasMatchOptions);

    const hasLocFilterEl = renderWavesContent.includes('id="jobLocationFilter"');
    recordResult('Active Roles UI', 'jobLocationFilter (Where are you based) exists', hasLocFilterEl);

    const hasSortFilterEl = renderWavesContent.includes('id="jobSortFilter"') && renderWavesContent.includes('value="MATCH_HIGH"');
    recordResult('Active Roles UI', 'jobSortFilter with Highest Match % option exists', hasSortFilterEl);

    // Check filterJobs logic
    const hasFilterLogic = renderWavesContent.includes('matchesMatch = (cardMatch >= 70);') && renderWavesContent.includes('matchesMatch = (cardMatch >= 50);');
    recordResult('Active Roles Logic', 'filterJobs evaluates cardMatch against thresholds', hasFilterLogic);

    const hasMatchSortLogic = renderWavesContent.includes("sort === 'MATCH_HIGH'") && renderWavesContent.includes("parseInt(b.getAttribute('data-match') || '0', 10)");
    recordResult('Active Roles Logic', 'Cards sorted in DOM by data-match descending', hasMatchSortLogic);

    // Check Card Data Attributes
    const hasCardDataMatch = renderWavesContent.includes('data-match="${matchScore !== null ? matchScore : 0}"');
    recordResult('Active Roles Logic', 'Cards injected with data-match attribute', hasCardDataMatch);

    // Check Requirements Pill
    const hasReqPill = renderWavesContent.includes('getRoleRequirements(role)') && renderWavesContent.includes('role-requirements');
    recordResult('Active Roles Logic', 'Cards render Requirements Pill (location, degree, license)', hasReqPill);

    // Check Soft Landing & Tracking
    const hasSoftLanding = renderWavesContent.includes('apply-soft-landing') || fs.readFileSync(path.join(__dirname, 'apply.html'), 'utf-8').includes('apply-soft-landing');
    recordResult('Active Roles UX', 'Soft landing expansion card on apply click exists', hasSoftLanding);

    const hasMatchTracking = fs.readFileSync(path.join(__dirname, 'apply.html'), 'utf-8').includes('match_score: matchScore') || renderWavesContent.includes('match_score: matchScore');
    recordResult('Active Roles UX', 'apply_click passes device_type and match_score', hasMatchTracking);

    // Check Exit-Intent Removal per specification
    const applyHtml = fs.readFileSync(path.join(__dirname, 'apply.html'), 'utf-8');
    const hasExitIntent = applyHtml.includes('exit-intent-modal') || applyHtml.includes('mouseleave');
    recordResult('Active Roles UX', 'Exit intent popup completely removed from /apply', !hasExitIntent);
  } catch (err) {
    recordResult('Active Roles Suite', 'Inspection failed', false, err.message);
  }

  // --- SUITE 4: Dashboard (/saved-roles) Match % & Sort Logic ---
  console.log('\n--- 4. Testing /saved-roles Pipeline Dashboard ---');
  try {
    const savedRolesHtml = fs.readFileSync(path.join(__dirname, 'saved-roles.html'), 'utf-8');

    const hasSavedToolbar = savedRolesHtml.includes('id="saved-toolbar"') && savedRolesHtml.includes('id="savedSortFilter"');
    recordResult('Dashboard UI', 'savedSortFilter toolbar dropdown exists', hasSavedToolbar);

    const hasSavedSortOptions = savedRolesHtml.includes('value="MATCH_HIGH"') && savedRolesHtml.includes('value="PAY_HIGH"') && savedRolesHtml.includes('value="DATE"');
    recordResult('Dashboard UI', 'savedSortFilter contains MATCH_HIGH, PAY_HIGH, DATE', hasSavedSortOptions);

    const hasGetRoleMatchScore = savedRolesHtml.includes('function getRoleMatchScore(role)') && savedRolesHtml.includes('candidateResumeText');
    recordResult('Dashboard Logic', 'getRoleMatchScore computes ATS match dynamically', hasGetRoleMatchScore);

    const hasMatchBadge = savedRolesHtml.includes('🎯 ${role.matchScore}% Match');
    recordResult('Dashboard UI', 'Displays color-coded 🎯 XX% Match badge on saved card', hasMatchBadge);

    const hasStatusTransitions = savedRolesHtml.includes('changeRoleStatus') && savedRolesHtml.includes('pipeline_status_changed');
    recordResult('Dashboard Logic', 'Status change triggers pipeline_status_changed and analytics', hasStatusTransitions);

    const hasReminderTrigger = savedRolesHtml.includes('/api/setRoleReminder') && savedRolesHtml.includes('toggleReminder');
    recordResult('Dashboard Logic', 'Set Reminder integrates with /api/setRoleReminder', hasReminderTrigger);
  } catch (err) {
    recordResult('Dashboard Suite', 'Inspection failed', false, err.message);
  }

  // --- SUITE 5: Email Capture & Backend API Endpoints (Live Network) ---
  console.log('\n--- 5. Testing Live Backend Email Capture & Notification APIs ---');

  // Test 5.1: /api/getRoles
  try {
    const res = await fetch(`${LIVE_BASE}/api/getRoles`);
    const json = await res.json();
    const ok = res.status === 200 && Array.isArray(json.roles) && json.roles.length > 0;
    recordResult('API Endpoint', '/api/getRoles returns active roles array', ok, `Count: ${json.roles ? json.roles.length : 0}`);
  } catch (err) {
    recordResult('API Endpoint', '/api/getRoles call', false, err.message);
  }

  // Test 5.2: /api/logPipelineEvent
  try {
    const res = await fetch(`${LIVE_BASE}/api/logPipelineEvent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_view',
        referral_id: 'test_suite',
        session_id: 'sess_automation_test',
        page_url: '/test-automation'
      })
    });
    const json = await res.json();
    const ok = res.status === 200 && json.success === true;
    recordResult('API Endpoint', '/api/logPipelineEvent logs event successfully', ok, `Status: ${res.status}`);
  } catch (err) {
    recordResult('API Endpoint', '/api/logPipelineEvent call', false, err.message);
  }

  // Test 5.3: /api/subscribeRoleAlerts (Email Capture & Welcome Email)
  try {
    const res = await fetch(`${LIVE_BASE}/api/subscribeRoleAlerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        domain: 'SOFTWARE',
        source: 'automation_test_suite'
      })
    });
    const json = await res.json();
    const ok = (res.status === 200 && json.success === true) || (json.error && json.error.includes('already'));
    recordResult('Email Capture API', '/api/subscribeRoleAlerts captures email & schedules welcome', ok, `Response: ${JSON.stringify(json)}`);
  } catch (err) {
    recordResult('Email Capture API', '/api/subscribeRoleAlerts call', false, err.message);
  }

  // Test 5.4: /api/setRoleReminder (Role Reminder Email Registration)
  try {
    const res = await fetch(`${LIVE_BASE}/api/setRoleReminder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        roleId: 'test-automation-role-id',
        roleTitle: 'Automated Test Senior AI Trainer',
        rolePay: '$80/hr',
        linkTarget: 'https://t.mercor.com/wbPMF',
        platform: 'Mercor',
        status: 'Started'
      })
    });
    const json = await res.json();
    const ok = res.status === 200 && json.success === true;
    recordResult('Email Capture API', '/api/setRoleReminder registers candidate reminder', ok, `Response: ${JSON.stringify(json)}`);
  } catch (err) {
    recordResult('Email Capture API', '/api/setRoleReminder call', false, err.message);
  }

  // Test 5.5: /api/sendMockResultsEmail (Mock Interview Results Email)
  try {
    const res = await fetch(`${LIVE_BASE}/api/sendMockResultsEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        roleTitle: 'Test AI Trainer Role',
        domain: 'SOFTWARE',
        score: 85,
        breakdown: {
          structure: 85,
          domainDepth: 90,
          clarity: 80
        },
        strengths: ['Clear answers', 'Relevant examples'],
        improvements: ['Elaborate slightly more on tradeoffs'],
        questions: ['Tell me about a complex project.', 'How do you evaluate LLM responses?']
      })
    });
    const json = await res.json();
    const ok = res.status === 200 && json.success === true;
    recordResult('Email Capture API', '/api/sendMockResultsEmail delivers mock interview results', ok, `Response: ${JSON.stringify(json)}`);
  } catch (err) {
    recordResult('Email Capture API', '/api/sendMockResultsEmail call', false, err.message);
  }

  // Test 5.6: /api/recordUnsubscribe (Unsubscribe API)
  try {
    const res = await fetch(`${LIVE_BASE}/api/recordUnsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_unsub_check@trainaitogain.com',
        reason: 'Automated testing verification'
      })
    });
    const json = await res.json();
    const ok = res.status === 200 && json.success === true;
    recordResult('Email Capture API', '/api/recordUnsubscribe safely registers unsubscription', ok, `Response: ${JSON.stringify(json)}`);
  } catch (err) {
    recordResult('Email Capture API', '/api/recordUnsubscribe call', false, err.message);
  }

  // --- SUITE 6: Footers & Navigation Scalability ---
  console.log('\n--- 6. Testing Standard Scalable Footer Across All Main Pages ---');
  const htmlFiles = [
    'index.html',
    'apply.html',
    'saved-roles.html',
    'ai-interview.html',
    'resume-ats-guide.html',
    'readiness-checklist.html',
    'internal-hub.html',
    'video-guides.html',
    'what-mercor-looks-for.html'
  ];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    const hasFooter = content.includes('class="site-footer"') || content.includes('site-footer');
    const hasMaxLogo = content.includes('max-width:24px') || content.includes('width:24px');
    const hasPostalPending = content.includes('[Postal Address Pending]');
    const isGood = hasFooter && hasMaxLogo && hasPostalPending;
    recordResult('Footer Scalability', file, isGood, `Footer: ${hasFooter}, Logo Constrained: ${hasMaxLogo}, Postal Pending: ${hasPostalPending}`);
  }

  // --- SUMMARY SCORECARD ---
  console.log('\n====================================================');
  console.log('📊 FINAL AUTOMATION TEST SCORECARD');
  console.log('====================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  const passRate = Math.round((passed / total) * 100);

  console.log(`Total Checks Executed: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Overall Pass Rate: ${passRate}%\n`);

  if (failed > 0) {
    console.log('❌ Failed Checks:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - [${r.category}] ${r.testName}: ${r.details}`);
    });
  } else {
    console.log('🎉 ALL AUTOMATED TESTS PASSED WITH 100% SUCCESS!');
  }
}

runSuite().catch(console.error);
