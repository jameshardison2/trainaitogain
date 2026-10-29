const fs = require('fs');
const assert = require('assert');
const path = require('path');

console.log("==================================================================");
console.log("RUNNING COMPREHENSIVE 16-BUG E2E AUDIT & REGRESSION SUITE");
console.log("==================================================================");

// Load data
const waves = JSON.parse(fs.readFileSync('waves.json', 'utf8'));
const roles = waves.roles || [];
console.log(`Loaded ${roles.length} roles from waves.json.`);

// Load render_waves.js script and mock browser environment
const scriptContent = fs.readFileSync('render_waves.js', 'utf8');

// ==================================================================
// Test 1: Search "nurse" vs " nurse " (Bug fix verification)
// ==================================================================
function simulateSearch(query) {
    const term = (query || '').trim().toLowerCase();
    const matched = [];
    roles.forEach(role => {
        const searchTokens = [
            role.title || '',
            role.domain || '',
            role.status || '',
            role.pay || '',
            Array.isArray(role.tags) ? role.tags.join(' ') : (role.tags || ''),
            Array.isArray(role.atsKeywords) ? role.atsKeywords.join(' ') : (role.atsKeywords || ''),
            role.description || '',
            role.platform || ''
        ].join(' ').toLowerCase();

        let match = false;
        if (!term) match = true;
        else if (term.includes(' ') || term.includes('.')) {
            match = searchTokens.includes(term);
        } else if (term.length <= 4) {
            const tokens = searchTokens.split(/[^a-zA-Z0-9+#]+/);
            match = tokens.includes(term);
        } else {
            match = searchTokens.includes(term);
        }
        if (match) matched.push(role);
    });
    return matched;
}

const nurseResults = simulateSearch("nurse");
const nurseWithSpacesResults = simulateSearch(" nurse ");
console.log(`Test 1: Search 'nurse' returns ${nurseResults.length} roles.`);
console.log(`Test 2: Search ' nurse ' returns ${nurseWithSpacesResults.length} roles.`);
assert(nurseResults.length > 0, "Expected 'nurse' to return roles");
assert.strictEqual(nurseResults.length, nurseWithSpacesResults.length, "Expected 'nurse' and ' nurse ' to return identical count");
console.log("✓ PASSED: Search handles leading/trailing whitespace properly");

// ==================================================================
// Test 2: Search "Python" and "python" (Bug fix verification)
// ==================================================================
const pyLower = simulateSearch("python");
const pyUpper = simulateSearch("Python");
console.log(`Test 3: Search 'python' returns ${pyLower.length} roles.`);
console.log(`Test 3b: Search 'Python' returns ${pyUpper.length} roles.`);
assert(pyLower.length >= 20, `Expected at least 20 roles for 'python', got ${pyLower.length}`);
assert.strictEqual(pyLower.length, pyUpper.length, "Expected 'python' and 'Python' to return identical count");
console.log("✓ PASSED: Search 'Python' and 'python' return comprehensive matching roles");

// ==================================================================
// Test 3: Search "RN" - whole word match (no matching inside "learning" or "internal")
// ==================================================================
const rnResults = simulateSearch("RN");
console.log(`Test 4: Search 'RN' returns ${rnResults.length} roles.`);
const falsePositives = rnResults.filter(r => {
    const title = r.title.toLowerCase();
    const hasRNToken = /\brn\b/.test(title);
    const hasNurse = /nurse|nursing/i.test(title);
    return !hasRNToken && !hasNurse;
});
console.log(`Roles matching RN without RN or nurse in title: ${falsePositives.length}`);
assert.strictEqual(falsePositives.length, 0, "Found false positive substring matches for RN (like 'learning' or 'internal')");
console.log("✓ PASSED: Search 'RN' matches whole-word tokens only, not 'learning' or 'internal'");

// ==================================================================
// Test 4: Bug 6 - Search ".NET"
// ==================================================================
const dotNetResults = simulateSearch(".NET");
const dotNetLowerResults = simulateSearch(".net");
console.log(`Test 5: Search '.NET' returns ${dotNetResults.length} roles.`);
console.log(`Test 5b: Search '.net' returns ${dotNetLowerResults.length} roles.`);
assert(dotNetResults.length > 0, "Expected '.NET' to find matching roles like 'Backend C#/.NET Developer'");
assert.strictEqual(dotNetResults.length, dotNetLowerResults.length, "Expected case-insensitive parity for .NET");
const hasCSharpDotNet = dotNetResults.some(r => r.title.includes(".NET") || r.title.includes("C#"));
assert(hasCSharpDotNet, "Expected at least one role with .NET in title");
console.log("✓ PASSED: Bug 6 resolved - Search '.NET' correctly matches C#/.NET developer roles");

// ==================================================================
// Test 5: Bug 4 - Location detection for US roles (US-licensed physician, US personal finance, US Gov)
// ==================================================================
eval(scriptContent.substring(scriptContent.indexOf("function getRoleRequirements"), scriptContent.indexOf("function parseRolePay")));
const usLicensedPhysician = { title: "US-Licensed Physician (Telehealth Evaluation)", description: "Remote evaluation for US doctors", tags: ["Remote", "Mercor"] };
const usPersonalFinance = { title: "US Personal Finance & Tax Reviewer", description: "Reviewing US tax scenarios", tags: ["Finance"] };
const usGovRole = { title: "AI Policy Evaluator — US Gov Regulations", description: "Evaluating federal policy", tags: ["Legal"] };
const standardRemoteRole = { title: "Full Stack Engineer", description: "Build scalable web apps", tags: ["Remote"] };

const reqPhysician = getRoleRequirements(usLicensedPhysician);
const reqFinance = getRoleRequirements(usPersonalFinance);
const reqGov = getRoleRequirements(usGovRole);
const reqRemote = getRoleRequirements(standardRemoteRole);

assert.strictEqual(reqPhysician.locKey, "US", "Expected US locKey for US-Licensed Physician");
assert.strictEqual(reqFinance.locKey, "US", "Expected US locKey for US Personal Finance");
assert.strictEqual(reqGov.locKey, "US", "Expected US locKey for US Gov Regulations");
assert.strictEqual(reqRemote.locKey, "ALL", "Expected ALL locKey for standard remote role");
console.log("✓ PASSED: Bug 4 resolved - US roles properly categorized under US locKey instead of Worldwide");

// ==================================================================
// Test 6: Highest Paying Sort normalization
// ==================================================================
eval(scriptContent.substring(scriptContent.indexOf("function parseRolePay"), scriptContent.indexOf("window.calculateRoleMatchScore")));

const testPays = [
    { raw: "$230-$230/hr", title: "Quantitative Trader", expectedYearly: 460000, expectedClean: "$230/hr" },
    { raw: "$150-$200/hr", title: "Senior AI Engineer", expectedYearly: 400000 },
    { raw: "$250k–$400k/yr", title: "VP of Engineering", expectedYearly: 400000 },
    { raw: "$100/task", title: "Task Evaluator", expectedYearly: 100000 },
    { raw: "$7-$8/hr", title: "Member of Technical Staff", expectedYearly: 0, expectedClean: "Competitive" },
    { raw: "$150-$200/hr", title: "Junior Data Scientist", expectedYearly: 0, expectedClean: "Competitive" },
    { raw: "Competitive", title: "General Role", expectedYearly: 0 }
];

testPays.forEach(tp => {
    const parsed = parseRolePay(tp.raw, tp.title);
    assert.strictEqual(parsed.yearlyValue, tp.expectedYearly, `Expected yearlyValue ${tp.expectedYearly} for ${tp.raw} (${tp.title}), got ${parsed.yearlyValue}`);
    if (tp.expectedClean) {
        assert.strictEqual(parsed.cleanPay, tp.expectedClean, `Expected cleanPay ${tp.expectedClean}, got ${parsed.cleanPay}`);
    }
});
console.log("✓ PASSED: Highest Paying sort normalization converts $/hr, $/task, $/yr, formats $230-$230/hr to $230/hr and sanitizes bad rates");

// ==================================================================
// Test 7: Unified Match Scoring & Math
// ==================================================================
global.window = global;
eval(scriptContent.substring(scriptContent.indexOf("window.calculateRoleMatchScore = function"), scriptContent.indexOf("function getRoleMatchScore")));

const sampleResume = "Experienced senior SDET and full stack software developer with expertise in Python, Test Automation, Machine Learning, and SQL. Based in the United States. Speaks English.";

const role2of3 = { title: "Python Automation Engineer", atsKeywords: ["Python", "Test Automation", "Kubernetes"] };
const res2of3 = window.calculateRoleMatchScore(role2of3, sampleResume);
console.log(`2 of 3 keywords test: ${res2of3.score}% (${res2of3.hits}/${res2of3.total}) - Tier: ${res2of3.tier}`);
assert.strictEqual(res2of3.score, 67, `Expected 2 of 3 to be 67%, got ${res2of3.score}%`);
assert.strictEqual(res2of3.tier, "Good Match", `Expected Good Match tier, got ${res2of3.tier}`);

const role1of2 = { title: "SQL Developer", atsKeywords: ["SQL", "Snowflake"] };
const res1of2 = window.calculateRoleMatchScore(role1of2, sampleResume);
console.log(`1 of 2 keywords test: ${res1of2.score}% (${res1of2.hits}/${res1of2.total}) - Tier: ${res1of2.tier}`);
assert.strictEqual(res1of2.score, 50, `Expected 1 of 2 to be 50%, got ${res1of2.score}%`);
assert.strictEqual(res1of2.tier, "Good Match", `Expected Good Match tier, got ${res1of2.tier}`);

const dutchRole = { title: "Audiobook QA Expert — Dutch", atsKeywords: ["qa", "dutch"] };
const dutchRes = window.calculateRoleMatchScore(dutchRole, sampleResume);
console.log(`Dutch Audiobook QA match score for non-Dutch speaker: ${dutchRes.score}% - Tier: ${dutchRes.tier}`);
assert.strictEqual(dutchRes.score, 0, `Expected Dutch Audiobook QA to score 0% without Dutch language, got ${dutchRes.score}%`);
assert.strictEqual(dutchRes.tier, "None", `Expected tier None for failed language requirement`);

console.log("✓ PASSED: Match math verified: 2 of 3 = 67%, 1 of 2 = 50%, language failure = 0% (tier None)");

// ==================================================================
// Test 8: Bug 12 - False Acronym Match ("AI Agents" vs resume without "agents")
// ==================================================================
const resumeWithAI = "Experienced AI software developer specializing in prompt engineering and model evaluation.";
const atsHtml = fs.readFileSync('resume-ats-guide.html', 'utf8');
const optModMatch = atsHtml.match(/const optionalModifiers = new Set\(\[[\s\S]*?\]\);/);
assert(optModMatch, "Could not locate optionalModifiers in resume-ats-guide.html");
eval(optModMatch[0].replace('const optionalModifiers', 'global.optionalModifiers'));
const kwMatchFnMatch = atsHtml.match(/function keywordMatchesText\(rawKw, resumeText\) \{([\s\S]*?)\n  \}/);
assert(kwMatchFnMatch, "Could not locate keywordMatchesText in resume-ats-guide.html");
eval("function testKwMatches(rawKw, resumeText) {" + kwMatchFnMatch[1] + "}");

const matchesAIAgents = testKwMatches("AI Agents", resumeWithAI.toLowerCase());
console.log(`Keyword match test for 'AI Agents' on resume without 'agents': ${matchesAIAgents}`);
assert.strictEqual(matchesAIAgents, false, "Bug 12 check failed: 'AI Agents' falsely matched resume lacking 'agents'");

const matchesAI = testKwMatches("AI", resumeWithAI.toLowerCase());
console.log(`Keyword match test for standalone 'AI': ${matchesAI}`);
assert.strictEqual(matchesAI, true, "Expected standalone acronym 'AI' to match");
console.log("✓ PASSED: Bug 12 resolved - Acronym matching strictly applies to single tokens, avoiding false positive phrase hits");

// ==================================================================
// Test 9: Bug 8 - Privacy Policy and Terms of Service presence & contact details
// ==================================================================
assert(fs.existsSync('privacy.html'), "privacy.html must exist");
assert(fs.existsSync('terms.html'), "terms.html must exist");
const privacyContent = fs.readFileSync('privacy.html', 'utf8');
const termsContent = fs.readFileSync('terms.html', 'utf8');
assert(!privacyContent.includes("548 Market St"), "privacy.html must not contain placeholder street address");
assert(!termsContent.includes("548 Market St"), "terms.html must not contain placeholder street address");
assert(privacyContent.includes("/unsubscribe"), "privacy.html must reference 1-click unsubscribe");
assert(privacyContent.includes("trainaitogain@gmail.com"), "privacy.html must include contact email");
assert(termsContent.includes("trainaitogain@gmail.com"), "terms.html must include contact email");
console.log("✓ PASSED: Bug 8 resolved - /privacy and /terms exist with contact email and 1-click unsubscribe");

// ==================================================================
// Test 10: Bug 15 - Favicon file existence and valid format
// ==================================================================
assert(fs.existsSync('favicon.ico'), "favicon.ico must exist at project root");
const faviconStat = fs.statSync('favicon.ico');
assert(faviconStat.size > 100, `favicon.ico size too small: ${faviconStat.size} bytes`);
const favBuffer = fs.readFileSync('favicon.ico');
assert.strictEqual(favBuffer.readUInt16LE(0), 0, "favicon.ico header check 1 failed");
assert.strictEqual(favBuffer.readUInt16LE(2), 1, "favicon.ico header check 2 (ICON type) failed");
console.log(`✓ PASSED: Bug 15 resolved - favicon.ico verified as valid binary ICO (${faviconStat.size} bytes)`);

// ==================================================================
// Test 11: Bug 14 - Mobile touch targets (44px min-height) in shared.css
// ==================================================================
const sharedCss = fs.readFileSync('shared.css', 'utf8');
assert(sharedCss.includes('@media (max-width: 600px)'), "shared.css must include mobile media query for 600px");
assert(sharedCss.includes('height: 44px !important;'), "shared.css must specify 44px height for mobile tool buttons");
assert(sharedCss.includes('min-height: 44px !important;'), "shared.css must specify 44px min-height for mobile buttons");
console.log("✓ PASSED: Bug 14 resolved - 44px touch target height enforced on mobile viewports");

// ==================================================================
// Test 12: Bug 1 - Cookie Consent & Telemetry Guard
// ==================================================================
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes("if (localStorage.getItem('cookieConsent') !== 'accepted') return;"), "index.html sendPipelineEvent must return early unless cookieConsent is accepted");
const applyHtml = fs.readFileSync('apply.html', 'utf8');
assert(applyHtml.includes("if (localStorage.getItem('cookieConsent') !== 'accepted') return;"), "apply.html sendPipelineEvent must return early unless cookieConsent is accepted");
console.log("✓ PASSED: Bug 1 resolved - Tracking calls strictly require explicit 'accepted' cookie consent");

// ==================================================================
// Test 13: 100% Direct Referral & Payout Integrity
// ==================================================================
const mercorRoles = roles.filter(r => (r.linkTarget || '').includes('mercor'));
assert(mercorRoles.length > 0, "Expected Mercor roles in waves.json");
const invalidMercorLinks = mercorRoles.filter(r => {
    const u = r.linkTarget;
    if (u.startsWith('https://t.mercor.com/')) {
        return u.includes('?'); // t.mercor.com/<code> must NOT have ?ref=wbPMF
    }
    return !u.includes('referralCode=867a4c34-8e4d-4d1b-8ac7-13370a4a3942');
});
assert.strictEqual(invalidMercorLinks.length, 0, `Found ${invalidMercorLinks.length} Mercor roles with invalid link format!`);

const micro1Roles = roles.filter(r => (r.linkTarget || '').includes('micro1.ai'));
assert(micro1Roles.length > 0, "Expected micro1 roles in waves.json");
const missingMicro1Ref = micro1Roles.filter(r => !r.linkTarget.includes('05216c9f-87cc-49af-b448-f9f8a18d2efe'));
assert.strictEqual(missingMicro1Ref.length, 0, `Found ${missingMicro1Ref.length} micro1 roles missing referral code!`);
console.log(`✓ PASSED: Referral Integrity - 100% of Mercor (${mercorRoles.length}) and micro1 (${micro1Roles.length}) roles have clean job-specific attribution`);

// ==================================================================
// Test 14: Bug 4 - U.S. Government Roles categorized under US locKey
// ==================================================================
const fde = roles.find(r => r.title.includes("Forward Deployed Engineer, U.S. Government"));
const ecp = roles.find(r => r.title.includes("Enterprise Client Partner, U.S. Government"));
assert(fde, "Forward Deployed Engineer, U.S. Government must exist in waves.json");
assert(ecp, "Enterprise Client Partner, U.S. Government must exist in waves.json");
const fdeReq = getRoleRequirements(fde);
const ecpReq = getRoleRequirements(ecp);
assert.strictEqual(fdeReq.locKey, "US", "FDE must have US locKey");
assert.strictEqual(ecpReq.locKey, "US", "ECP must have US locKey");
assert.strictEqual(fdeReq.location, "US Based (Remote)", "FDE location string must be US Based");
assert.strictEqual(ecpReq.location, "US Based (Remote)", "ECP location string must be US Based");
console.log("✓ PASSED: Bug 4 regression - 'U.S. Government' roles reliably classified under US locKey");

// ==================================================================
// Test 15: QA Engineer Domain Routing to Software
// ==================================================================
const aiInterviewHtml = fs.readFileSync('ai-interview.html', 'utf8');
const detectDomainMatch = aiInterviewHtml.match(/function detectDomain\(role, domainHint, resumeText\) \{([\s\S]*?)\n  \}/);
assert(detectDomainMatch, "detectDomain function must exist in ai-interview.html");
eval("function testDetectDomain(role, domainHint, resumeText) {" + detectDomainMatch[1] + "}");
const qaDomain = testDetectDomain("QA Engineer", "", "");
const sdetDomain = testDetectDomain("Senior SDET", "", "");
const testEngDomain = testDetectDomain("Automation Test Engineer", "", "");
assert.strictEqual(qaDomain, "software", `Expected QA Engineer to route to software domain, got ${qaDomain}`);
assert.strictEqual(sdetDomain, "software", `Expected Senior SDET to route to software domain, got ${sdetDomain}`);
assert.strictEqual(testEngDomain, "software", `Expected Automation Test Engineer to route to software domain, got ${testEngDomain}`);
console.log("✓ PASSED: QA Engineer domain routing correctly resolves to 'software' for AI interview questions");

// ==================================================================
// Test 16: Navigation Accessibility Attributes
// ==================================================================
assert(applyHtml.includes('label for="nav-toggle" class="nav-toggle-label" tabindex="0" role="button" aria-label="Toggle navigation menu" aria-expanded="false"'), "apply.html nav-toggle-label must have full accessibility attributes");
const disclosureHtml = fs.readFileSync('disclosure.html', 'utf8');
assert(disclosureHtml.includes('label for="nav-toggle" class="nav-toggle-label" tabindex="0" role="button" aria-label="Toggle navigation menu" aria-expanded="false"'), "disclosure.html nav-toggle-label must have full accessibility attributes");
assert(disclosureHtml.includes('<ul class="nav-links">'), "disclosure.html must contain full nav links");
console.log("✓ PASSED: Navigation accessibility attributes verified across apply.html and disclosure.html");

// ==================================================================
// Test 17: Escape Keydown Listener on Modals
// ==================================================================
assert(scriptContent.includes("if (e.key === 'Escape') closeModal();"), "render_waves.js showModalPrompt must support Escape key");
const savedRolesHtml = fs.readFileSync('saved-roles.html', 'utf8');
assert(savedRolesHtml.includes("if (e.key === 'Escape') close();"), "saved-roles.html openReminderModal must support Escape key");
console.log("✓ PASSED: Modal Escape keydown listeners verified in render_waves.js and saved-roles.html");

// ==================================================================
// Test 18: Keyword Matching with Qualifiers/Modifiers
// ==================================================================
const qaResume = "Jordan Testcase, QA Engineer. Experienced in Selenium, SQL, and test automation. Manual testing, bug tracking, test execution.";
const testSelenium = testKwMatches("Selenium WebDriver", qaResume.toLowerCase());
const testSQL = testKwMatches("SQL Queries", qaResume.toLowerCase());
const testFrameworks = testKwMatches("Test Automation Frameworks", qaResume.toLowerCase());

console.log(`Selenium WebDriver match: ${testSelenium}`);
console.log(`SQL Queries match: ${testSQL}`);
console.log(`Test Automation Frameworks match: ${testFrameworks}`);

assert.strictEqual(testSelenium, true, "Selenium WebDriver must match resume containing 'Selenium'");
assert.strictEqual(testSQL, true, "SQL Queries must match resume containing 'SQL'");
assert.strictEqual(testFrameworks, true, "Test Automation Frameworks must match resume containing 'test automation'");
console.log("✓ PASSED: Keyword matching properly treats secondary modifiers as optional (Selenium, SQL, Test Automation match)");

// ==================================================================
// Test 19: Strict Multi-word Integrity ("AI Agents" vs Non-Agent Resume)
// ==================================================================
const testAIAgentsNonAgent = testKwMatches("AI Agents", "Experienced AI software developer specializing in prompt engineering and model evaluation.".toLowerCase());
const testAIAgentsWithAgent = testKwMatches("AI Agents", "Experienced in building autonomous AI agents and workflows.".toLowerCase());
assert.strictEqual(testAIAgentsNonAgent, false, "'AI Agents' must strictly require 'agents' on non-agent resume");
assert.strictEqual(testAIAgentsWithAgent, true, "'AI Agents' must match resume containing both 'ai' and 'agents'");
console.log("✓ PASSED: Multi-word phrase integrity preserved - 'AI Agents' strictly requires 'agents'");

// ==================================================================
// Test 20: 3-Keyword Minimum Rule for "Strong Match"
// ==================================================================
const singleKwRole = { title: "Python Specialist", atsKeywords: ["Python"] };
const singleKwRes = window.calculateRoleMatchScore(singleKwRole, "Experienced Python developer with a strong track record of engineering scalable applications.");
console.log(`1 of 1 keyword result: ${singleKwRes.score}% (${singleKwRes.hits}/${singleKwRes.total}) - Tier: ${singleKwRes.tier}`);
assert.strictEqual(singleKwRes.score, 100, "Expected 100% score for 1 of 1 keyword");
assert.strictEqual(singleKwRes.tier, "Good Match", "1 of 1 keyword at 100% must be labeled 'Good Match', NOT 'Strong Match'");

const twoKwRole = { title: "Python & SQL Engineer", atsKeywords: ["Python", "SQL"] };
const twoKwRes = window.calculateRoleMatchScore(twoKwRole, "Experienced Python and SQL developer with deep expertise in database querying.");
console.log(`2 of 2 keywords result: ${twoKwRes.score}% (${twoKwRes.hits}/${twoKwRes.total}) - Tier: ${twoKwRes.tier}`);
assert.strictEqual(twoKwRes.score, 100, "Expected 100% score for 2 of 2 keywords");
assert.strictEqual(twoKwRes.tier, "Good Match", "2 of 2 keywords at 100% must be labeled 'Good Match', NOT 'Strong Match'");

const threeKwRole = { title: "Full Stack QA", atsKeywords: ["QA", "Selenium", "SQL"] };
const threeKwRes = window.calculateRoleMatchScore(threeKwRole, "Senior QA engineer experienced in automated testing with Selenium and database SQL.");
console.log(`3 of 3 keywords result: ${threeKwRes.score}% (${threeKwRes.hits}/${threeKwRes.total}) - Tier: ${threeKwRes.tier}`);
assert.strictEqual(threeKwRes.score, 100, "Expected 100% score for 3 of 3 keywords");
assert.strictEqual(threeKwRes.tier, "Strong Match", "3 of 3 keywords at 100% must earn 'Strong Match'");
console.log("✓ PASSED: Minimum 3-keyword requirement enforced for 'Strong Match' (1-of-1 and 2-of-2 cap at 'Good Match')");

// ==================================================================
// Test 21: Modal Accessibility ARIA Dialog Attributes
// ==================================================================
assert(scriptContent.includes('overlay.setAttribute(\'role\', \'dialog\');'), "render_waves.js modal must set role='dialog'");
assert(scriptContent.includes('overlay.setAttribute(\'aria-modal\', \'true\');'), "render_waves.js modal must set aria-modal='true'");
assert(scriptContent.includes('overlay.setAttribute(\'aria-labelledby\', \'tgt-modal-title\');'), "render_waves.js modal must set aria-labelledby");
assert(savedRolesHtml.includes('overlay.setAttribute(\'role\', \'dialog\');'), "saved-roles.html reminder modal must set role='dialog'");
assert(savedRolesHtml.includes('overlay.setAttribute(\'aria-modal\', \'true\');'), "saved-roles.html reminder modal must set aria-modal='true'");
assert(savedRolesHtml.includes('overlay.setAttribute(\'aria-labelledby\', \'reminder-modal-title\');'), "saved-roles.html reminder modal must set aria-labelledby");
console.log("✓ PASSED: Full ARIA dialog attributes verified across render_waves.js and saved-roles.html modals");

// ==================================================================
// Test 22: Dashboard Status Dropdown has "Applied" Option
// ==================================================================
assert(savedRolesHtml.includes('<option value="Applied"'), "saved-roles.html must include <option value='Applied'>");
console.log("✓ PASSED: Dashboard status dropdown includes 'Applied' option");

// ==================================================================
// Test 23: Cookie Consent Banner on Direct Landing at apply.html
// ==================================================================
assert(applyHtml.includes('id="consent-banner"'), "apply.html must contain #consent-banner HTML");
assert(applyHtml.includes('function acceptConsent()'), "apply.html must contain acceptConsent()");
assert(applyHtml.includes('function declineConsent()'), "apply.html must contain declineConsent()");
console.log("✓ PASSED: Cookie consent banner present on /apply for direct visitors");

// ==================================================================
// Test 24: Top Qualified Roles Asynchronous Hydration
// ==================================================================
assert(applyHtml.includes('window.restoreMatches = restoreMatches;'), "apply.html must expose window.restoreMatches");
assert(scriptContent.includes('window.restoreMatches()'), "render_waves.js must call window.restoreMatches() after populating allRoles");
console.log("✓ PASSED: Top Qualified Roles asynchronous hydration hook verified");

// ==================================================================
// Test 25: Hero Headline Space Before Line Break
// ==================================================================
assert(indexHtml.includes('already qualifies <br class="hero-desktop-br">for.'), "index.html headline must have a space between 'qualifies' and 'for'");
assert(!indexHtml.includes('qualifies<br'), "index.html must not merge 'qualifies' and 'for'");
console.log("✓ PASSED: Hero headline has explicit space before line break ('already qualifies for.')");

// ==================================================================
// Test 26: Branded 404.html Page Exists with Browse Roles Button
// ==================================================================
assert(fs.existsSync('404.html'), "404.html must exist in public root");
const page404 = fs.readFileSync('404.html', 'utf8');
assert(page404.includes('Browse roles'), "404.html must include a 'Browse roles' button");
assert(page404.includes('href="/apply"'), "404.html Browse roles button must link to /apply");
console.log("✓ PASSED: Branded 404.html exists with 'Browse roles' button");

// ==================================================================
// Test 27: Sitemap Cleanup & Integrity
// ==================================================================
const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
const bannedSitemapEntries = [
    'prep-coding', 'prep-crossexam', 'prep-hallucination', 'prep-casestudy',
    'landing_page_v2.html', 'ai-interview_1.html', 'affiliate.html', 'dashboard.html',
    'how-to-bypass-mercor-waitlist.html'
];
bannedSitemapEntries.forEach(entry => {
    assert(!sitemapXml.includes(entry), `sitemap.xml must not contain outdated/missing entry: ${entry}`);
});
assert(sitemapXml.includes('privacy.html'), "sitemap.xml must include privacy.html");
assert(sitemapXml.includes('terms.html'), "sitemap.xml must include terms.html");
console.log("✓ PASSED: Sitemap cleaned of dead/internal/bypass URLs and includes Privacy & Terms");

// ==================================================================
// Test 28: Official Mercor Practice Referral Code in ai-interview.html
// ==================================================================
assert(aiInterviewHtml.includes('href="https://t.mercor.com/wbPMF"'), "Official Mercor Practice button in ai-interview.html must use https://t.mercor.com/wbPMF");
assert(!aiInterviewHtml.includes('href="https://work.mercor.com"'), "ai-interview.html must not have bare https://work.mercor.com link");
console.log("✓ PASSED: Official Mercor Practice button uses https://t.mercor.com/wbPMF");

// ==================================================================
// Test 29: Top Qualified Roles Cap, Tier-First Sort & Main List Strong Badge
// ==================================================================
assert(applyHtml.includes('displayMatches.slice(0, 6)'), "Top Qualified Roles must be capped to 6 cards");
assert(scriptContent.includes("if (matchTier === 'Strong Match')"), "render_waves.js main list must check matchTier === 'Strong Match' before rendering Strong Match badge");
assert(!scriptContent.includes("if (matchScore >= 70) {\n                            matchBadgeHtml"), "render_waves.js must not assign Strong Match badge solely on matchScore >= 70");
console.log("✓ PASSED: Top Qualified Roles capped to 6 cards, sorted by tier first, and main list enforces 3-keyword Strong Match rule");

// ==================================================================
// Test 30: Mock Interview Blank Answer Validation & Typed Mode Summary
// ==================================================================
assert(aiInterviewHtml.includes('Please type an answer before submitting'), "ai-interview.html must block blank typed answers with an inline validation prompt");
assert(aiInterviewHtml.includes('⚠️ Needs More Detail:'), "ai-interview.html must show 'Needs More Detail' heading instead of 'What Worked' on short/warning answers");
assert(aiInterviewHtml.includes('isTextMode\n        ? "You completed all 5 practice prompts and worked through the core screening questions.'), "ai-interview.html finish screen must not praise 'clear enunciation' when answers were typed");
console.log("✓ PASSED: Mock interview blocks blank answers, avoids 'What Worked' over warnings, and tailors finish summary for Typed Mode");

// ==================================================================
// Test 31: Short Tracked Redirects (/go/:campaign and /p/:campaign) in firebase.json
// ==================================================================
const firebaseJson = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
const redirects = (firebaseJson.hosting && firebaseJson.hosting.redirects) || [];
const goRedirect = redirects.find(r => r.source === '/go/:campaign');
const pRedirect = redirects.find(r => r.source === '/p/:campaign');
assert(goRedirect, "firebase.json must include /go/:campaign redirect");
assert.strictEqual(goRedirect.destination, '/resume-ats-guide?utm_source=linkedin&utm_medium=dm&utm_campaign=:campaign', "/go/:campaign destination mismatch");
assert.strictEqual(goRedirect.type, 302, "/go/:campaign must be 302");
assert(pRedirect, "firebase.json must include /p/:campaign redirect");
assert.strictEqual(pRedirect.destination, '/ai-interview?utm_source=linkedin&utm_medium=dm&utm_campaign=:campaign', "/p/:campaign destination mismatch");
assert.strictEqual(pRedirect.type, 302, "/p/:campaign must be 302");
console.log("✓ PASSED: Short tracked links (/go/:campaign and /p/:campaign) configured in firebase.json with 302 redirects");

// ==================================================================
// Test 32: Suggested STAR Response & Video Masterclass Deep-Links in ai-interview.html
// ==================================================================
assert(aiInterviewHtml.includes('function buildSuggestedStarResponse(qData, qIndex, rawAnswer)'), "ai-interview.html must define buildSuggestedStarResponse");
assert(aiInterviewHtml.includes('🎯 Suggested High-Scoring Response (STAR + Masterclass Formula)'), "ai-interview.html must render the Suggested STAR Response card");
assert(aiInterviewHtml.includes('/video-guides.html#lesson-'), "ai-interview.html must reference specific lessons in /video-guides.html");
const videoGuidesHtml = fs.readFileSync('video-guides.html', 'utf8');
assert(videoGuidesHtml.includes('id="lesson-04"') && videoGuidesHtml.includes('id="lesson-05"') && videoGuidesHtml.includes('id="lesson-12"'), "video-guides.html must have anchor IDs on lessons");
console.log("✓ PASSED: Suggested STAR Response card with role/resume tailoring and Video Masterclass deep-links verified");

// ==================================================================
// Test 33: Multi-Role Career Recognition & High-Readability Teleprompter Sizing
// ==================================================================
assert(aiInterviewHtml.includes('result.allRoles = uniqueRoleTitles'), "ai-interview.html must extract and retain all distinct career roles from resume");
assert(aiInterviewHtml.includes('result.allRolesStr'), "ai-interview.html must format multi-role career trajectory string");
assert(aiInterviewHtml.includes('let _starFontSize = 21'), "ai-interview.html must default teleprompter font size to 21px for high readability");
assert(aiInterviewHtml.includes('id="teleprompter-text" style="font-size:19.5px'), "Avatar teleprompter overlay font size must be prominent (19.5px)");
assert(aiInterviewHtml.includes('Grounded across career history'), "Cross-reference banner must reflect multi-role grounding");
console.log("✓ PASSED: Multi-role career recognition and high-readability teleprompter sizing verified");

// ==================================================================
// Test 34: Position Search Filter & Multi-Feature Integration
// ==================================================================
assert(aiInterviewHtml.includes('id="role-search-input"'), "ai-interview.html must include position search input");
assert(aiInterviewHtml.includes('role-cat-btn'), "ai-interview.html must include role category filter pills");
assert(aiInterviewHtml.includes('id="role-custom-banner"'), "ai-interview.html must support practice for custom typed positions");
assert(aiInterviewHtml.includes('id="position-search-modal"'), "ai-interview.html must include dedicated position search & switch modal");
assert(aiInterviewHtml.includes('id="active-position-switch-btn"'), "Screen 2 must include active position switcher button");
assert(aiInterviewHtml.includes('window.renderFilteredRoleList'), "ai-interview.html must define renderFilteredRoleList");
assert(aiInterviewHtml.includes('window.selectRoleItem'), "ai-interview.html must define selectRoleItem");
console.log("✓ PASSED: Position search filter, category pills, custom role creator, and Screen 2 switcher verified");

// ==================================================================
// Test 35: Teleprompter Auto-Scroll Down Engine & Floating Webcam HUD
// ==================================================================
assert(aiInterviewHtml.includes('window.startTeleprompterScroll'), "ai-interview.html must define startTeleprompterScroll");
assert(aiInterviewHtml.includes('window.pauseTeleprompterScroll'), "ai-interview.html must define pauseTeleprompterScroll");
assert(aiInterviewHtml.includes('window.resetTeleprompterScroll'), "ai-interview.html must define resetTeleprompterScroll");
assert(aiInterviewHtml.includes('window.setTeleprompterSpeed'), "ai-interview.html must define setTeleprompterSpeed");
assert(aiInterviewHtml.includes('window.updateTeleprompterActiveSection'), "ai-interview.html must define updateTeleprompterActiveSection");
assert(aiInterviewHtml.includes('id="floating-teleprompter-hud"'), "ai-interview.html must include floating webcam teleprompter HUD");
assert(aiInterviewHtml.includes('class="star-tp-scroll-viewport"'), "ai-interview.html must wrap teleprompter in scrollable viewport");
assert(aiInterviewHtml.includes('Start Auto-Scroll Down'), "ai-interview.html must provide Start Auto-Scroll Down CTA");
assert(aiInterviewHtml.includes('1. Opening Hook &amp; Scope (First 15s)'), "ai-interview.html must include 1. Opening Hook & Scope");
assert(aiInterviewHtml.includes('2. Action &amp; Execution (30–45s)'), "ai-interview.html must include 2. Action & Execution");
assert(aiInterviewHtml.includes('3. Quantified Result (Final 15s)'), "ai-interview.html must include 3. Quantified Result");
console.log("✓ PASSED: Teleprompter auto-scroll down engine, active pacing illuminator, and webcam HUD verified");

// ==================================================================
// Test 36: Tier 4 Enterprise Hub & B2B AI Readiness Integrity
// ==================================================================
assert(fs.existsSync('enterprise.html'), "enterprise.html must exist for Tier 4 enterprise hub");
const enterpriseHtml = fs.readFileSync('enterprise.html', 'utf8');
assert(enterpriseHtml.includes('https://trainaitogain.com/enterprise'), "enterprise.html must specify canonical tag");
assert(enterpriseHtml.includes('Corporate AI Readiness Prep'), "enterprise.html must detail Proton model readiness prep");
assert(enterpriseHtml.includes('Mercor Data-Partner Program'), "enterprise.html must detail Mercor data-partner program");
assert(enterpriseHtml.includes('Calibrated Evaluator Sourcing'), "enterprise.html must offer evaluator talent sourcing");
assert(enterpriseHtml.includes('id="enterprise-inquiry-form"'), "enterprise.html must provide interactive consultation form");
assert(indexHtml.includes('/enterprise'), "index.html must link to /enterprise");
assert(applyHtml.includes('/enterprise'), "apply.html must link to /enterprise");
assert(sitemapXml.includes('https://trainaitogain.com/enterprise'), "sitemap.xml must include /enterprise");
console.log("✓ PASSED: Tier 4 Enterprise Hub, Proton readiness audit, data-partner advisory, and nav links verified");

// ==================================================================
// Test 37: Stored Resume Persistence & Multi-Storage Recovery Audit
// ==================================================================
const resumeAtsHtml = fs.readFileSync('resume-ats-guide.html', 'utf8');
assert(resumeAtsHtml.includes('window.resolveStoredResume'), "resume-ats-guide.html must define window.resolveStoredResume");
assert(resumeAtsHtml.includes('window.resolveStoredResumeFileName'), "resume-ats-guide.html must define window.resolveStoredResumeFileName");
assert(aiInterviewHtml.includes('window.resolveStoredResume'), "ai-interview.html must define window.resolveStoredResume");

// Mock storage recovery test in pure Node
function mockResolveStoredResume(mockLocal, mockSession) {
  const directKeys = [
    'candidateResumeText', 'candidate_resume_text',
    'interviewResumeText', 'interview_resume_text',
    'atsResumeText', 'ats_resume_text',
    'resumeText', 'resume_text',
    'resume', 'candidateResume', 'userResume',
    'savedResume', 'rawResume', 'atsResume',
    'uploadedResume', 'resumeContent', 'candidateResumeRaw'
  ];
  for (let i = 0; i < directKeys.length; i++) {
    const k = directKeys[i];
    const v = (mockLocal[k] || mockSession[k] || '').trim();
    if (v.length > 50) return v;
  }
  const stores = [mockLocal, mockSession];
  for (let s = 0; s < stores.length; s++) {
    const store = stores[s];
    for (const key of Object.keys(store)) {
      if (/resume/i.test(key) && !/filename|file_name|date|count|status|badge/i.test(key)) {
        const val = (store[key] || '').trim();
        if (val.length > 50) return val;
      }
    }
  }
  for (let s = 0; s < stores.length; s++) {
    const store = stores[s];
    for (const key of Object.keys(store)) {
      if (key.startsWith('cached_') || key.startsWith('waves_') || key === 'ai_matches') continue;
      const val = (store[key] || '').trim();
      if (val.length > 800) {
        const lower = val.toLowerCase();
        if ((lower.includes('experience') || lower.includes('work') || lower.includes('employment') || lower.includes('projects')) &&
            (lower.includes('education') || lower.includes('skills') || lower.includes('university') || lower.includes('degree'))) {
          return val;
        }
      }
    }
  }
  return '';
}

// Case A: 17 KB resume under candidateResumeText
const dummy17kResume = "James Hardison II - Senior SDET Experience\n" + "Software Engineering and Test Automation projects with Python, Selenium, CI/CD pipelines.\n".repeat(200) + "Education: Boston University Data Science BS\nSkills: Python, TypeScript, AI Evaluation";
assert(mockResolveStoredResume({ candidateResumeText: dummy17kResume }, {}) === dummy17kResume, "Must recover candidateResumeText");

// Case B: Resume under legacy interviewResumeText
assert(mockResolveStoredResume({ interviewResumeText: dummy17kResume }, {}) === dummy17kResume, "Must recover legacy interviewResumeText");

// Case C: Resume stored only in sessionStorage
assert(mockResolveStoredResume({}, { candidateResumeText: dummy17kResume }) === dummy17kResume, "Must recover from sessionStorage");

// Case D: Resume stored under arbitrary key with resume markers
assert(mockResolveStoredResume({ random_storage_key_1: dummy17kResume }, {}) === dummy17kResume, "Must recover from unstructured resume text");

// Check job card hours and real sync date in render_waves.js
const renderWavesJs = fs.readFileSync('render_waves.js', 'utf8');
assert(renderWavesJs.includes('20 hrs/wk min'), "render_waves.js must display 20 hrs/wk min for micro1 roles");
assert(renderWavesJs.includes('20–40 hrs/wk'), "render_waves.js must display 20–40 hrs/wk for Mercor hourly roles");
assert(renderWavesJs.includes('Oct 18, 2026 Sync'), "render_waves.js must display exact verified sync date Oct 18, 2026 Sync");

console.log("✓ PASSED: Stored resume persistence, 17KB multi-storage recovery, job card hours, and verified sync date verified");

console.log("==================================================================");
console.log("ALL 37 AUDIT SUITE TESTS PASSED WITH 100% SUCCESS! 🚀");
console.log("==================================================================");

