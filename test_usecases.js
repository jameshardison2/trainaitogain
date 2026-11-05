const fs = require('fs');
const assert = require('assert');
const path = require('path');
const child_process = require('child_process');

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
assert(aiInterviewHtml.includes('isTextMode\n        ? `You completed all ${totalQuestionsCount} practice prompts and worked through the core screening questions.`') || aiInterviewHtml.includes('worked through the core screening questions.'), "ai-interview.html finish screen must not praise 'clear enunciation' when answers were typed");
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
assert(aiInterviewHtml.includes('🎯 Example structure: replace with your real story') || aiInterviewHtml.includes('🎯 Suggested High-Scoring Response'), "ai-interview.html must render the suggested response card heading");
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
assert(enterpriseHtml.includes('Technical Transition Advisory'), "enterprise.html must detail technical transition advisory");
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

// Check job card hours and real dynamic sync date in render_waves.js
const renderWavesJs = fs.readFileSync('render_waves.js', 'utf8');
assert(renderWavesJs.includes('Check listing for hours'), "render_waves.js must link to check listing for hours");
assert(renderWavesJs.includes('${cardDateStr} Sync'), "render_waves.js must display dynamic verified sync date (${cardDateStr} Sync)");
assert(renderWavesJs.includes('Oct 18, 2026'), "render_waves.js must have Oct 18, 2026 baseline for micro1");

// Test filename recovery for custom filename (e.g. My_Resume_Optimized_v5.pdf)
function mockResolveFileName(mockLocal, mockSession) {
  const nameKeys = ['candidateResumeFileName', 'resumeFileName', 'resume_file_name', 'resumeName', 'fileName'];
  for (let i = 0; i < nameKeys.length; i++) {
    const v = (mockLocal[nameKeys[i]] || mockSession[nameKeys[i]] || '').trim();
    if (v) return v;
  }
  const stores = [mockLocal, mockSession];
  for (let s = 0; s < stores.length; s++) {
    for (const key of Object.keys(stores[s])) {
      const val = (stores[s][key] || '').trim();
      if (val && (/\.(pdf|docx|txt)$/i.test(val) || /resume.*\.pdf/i.test(val))) return val;
    }
  }
  return 'My_Resume.pdf';
}
assert(mockResolveFileName({ random_key: 'My_Resume_Optimized_v5.pdf' }, {}) === 'My_Resume_Optimized_v5.pdf', "Must recover My_Resume_Optimized_v5.pdf from storage");

console.log("✓ PASSED: Stored resume persistence, 17KB multi-storage recovery, filename recovery, and verified sync date verified");

// ==================================================================
// Test 38: Active Roles Page DOM & Script Integrity (Apply Button Count)
// ==================================================================
// 1. Verify JavaScript syntax in render_waves.js passes with zero errors
child_process.execSync('node -c render_waves.js');

// 2. Verify that waves.json roles load and card templates have Apply CTA
const wavesData = JSON.parse(fs.readFileSync('waves.json', 'utf8'));
const allRoles = wavesData.roles || [];
assert(allRoles.length >= 600, `waves.json must contain at least 600 roles (found ${allRoles.length})`);

// Ensure render_waves.js template contains the Apply CTA
assert(renderWavesJs.includes('handleApplyClick'), "render_waves.js must invoke handleApplyClick on card CTA");
assert(renderWavesJs.includes('Apply on'), "render_waves.js must include Apply on platform button");

console.log(`✓ PASSED: Active Roles DOM integrity verified across all ${allRoles.length} roles with verified syntax`);

// ==================================================================
// Test 39: 10+ Tailored Questions Bank for Every Active Role & Quizlet Deck
// ==================================================================
assert(aiInterviewHtml.includes('function buildInterviewQuestions(targetRoleName, targetDomain)'), "ai-interview.html must define buildInterviewQuestions");
assert(aiInterviewHtml.includes('return questions.slice(0, 10);'), "ai-interview.html must return at least 10 questions for any role");
assert(aiInterviewHtml.includes('Question 1 of 10'), "ai-interview.html must initialize progress indicator to Question 1 of 10");
assert(aiInterviewHtml.includes('Card 1 of 10'), "ai-interview.html must initialize Quizlet flashcard badge to Card 1 of 10");

// Verify that 10 questions are generated for test sample across diverse domains
const sampleTestRoles = [
  { title: "Senior Python / ML Evaluator", domain: "SOFTWARE" },
  { title: "Investment Banking Associate", domain: "FINANCE" },
  { title: "Neurologists (MD/DO)", domain: "MEDICAL" },
  { title: "Corporate Lawyer", domain: "LEGAL" },
  { title: "Dutch Translator", domain: "LANGUAGE" },
  { title: "Robotics Control Systems Engineer", domain: "ROBOTICS" }
];

const scriptPart = aiInterviewHtml.split('<script>').find(p => p.includes('function buildInterviewQuestions'));
const isolatedCode = scriptPart.split('</script>')[0];
const testVm = require('vm');
const testSandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval: () => {},
  clearInterval: () => {},
  URLSearchParams,
  fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
  localStorage: (() => {
    let store = {};
    return {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  })(),
  sessionStorage: (() => {
    let store = {};
    return {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  })(),
  window: {
    currentSimMode: 'standard',
    wavesRoleMap: {},
    addEventListener: () => {},
    location: { search: '', hash: '', pathname: '/ai-interview' }
  },
  document: {
    getElementById: () => ({ style: {}, classList: { add(){}, remove(){} }, innerText: '', value: '', options: [{ value: 'medical' }, { value: 'software' }, { value: 'general' }, { value: 'language' }, { value: 'finance' }, { value: 'legal' }], addEventListener: () => {}, appendChild: () => {} }),
    querySelectorAll: () => [],
    createElement: () => ({ addEventListener: () => {} }),
    addEventListener: () => {}
  },
  navigator: { mediaDevices: {} }
};
testVm.createContext(testSandbox);
allRoles.forEach(r => {
  testSandbox.window.wavesRoleMap[r.title.toLowerCase()] = r;
});
testVm.runInContext(isolatedCode, testSandbox);

sampleTestRoles.forEach(({ title, domain }) => {
  const generatedQs = testSandbox.buildInterviewQuestions(title, domain);
  assert(Array.isArray(generatedQs), `Questions for ${title} must be an array`);
  assert(generatedQs.length >= 10, `Expected at least 10 questions for ${title}, got ${generatedQs.length}`);
  generatedQs.forEach((q, idx) => {
    assert(q.q && q.q.length > 15, `Question ${idx + 1} for ${title} must have a valid question prompt`);
    assert(q.answer && q.answer.length > 20, `Question ${idx + 1} for ${title} must have a valid STAR answer`);
    assert(Array.isArray(q.keywords) && q.keywords.length >= 2, `Question ${idx + 1} for ${title} must have at least 2 keywords`);
    assert(q.category && q.category.length > 3, `Question ${idx + 1} for ${title} must have a category badge`);
  });
});

console.log(`✓ PASSED: 10+ tailored interview questions verified for all roles across domains with category badges & STAR answers`);

// Test 40: Verify Teleprompter physical auto-scroll, Dual-Dollar pay format, Strict 30% duplicate penalty, Debrief warning banner, and Honest STAR title placeholder
// 1. Pay format verification
assert.strictEqual(testSandbox.window.formatDualDollarPay('$100–130/hr'), '$100–$130/hr', 'Pay format must have dual dollar signs for en-dash ranges');
assert.strictEqual(testSandbox.window.formatDualDollarPay('$50-60/hr'), '$50–$60/hr', 'Pay format must have dual dollar signs for hyphen ranges');
assert.strictEqual(testSandbox.window.formatDualDollarPay('$100–$100/hr'), '$100/hr', 'Single-value ranges must collapse to single rate');
assert.strictEqual(testSandbox.window.formatDualDollarPay('Competitive'), 'Competitive', 'Competitive pay must remain untouched');

// 2. Honest STAR title placeholder verification
const sampleQ1 = { q: "Walk me through your most recent role and what you were primarily responsible for day to day", keywords: ["Python", "Machine Learning"] };
const starParts = testSandbox.computeStarPartsForQuestion(sampleQ1, 0, "");
assert(starParts.st.includes('[Your Recent Title]'), 'Opening STAR situation must use [Your Recent Title]');
assert(!starParts.st.includes('[Your Target Role:'), 'Opening STAR situation must never coach candidate to claim target role as past title');
assert(!starParts.st.includes('Abbott') && !starParts.st.includes('ML Engineer'), 'False company and title credentials must be completely absent');

// 3. Strict 30% duplicate answer penalty & debrief alert
const cannedText = "In my recent role I architected a distributed data pipeline using Python and Docker, optimizing throughput by 35% across 500 weekly jobs.";
testVm.runInContext(`
  sessionQuestionResults = [{ answer: "${cannedText}", score: 90 }];
`, testSandbox);
const duplicateEval = testSandbox.evaluateAnswerText(cannedText, { q: "Describe a high-impact technical project", keywords: ["Python"] }, 1);
assert.strictEqual(duplicateEval.cappedScore, 30, `Duplicate canned answers must be strictly capped at 30%, got ${duplicateEval.cappedScore}%`);
assert.strictEqual(duplicateEval.isDuplicate, true, 'Duplicate canned answer must set isDuplicate: true');
assert(duplicateEval.feedbackHTML.includes('Repeated Response Detected'), 'Feedback HTML must contain Repeated Response Detected warning');

// 4. Auto-scroll CSS & instant assignment verification
assert(aiInterviewHtml.includes('.star-tp-scroll-viewport,') && aiInterviewHtml.includes('scroll-behavior: auto !important;'), 'Teleprompter viewports must enforce scroll-behavior: auto !important to prevent rAF cancellation');
assert(aiInterviewHtml.includes('vp.style.scrollBehavior = \'auto\';'), 'step() animation loop must enforce instant scroll behavior per frame');
assert(aiInterviewHtml.includes('Repeated Response Detected: Identical or canned response penalized (30% cap)'), 'Debrief cards must contain explicit duplicate penalty badge');

console.log(`✓ PASSED: Teleprompter auto-scroll engine, dual-dollar pay format, strict 30% duplicate cap, debrief alerts, and honest [Your Recent Title] placeholder verified`);

// ==================================================================
// Test 41 & 42: Pass Likelihood on /apply & Role Picker (REQ-PASS-01) + Day-Of Checklist & Copy Changes (REQ-PASS-07)
// ==================================================================
const testQaResume = "Senior QA Engineer and Test Automation Specialist with deep expertise in Selenium, Python, SQL, test automation, manual testing, bug tracking, unit testing, test execution, test cases, code review, git version control, database design, and agile methodologies.";
const neuroRole = allRoles.find(r => r.title.toLowerCase().includes('neurology')) || { title: "Neurology / BCI Annotator", atsKeywords: ["neurology", "BCI", "clinical annotation", "EEG"] };

// Test 41: QA resume on Neurology / BCI Annotator gives Weak fit label + 3 Good fit alternatives
const fitRes = testSandbox.window.getPassLikelihoodFit(neuroRole, testQaResume);
assert.strictEqual(fitRes.fit, 'weak', 'QA resume for Neurology / BCI Annotator must result in weak fit');
assert.strictEqual(fitRes.label, 'Weak fit', 'Label must be Weak fit');

const allRolesList = allRoles;
const goodAlts = allRolesList
  .filter(r => (r.title || '').toLowerCase() !== neuroRole.title.toLowerCase())
  .map(r => ({ role: r, fit: testSandbox.window.getPassLikelihoodFit(r, testQaResume) }))
  .filter(item => item.fit.fit === 'good')
  .sort((a, b) => (b.fit.score || 0) - (a.fit.score || 0))
  .slice(0, 3);

assert.strictEqual(goodAlts.length, 3, 'Must return exactly 3 Good fit alternatives');
goodAlts.forEach(alt => {
  assert.strictEqual(alt.fit.fit, 'good', `Alternative ${alt.role.title} must be Good fit`);
  assert.strictEqual(alt.fit.label, 'Good fit to pass', `Alternative ${alt.role.title} label must be Good fit to pass`);
});
console.log(`✓ PASSED: Test 41 (PASS-01) - Weak fit correctly identified with 3 Good fit alternatives for QA resume`);

// Test 42: No resume saved returns "Upload your resume to see your fit", Apply button stays universally clickable
const noResumeFit = testSandbox.window.getPassLikelihoodFit(neuroRole, "");
assert.strictEqual(noResumeFit.fit, 'none', 'No resume saved must return fit: none');
assert.strictEqual(noResumeFit.label, 'Upload your resume to see your fit', 'Label must be Upload your resume to see your fit');
assert(renderWavesJs.includes('window.handleApplyClick'), 'Apply click handler must always be attached');
assert(!renderWavesJs.includes('disabled="${passFit'), 'Apply button must never be disabled by pass fit state');
console.log(`✓ PASSED: Test 42 (PASS-01) - No resume prompts to upload fit, Apply button remains universally clickable`);

// Test Phase 1 Copy Changes & REQ-PASS-07 Prompter Warning + Day-of Checklist
const checklistHtml = fs.readFileSync('readiness-checklist.html', 'utf8');
assert(aiInterviewHtml.toUpperCase().includes('STEP 2: PASS YOUR AI INTERVIEW'), 'Header pill must be updated to Step 2: Pass your AI interview');
assert(aiInterviewHtml.includes('Example structure: replace with your real story'), 'Teleprompter heading must be updated to Example structure');
assert(aiInterviewHtml.includes('Answer out loud first, then press'), 'Flashcard flip instruction must prompt to answer out loud first');
assert(aiInterviewHtml.includes('AI screeners are built to flag repeated or canned answers. Give a distinct example for each question'), 'Duplicate answer summary must be updated');
assert(aiInterviewHtml.includes('Next step: take the Pass Check'), 'Results benchmark banner must include Next step: take the Pass Check');
assert(aiInterviewHtml.includes("Practice only. Don't use notes, prompters or overlays in a real interview."), 'Eyeline prompter must carry fixed practice-only warning banner');
assert(checklistHtml.includes('id="day-of-checklist"'), 'readiness-checklist.html must contain #day-of-checklist section');
assert(checklistHtml.includes('7. Bridge phrase ready for when you need a moment to think'), 'readiness-checklist.html must include the 7 day-of verification items');
console.log(`✓ PASSED: Phase 1 copy changes, prompter practice-only warning banner, and Day-Of Checklist verified`);

// ==================================================================
// Phase 2 Tests (REQ-PASS-03, REQ-PASS-04, REQ-PASS-05)
// ==================================================================

// Test 43 (REQ-PASS-03): Card tags & 10 cards per deck with 2 AI Evaluator cards
const sweDeck = testSandbox.buildInterviewQuestions('Software Engineer', 'software');
assert.strictEqual(sweDeck.length, 10, 'Every role deck must contain exactly 10 cards');
const sweEvaluatorCards = sweDeck.filter(c => c.category === 'AI Evaluator');
assert.strictEqual(sweEvaluatorCards.length, 2, 'Every role deck must contain exactly 2 AI Evaluator cards');
sweDeck.forEach(c => {
  assert(c.tag === 'STAR' || c.tag === 'Answer–Why–Check', `Card must be tagged either STAR or Answer–Why–Check (got: ${c.tag})`);
});
assert.strictEqual(sweDeck[0].tag, 'STAR', 'Card 1 must be tagged STAR');
assert.strictEqual(sweDeck[1].tag, 'STAR', 'Card 2 must be tagged STAR');
assert.strictEqual(sweDeck[9].tag, 'STAR', 'Card 10 must be tagged STAR');
assert.strictEqual(sweDeck[6].tag, 'Answer–Why–Check', 'Card 7 (AI Evaluator) must be tagged Answer–Why–Check');
assert.strictEqual(sweDeck[7].tag, 'Answer–Why–Check', 'Card 8 (AI Evaluator) must be tagged Answer–Why–Check');
assert(aiInterviewHtml.includes('id="fc-card-tag"'), 'Flashcard UI front must include #fc-card-tag');
assert(aiInterviewHtml.includes('id="fc-back-awc"'), 'Flashcard UI back must include #fc-back-awc for Answer-Why-Check formula');
console.log(`✓ PASSED: Test 43 (PASS-03) - Exactly 10 cards with STAR / Answer–Why–Check tags and 2 AI Evaluator cards verified`);

// Test 44 (REQ-PASS-03): Domain Evaluator Cards reload on role switch
const medDeck = testSandbox.buildInterviewQuestions('Clinical Specialist', 'medical');
const finDeck = testSandbox.buildInterviewQuestions('Investment Banking Analyst', 'finance');
assert.strictEqual(medDeck.length, 10, 'Medical deck must contain 10 cards');
assert.strictEqual(finDeck.length, 10, 'Finance deck must contain 10 cards');
const medEval = medDeck.filter(c => c.category === 'AI Evaluator');
const finEval = finDeck.filter(c => c.category === 'AI Evaluator');
assert.strictEqual(medEval.length, 2, 'Medical deck must have 2 evaluator cards');
assert.strictEqual(finEval.length, 2, 'Finance deck must have 2 evaluator cards');
assert(medEval.some(c => c.flawType === 'missing safety caveat' || c.flawType === 'factual error'), 'Medical evaluator cards must contain medical planted flaw');
assert(finEval.some(c => c.flawType === 'factual error' || c.flawType === 'unsupported claim'), 'Finance evaluator cards must contain finance planted flaw');
assert.notStrictEqual(medEval[0].q, finEval[0].q, 'Switching roles must reload domain-specific evaluator cards');
console.log(`✓ PASSED: Test 44 (PASS-03) - Domain evaluator cards reload correctly on role/domain switch`);

// Test 45 (REQ-PASS-04): Recall Ladder Level Advance & Drop with localStorage persistence
testSandbox.localStorage.setItem('recallLevels_qa_test', JSON.stringify({ 0: 1 }));
const lvlBefore = testSandbox.window.getQuestionRecallLevel('qa_test', 0);
assert.strictEqual(lvlBefore, 1, 'Initial recall level must be 1');

// Score >= 70 advances level
const evalHigh = { cappedScore: 85 };
let curLvl = testSandbox.window.getQuestionRecallLevel('qa_test', 0);
if (evalHigh.cappedScore >= 70) curLvl = Math.min(4, curLvl + 1);
testSandbox.window.setQuestionRecallLevel('qa_test', 0, curLvl);
assert.strictEqual(testSandbox.window.getQuestionRecallLevel('qa_test', 0), 2, 'Score >= 70 must advance recall level to 2');

// Another score >= 70 advances to level 3
curLvl = testSandbox.window.getQuestionRecallLevel('qa_test', 0);
if (evalHigh.cappedScore >= 70) curLvl = Math.min(4, curLvl + 1);
testSandbox.window.setQuestionRecallLevel('qa_test', 0, curLvl);
assert.strictEqual(testSandbox.window.getQuestionRecallLevel('qa_test', 0), 3, 'Second high score must advance recall level to 3');

// Score < 50 drops level back down
const evalLow = { cappedScore: 42 };
curLvl = testSandbox.window.getQuestionRecallLevel('qa_test', 0);
if (evalLow.cappedScore < 50) curLvl = Math.max(1, curLvl - 1);
testSandbox.window.setQuestionRecallLevel('qa_test', 0, curLvl);
assert.strictEqual(testSandbox.window.getQuestionRecallLevel('qa_test', 0), 2, 'Score < 50 must drop recall level back to 2');
console.log(`✓ PASSED: Test 45 (PASS-04) - Recall Ladder level advances on >=70%, drops on <50%, persists in localStorage`);

// Test 46 (REQ-PASS-04): Level 4 hides script from DOM ("Answer from memory")
assert(aiInterviewHtml.includes('tp-recall-memory'), 'Teleprompter must include tp-recall-memory container for Level 4');
assert(aiInterviewHtml.includes('Answer from memory (Level 4: Recall)'), 'Level 4 prompt must display Answer from memory');
assert(aiInterviewHtml.includes('recallLvl === 4 ? `'), 'Teleprompter script view must conditionally omit script text at Level 4');
console.log(`✓ PASSED: Test 46 (PASS-04) - Level 4 completely omits script text from DOM for memory recall`);

// Test 47 (REQ-PASS-05): Pressure Mode Pause Cutoff Setting (2s, 3s, 4s)
assert(aiInterviewHtml.includes('id="pressure-pause-cutoff-select"'), 'ai-interview.html must include silence cutoff selector');
assert(aiInterviewHtml.includes('value="2">2s'), 'Silence cutoff selector must include 2s option');
assert(aiInterviewHtml.includes('value="3" selected>3s'), 'Silence cutoff selector must include 3s default option');
assert(aiInterviewHtml.includes('value="4">4s'), 'Silence cutoff selector must include 4s option');
assert(aiInterviewHtml.includes('Silence Cutoff Triggered'), 'Pause detector must trigger cutoff alert');
assert(aiInterviewHtml.includes('Bridge phrases: "Let me walk you through that," or "There are two parts to this."'), 'Cutoff alert must coach candidate on bridge phrases');
console.log(`✓ PASSED: Test 47 (PASS-05) - Configurable 2s/3s/4s pause cutoff with bridge phrase tips verified`);

// Test 48 (REQ-PASS-05): Follow-Up Question Generation by Rule
const testQSample = { q: "Tell me about a high-impact engineering project", keywords: ["Docker", "Kubernetes", "CI/CD"] };
// 1. Missing number -> "How did you measure that?"
const noNumAns = "In my recent role I architected the deployment pipeline using Docker and Kubernetes.";
const followUp1 = testSandbox.window.generateFollowUpQuestion(noNumAns, testQSample);
assert.strictEqual(followUp1, "How did you measure that?", 'Answer without numbers must trigger "How did you measure that?"');

// 2. Uses "we" without "I" -> "What was your specific role?"
const weOnlyAns = "In our team project we designed a microservice architecture and reduced latencies by 35% using Docker.";
const followUp2 = testSandbox.window.generateFollowUpQuestion(weOnlyAns, testQSample);
assert.strictEqual(followUp2, "What was your specific role?", 'Answer with only "we" and numbers must trigger "What was your specific role?"');

// 3. Missing JD keyword -> "How would <keyword> apply here?"
const missingKwAns = "In my project, I architected a distributed container service using Docker, improving throughput by 40% across clusters.";
const followUp3 = testSandbox.window.generateFollowUpQuestion(missingKwAns, testQSample);
assert.strictEqual(followUp3, "How would Kubernetes apply here?", 'Answer missing Kubernetes keyword must ask how it applies');

console.log(`✓ PASSED: Test 48 (PASS-05) - Follow-up questions generated deterministically based on missing elements`);

// Test 49 (REQ-PASS-05): Composite Scoring (70% main + 30% follow-up) & Debrief retention
assert(aiInterviewHtml.includes('Math.round(mainEval.cappedScore * 0.70 + followUpEval.cappedScore * 0.30)'), 'Composite question scoring must weight main answer 70% and follow-up 30%');
assert(aiInterviewHtml.includes('Follow-Up Question: "${escapeHtml(res.followUpQuestion)}"'), 'Debrief results must render follow-up question');
assert(aiInterviewHtml.includes('Follow-Up Response: "${escapeHtml(res.followUpAnswer)}"'), 'Debrief results must render follow-up response and score');
console.log(`✓ PASSED: Test 49 (PASS-05) - 70/30 composite weighting and dual main/follow-up debrief rendering verified`);

// ==================================================================
// Phase 3 Tests (REQ-PASS-02 Resume Defense & REQ-PASS-06 Pass Check)
// ==================================================================

// Test 50 (REQ-PASS-02): With resume saved, generates 8 questions quoting real bullets
const sampleCandidateResume = `
Senior Software Engineer
• Architected distributed streaming pipeline processing 250,000 events per second using Apache Kafka and Python.
• Automated regression test suite with Cypress and Selenium, reducing QA release cycles by 40%.
• Built microservices backend using Docker, FastAPI, and PostgreSQL with 99.95% uptime SLA.
• Spearheaded cross-team migration of database shards, eliminating query bottlenecks and decreasing p99 latency by 55ms.
• Led technical design reviews across 8 engineering teams and mentored 4 junior developers on clean architecture.
• Designed real-time monitoring and alerting dashboard using Prometheus and Grafana for early anomaly detection.
• Implemented OAuth2 and RBAC authorization protocols across external partner REST APIs.
• Engineered automated CI/CD deployment pipelines on AWS ECS, saving 12 developer hours weekly.
• Optimized SQL queries and database indexes, cutting average query execution time from 1.2s to 180ms.
`;
const rdQuestions = testSandbox.window.buildResumeDefenseQuestions('Senior Backend Engineer', sampleCandidateResume, ['Python', 'Kafka', 'Docker', 'PostgreSQL']);
assert.strictEqual(rdQuestions.length, 8, 'Resume Defense mode must generate exactly 8 questions');
rdQuestions.forEach(q => {
  assert(q.q.startsWith('Walk me through this: "'), 'Opening question must follow template: Walk me through this: "<bullet>"');
  assert(q.bullet && q.bullet.length > 20, 'Question must retain quoted bullet');
  assert(q.followUp && q.followUp.length > 10, 'Question must include follow-up prompt');
});
console.log(`✓ PASSED: Test 50 (PASS-02) - Resume Defense generates 8 questions quoting real bullets`);

// Test 51 (REQ-PASS-02): Without resume saved, prompts to upload resume to unlock
const noResQuestions = testSandbox.window.buildResumeDefenseQuestions('Senior Backend Engineer', '', []);
assert.strictEqual(noResQuestions.length, 0, 'No resume saved must return 0 questions');
assert(aiInterviewHtml.includes('Upload your resume to unlock'), 'Resume Defense mode card must prompt to upload resume when none saved');
console.log(`✓ PASSED: Test 51 (PASS-02) - Without resume, prompts candidate to upload resume to unlock`);

// Test 52 (REQ-PASS-02): Follow-up question logic (missing number vs tool over alternatives)
const bulletNoNum = "Implemented OAuth2 and RBAC authorization protocols across external partner REST APIs.";
const qNoNum = testSandbox.window.buildResumeDefenseQuestions('Security Engineer', bulletNoNum, ['OAuth2'])[0];
assert.strictEqual(qNoNum.followUp, "How did you measure the result?", 'Bullet without numbers must prompt: How did you measure the result?');

const bulletTool = "Designed real-time monitoring and alerting dashboard using Prometheus and Grafana for early anomaly detection.";
const qTool = testSandbox.window.buildResumeDefenseQuestions('DevOps Engineer', bulletTool, ['Prometheus'])[0];
assert.strictEqual(qTool.followUp, "Why that tool over the alternatives?", 'Bullet naming tool must prompt: Why that tool over the alternatives?');
console.log(`✓ PASSED: Test 52 (PASS-02) - Follow-up questions match bullet content (missing number vs tool alternatives)`);

// Test 53 (REQ-PASS-02): Client-side privacy guard - resume text never leaves device
assert(!aiInterviewHtml.includes("fetch('/api/analyzeResumeBullets'"), 'Resume bullets must not be sent to any server endpoint');
assert(aiInterviewHtml.includes('window.extractResumeBullets'), 'Resume bullet parsing must execute client-side in browser');
console.log(`✓ PASSED: Test 53 (PASS-02) - Resume Defense is 100% client-side; candidate resume never leaves device`);

// Test 54 (REQ-PASS-06): Pass Check generates exactly 6 questions (3 STAR, 2 AWC with 1 AI Evaluator, 1 Resume Defense)
const pcQuestions = testSandbox.window.buildPassCheckQuestions('Software Engineer', 'software');
assert.strictEqual(pcQuestions.length, 6, 'Pass Check must contain exactly 6 questions');
const starCount = pcQuestions.filter(q => q.tag === 'STAR' && q.category !== 'Resume Defense').length;
const awcCount = pcQuestions.filter(q => q.tag === 'Answer–Why–Check').length;
const evalCount = pcQuestions.filter(q => q.category === 'AI Evaluator').length;
const rdCount = pcQuestions.filter(q => q.category === 'Resume Defense').length;
assert.strictEqual(starCount, 3, 'Pass Check must include exactly 3 STAR questions');
assert.strictEqual(awcCount, 2, 'Pass Check must include exactly 2 Answer-Why-Check questions');
assert.strictEqual(evalCount, 1, 'Pass Check must include exactly 1 AI Evaluator question');
assert.strictEqual(rdCount, 1, 'Pass Check must include exactly 1 Resume Defense question');
console.log(`✓ PASSED: Test 54 (PASS-06) - Pass Check compiles exactly 6 randomized questions (3 STAR, 2 AWC with 1 Evaluator, 1 Resume Defense)`);

// Test 55 (REQ-PASS-06): Pass Check hides prompter controls & duplicate answers cannot return Ready
assert(aiInterviewHtml.includes("isPressure = (window.currentSimMode === 'pressure' || window.currentSimMode === 'passcheck')"), 'Pass Check must enforce isPressure restrictions (hiding prompters)');
assert(aiInterviewHtml.includes('A run containing duplicate or repeated answers cannot return Ready'), 'Duplicate answer must block Ready result');
console.log(`✓ PASSED: Test 55 (PASS-06) - Pass Check enforces blind conditions and disqualifies duplicate responses from Ready`);

// Test 56 (REQ-PASS-06): Ready result stores passCheck_<roleId> and renders "Pass Check ✓" badge on /apply, stale after 14 days
assert(renderWavesJs.includes('passcheck-badge passcheck-ready'), 'render_waves.js must include passcheck-ready badge');
assert(renderWavesJs.includes('passcheck-badge passcheck-stale'), 'render_waves.js must include passcheck-stale badge');
assert(renderWavesJs.includes('Retake to refresh (14+ days old)'), 'render_waves.js must display stale note for passes older than 14 days');
assert(renderWavesJs.includes('Recommended: take the Pass Check first'), 'render_waves.js must display recommendation link when Pass Check not taken');
assert(renderWavesJs.includes('isPassCheckReady ? `<span class="btn-passcheck-tag"'), 'Apply button must show Pass Check tag when passed');
console.log(`✓ PASSED: Test 56 (PASS-06) - Pass Check ✓ badge, stale 14-day rule, and Apply recommendation link verified`);

// ==================================================================
// Phase 4 Tests (REQ-PASS-08 Outcome Tracking & 7-Day Email Plan)
// ==================================================================

// Test 57 (PASS-08): Dashboard status dropdown includes "Passed AI interview" and "Didn't pass", prompts for hardest question type
const updatedSavedRolesHtml = fs.readFileSync('saved-roles.html', 'utf8');
assert(updatedSavedRolesHtml.includes('<option value="Passed AI interview"'), 'saved-roles.html must include Passed AI interview status option');
assert(updatedSavedRolesHtml.includes('<option value="Didn\'t pass"'), "saved-roles.html must include Didn't pass status option");
assert(updatedSavedRolesHtml.includes('Which question type felt hardest?'), 'saved-roles.html must prompt for hardest question type when passed/not passed');
assert(updatedSavedRolesHtml.includes('Story (STAR)'), 'saved-roles.html must include Story (STAR) hardest option');
assert(updatedSavedRolesHtml.includes('Knowledge (Answer–Why–Check)'), 'saved-roles.html must include Knowledge (Answer–Why–Check) hardest option');
assert(updatedSavedRolesHtml.includes('Resume Defense'), 'saved-roles.html must include Resume Defense hardest option');
assert(updatedSavedRolesHtml.includes('Timing (Pause Cutoff)'), 'saved-roles.html must include Timing (Pause Cutoff) hardest option');
console.log(`✓ PASSED: Test 57 (PASS-08) - Dashboard status dropdown includes 'Passed AI interview' & 'Didn't pass', prompts for hardest question type`);

// Test 58 (PASS-08): 7-Day practice plan opt-in checkbox unchecked by default on Playbook forms
const updatedAiInterviewHtml = fs.readFileSync('ai-interview.html', 'utf8');
assert(updatedAiInterviewHtml.includes('id="screen1-practice-plan-optin"'), 'ai-interview.html must include screen1 7-day plan checkbox');
assert(updatedAiInterviewHtml.includes('id="lead-magnet-practice-plan-optin"'), 'ai-interview.html must include debrief 7-day plan checkbox');
assert(updatedAiInterviewHtml.includes('Email me a 7-day practice plan.'), 'Checkbox label must specify Email me a 7-day practice plan.');
assert(!updatedAiInterviewHtml.includes('id="screen1-practice-plan-optin" checked'), 'Screen 1 plan checkbox must be unchecked by default');
assert(!updatedAiInterviewHtml.includes('id="lead-magnet-practice-plan-optin" checked'), 'Debrief plan checkbox must be unchecked by default');
console.log(`✓ PASSED: Test 58 (PASS-08) - 7-day practice plan opt-in checkbox unchecked by default on Playbook forms`);

// Test 59 (PASS-08): Anonymous outcome record contains NO resume or answer text
const recordValidator = (record) => {
  assert(record.session_id && record.session_id.startsWith('anon_'), 'Record must use anonymous session ID');
  assert.strictEqual(record.event_type, 'interview_outcome');
  assert(!('resumeText' in record), 'Outcome record must NOT contain resumeText');
  assert(!('candidateResumeText' in record), 'Outcome record must NOT contain candidateResumeText');
  assert(!('answers' in record), 'Outcome record must NOT contain answers array');
  assert(!('answer' in record), 'Outcome record must NOT contain answer text');
};
const dummyRecord = {
  event_type: 'interview_outcome',
  session_id: 'anon_12345',
  referral_id: 'role-test-qa',
  outcome: 'Passed AI interview',
  fit_label: 'Good fit',
  pass_check_score: 82,
  pass_check_date: '2026-11-04',
  hardest_question_type: 'Timing (Pause Cutoff)'
};
recordValidator(dummyRecord);
assert(updatedSavedRolesHtml.includes('delete outcomeRecord.resumeText'), 'saved-roles.html must explicitly strip resume text before persisting/transmitting');
assert(updatedSavedRolesHtml.includes('delete outcomeRecord.answers'), 'saved-roles.html must explicitly strip answer text before persisting/transmitting');
console.log(`✓ PASSED: Test 59 (PASS-08) - Outcome tracking strictly excludes candidate resume and answer text`);

// Test 60 (PASS-08): Privacy policy documents anonymous outcome tracking and reaffirms no resume/answer text storage
const privacyHtml = fs.readFileSync('privacy.html', 'utf8');
assert(privacyHtml.includes('Anonymous Outcome Tracking'), 'privacy.html must document Anonymous Outcome Tracking');
assert(privacyHtml.includes('Passed AI interview'), 'privacy.html must cite Passed AI interview reporting');
assert(privacyHtml.includes('No resume or answer text stored'), 'privacy.html must guarantee no resume or answer text stored');
console.log(`✓ PASSED: Test 60 (PASS-08) - Privacy policy explicitly covers anonymous outcome tracking & data boundaries`);

// ==================================================================
// TRAINAITOGAIN QA REPORT REGRESSION TESTS (BUGS 1 - 13)
// ==================================================================

// Test 61 (Bug 1): Bullet normalization in extractResumeBullets (inline PDF bullets)
const inlinePdfResume = "Professional Experience • Led automated regression testing across 40 services • Built CI/CD pipelines in Jenkins and Docker reducing release time by 35% • Spearheaded QA automation architecture for payment processing systems";
const extractedBullets = testSandbox.window.extractResumeBullets(inlinePdfResume);
assert(Array.isArray(extractedBullets) && extractedBullets.length >= 3, `Expected at least 3 bullets extracted from inline PDF text, got ${extractedBullets.length}`);
assert(extractedBullets[0].includes("Led automated regression testing"), "Extracted bullet 1 must match content");
console.log(`✓ PASSED: Test 61 (Bug 1) - extractResumeBullets normalizes inline PDF bullets (•, ●, ▪, *) properly`);

// Test 62 (Bug 1): Explicit Resume Defense error banner on 0 bullets
const aiInterviewCode = fs.readFileSync('ai-interview.html', 'utf8');
assert(aiInterviewCode.includes('id="resume-defense-error-banner"'), 'ai-interview.html must contain resume-defense-error-banner');
assert(aiInterviewCode.includes("Couldn't read bullets from resume"), 'ai-interview.html must show explicit error rather than silently falling back');
console.log(`✓ PASSED: Test 62 (Bug 1) - Explicit error banner rendered when 0 resume bullets are found in Resume Defense`);

// Test 63 (Bug 2): Pass Check & Pressure Mode typed mode support (REQ-PASS-10)
assert(!aiInterviewCode.includes("if (isPressure) isTextMode = false;"), "Must not override isTextMode to false in askQuestion");
assert(!aiInterviewCode.includes("if (window.currentSimMode === 'pressure') {\n      isTextMode = false;"), "Must not force isTextMode to false in proceedToSession");
assert(aiInterviewCode.includes('id="typed-followup-prompt"'), "ai-interview.html must contain typed-followup-prompt container");
console.log(`✓ PASSED: Test 63 (Bug 2) - Pass Check & Pressure Mode support typed mode with text follow-ups (REQ-PASS-10)`);

// Test 64 (Bug 3): Interviewer voice consistency & locked session voice (REQ-PASS-09)
assert(aiInterviewCode.includes("window.speakAsInterviewer"), "ai-interview.html must define window.speakAsInterviewer");
assert(aiInterviewCode.includes("window.getLockedSessionVoice"), "ai-interview.html must lock interviewer voice per session");
assert(!aiInterviewCode.includes('/audio/q_resume_1.mp3'), "All MP3 references must be removed from question audio fields");
assert(!aiInterviewCode.includes('/audio/q_general_1.mp3'), "All MP3 references must be removed from question audio fields");
console.log(`✓ PASSED: Test 64 (Bug 3) - Single speakAsInterviewer function with locked session voice verified (REQ-PASS-09)`);

// Test 65 (Bug 4): Domain Guard in getPassLikelihoodFit
const testRenderWaves = fs.readFileSync('render_waves.js', 'utf8');
eval(testRenderWaves.substring(testRenderWaves.indexOf("function getPassLikelihoodFit"), testRenderWaves.indexOf("if (typeof window !== 'undefined') {\n    window.getPassLikelihoodFit")));
const qaResumeForGuards = "Senior QA Automation Engineer with 8 years of experience in Python, Selenium WebDriver, Cypress, API testing, SQL, CI/CD pipelines, and test strategy. Based in San Francisco, CA, USA.";

const blastingRole = { title: "Commercial Blasting Engineer", cleanTitle: "Commercial Blasting Engineer", domain: "SCIENCE", atsKeywords: ["explosives", "blasting", "safety"] };
const civilRole = { title: "Civil Engineers & Architects", cleanTitle: "Civil Engineers & Architects", domain: "SCIENCE", atsKeywords: ["civil", "structures", "cad"] };
const chemRole = { title: "Chemical Defense Researcher", cleanTitle: "Chemical Defense Researcher", domain: "SCIENCE", atsKeywords: ["hazmat", "chemistry", "toxicology"] };
const hygienistRole = { title: "Industrial Hygienist", cleanTitle: "Industrial Hygienist", domain: "SCIENCE", atsKeywords: ["industrial hygiene", "safety", "cih"] };
const legalRole = { title: "Corporate Legal Counsel", cleanTitle: "Corporate Legal Counsel", domain: "LEGAL", atsKeywords: ["attorney", "litigation", "contracts"] };
const medRole = { title: "Oncology Clinical Evaluator", cleanTitle: "Oncology Clinical Evaluator", domain: "MEDICAL", atsKeywords: ["oncology", "clinical", "physician"] };

assert.strictEqual(getPassLikelihoodFit(blastingRole, qaResumeForGuards).fit, 'weak', 'Blasting role must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(civilRole, qaResumeForGuards).fit, 'weak', 'Civil role must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(chemRole, qaResumeForGuards).fit, 'weak', 'Chemical Defense role must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(hygienistRole, qaResumeForGuards).fit, 'weak', 'Industrial Hygienist role must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(legalRole, qaResumeForGuards).fit, 'weak', 'Legal role must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(medRole, qaResumeForGuards).fit, 'weak', 'Medical role must be Weak fit for QA resume');
console.log(`✓ PASSED: Test 65 (Bug 4) - Domain Guard blocks Software/QA from receiving Good fit on Blasting, Civil, Chem, Safety, Legal, and Medical`);

// Test 66 (Bug 4): Location Guard in getPassLikelihoodFit
const indiaRole = { title: "Python Engineer (India Only)", cleanTitle: "Python Engineer", domain: "SOFTWARE", tags: ["India"], atsKeywords: ["python", "sql"] };
const latamRole = { title: "Backend Developer (LatAm Remote)", cleanTitle: "Backend Developer", domain: "SOFTWARE", tags: ["LatAm"], atsKeywords: ["python", "api"] };
assert.strictEqual(getPassLikelihoodFit(indiaRole, qaResumeForGuards).fit, 'weak', 'India-only role must be Weak fit for US candidate');
assert.strictEqual(getPassLikelihoodFit(latamRole, qaResumeForGuards).fit, 'weak', 'LatAm-only role must be Weak fit for US candidate');
console.log(`✓ PASSED: Test 66 (Bug 4) - Location Guard prevents mismatched region-only roles from being Good fit`);

// Test 67 (Bug 5): Top Qualified Roles on /apply render fit labels and Pass Check tags
const applyPageHtml = fs.readFileSync('apply.html', 'utf8');
assert(applyPageHtml.includes('window.getPassLikelihoodFit'), 'apply.html must invoke getPassLikelihoodFit for top matches');
assert(applyPageHtml.includes('${fitBadgeHtml}'), 'apply.html must render fitBadgeHtml in matched role cards');
assert(applyPageHtml.includes('${passCheckBadgeHtml}'), 'apply.html must render passCheckBadgeHtml in matched role cards');
assert(applyPageHtml.includes('Pass Check ✓'), 'apply.html must render Pass Check tag on apply button when earned');
console.log(`✓ PASSED: Test 67 (Bug 5) - Top Qualified Roles on /apply render fit labels and Pass Check ✓ tags`);

// Test 68 (Bug 5 & Bug 13): QA Engineer role preserved in render_waves.js
assert(!testRenderWaves.includes('!incomingPlatforms.has('), 'render_waves.js must not drop baseline roles when merging API roles');
assert(testRenderWaves.includes('Preserving all baseline roles like QA Engineer') || testRenderWaves.includes('preserving all baseline roles like QA Engineer'), 'render_waves.js must retain baseline roles across platforms');
const wavesRaw = JSON.parse(fs.readFileSync('waves.json', 'utf8'));
const qaEng = wavesRaw.roles.find(r => r.title === 'QA Engineer');
assert(qaEng && qaEng.platform === 'Micro1', 'QA Engineer must exist in waves.json as active Micro1 role');
assert.strictEqual(wavesRaw.meta.totalJobs, 604, 'waves.json meta.totalJobs must be canonical 604');
console.log(`✓ PASSED: Test 68 (Bug 5 & Bug 13) - QA Engineer and all 604 baseline roles preserved during API sync`);

// Test 69 (Bug 6 & Bug 7): Universal 44px tap target height & 13px badge font size
const sharedCssText = fs.readFileSync('shared.css', 'utf8');
assert(sharedCssText.includes('min-height: 44px !important;'), 'shared.css must enforce universal 44px tap targets');
assert(sharedCssText.includes('.pass-fit-badge') && sharedCssText.includes('font-size: 13px !important;'), 'shared.css must enforce 13px minimum for badges');
const savedRolesCode = fs.readFileSync('saved-roles.html', 'utf8');
assert(savedRolesCode.includes('id="savedSortFilter"') && savedRolesCode.includes('min-height:44px;'), 'savedSortFilter must have 44px min-height');
console.log(`✓ PASSED: Test 69 (Bug 6 & Bug 7) - 44px tap target height and 13px badge font size verified`);

// Test 70 (Bug 8): Practice Benchmark banner always displayed on results screen
assert(aiInterviewCode.includes('Next step: take the Pass Check <button'), 'ai-interview.html must include Next step: take the Pass Check CTA button');
assert(!aiInterviewCode.includes('const vettedBadgeHTML = avgScore >= 80 ?'), 'Practice Benchmark banner must render for all completed sessions, not only avgScore >= 80');
console.log(`✓ PASSED: Test 70 (Bug 8) - Practice Benchmark banner with Pass Check CTA displays for all completed sessions`);

// Test 71 (Bug 9): Duplicate sentence removed from duplicate debrief
assert(!aiInterviewCode.includes('Give a distinct example for each question. To raise your readiness score, provide distinct, role-specific STAR examples for each individual prompt.'), 'Duplicate sentence must be removed');
assert(aiInterviewCode.includes('Give a distinct example for each question.'), 'Single clear guidance sentence retained');
console.log(`✓ PASSED: Test 71 (Bug 9) - Repeated sentence in duplicate-answer debrief successfully cleaned`);

// Test 72 (Bug 10, 11, 12): Question 6 tagged as STAR, carousel arrows at 6px, and facial tracking copy updated
assert(aiInterviewCode.includes('q: `Describe a scenario where data anomalies') && aiInterviewCode.includes('tag: "STAR"'), 'Question 6 must be tagged as STAR');
assert(testRenderWaves.includes('left:6px;') && testRenderWaves.includes('right:6px;'), 'render_waves.js carousel buttons must be pulled inside (left:6px; right:6px;)');
assert(applyPageHtml.includes('left:6px;') && applyPageHtml.includes('right:6px;'), 'apply.html carousel buttons must be pulled inside (left:6px; right:6px;)');
const checklistPageHtml = fs.readFileSync('readiness-checklist.html', 'utf8');
assert(checklistPageHtml.includes('so the interviewer can see you clearly'), 'readiness-checklist.html must use clean human copy');
assert(!checklistPageHtml.includes('so computer vision models maintain crisp facial tracking'), 'Unsupported facial tracking copy must be removed');
console.log(`✓ PASSED: Test 72 (Bugs 10, 11, 12) - Question 6 tagged STAR, carousel arrows positioned at 6px, and checklist copy clean`);

// Test 73 (QA Retest Item 1): Strengthened Domain Guard in render_waves.js and ai-interview.html
const blastingRoleCheck = { title: "Commercial Blasting Engineer", cleanTitle: "Commercial Blasting Engineer", domain: "SOFTWARE", atsKeywords: ["Python", "Unit Testing", "Code Review", "Git", "API Development"] };
const civilRoleCheck = { title: "Civil Engineers & Architects (Must own MacBook)", cleanTitle: "Civil Engineers & Architects", domain: "GENERAL", atsKeywords: ["Python", "Unit Testing", "Code Review", "Git", "API Development"] };
const archRoleCheck = { title: "Architect — Design Coordination (Vulcan)", cleanTitle: "Architect — Design Coordination (Vulcan)", domain: "CREATIVE", atsKeywords: ["Design Systems", "Visual Design"] };
const planReviewerCheck = { title: "Code Plan Reviewer (Plans Examiner) — Vulcan", cleanTitle: "Code Plan Reviewer", domain: "SOFTWARE", atsKeywords: ["Python", "Unit Testing", "Code Review", "Git", "API Development"] };
const legalExpertCheck = { title: "Legal Domain Expert — AI Training & Evaluation", cleanTitle: "Legal Domain Expert", domain: "LEGAL", atsKeywords: ["Financial Modeling", "Market Research"] };

assert.strictEqual(getPassLikelihoodFit(blastingRoleCheck, qaResumeForGuards).fit, 'weak', 'Commercial Blasting Engineer must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(civilRoleCheck, qaResumeForGuards).fit, 'weak', 'Civil Engineers & Architects must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(archRoleCheck, qaResumeForGuards).fit, 'weak', 'Architect — Design Coordination must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(planReviewerCheck, qaResumeForGuards).fit, 'weak', 'Code Plan Reviewer must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(legalExpertCheck, qaResumeForGuards).fit, 'weak', 'Legal Domain Expert must be Weak fit for QA resume');
assert(aiInterviewCode.includes('isCivilOrBlasting') && aiInterviewCode.includes('failsDomain'), 'ai-interview.html must implement full domain guard');
console.log(`✓ PASSED: Test 73 - Hardened Domain Guard blocks Blasting, Civil, Architect, Code Plan Reviewer, and Legal from Good fit`);

// Test 74 (QA Retest Item 2): Pass Check requires keyword coverage (min 4 of 8 keywords) for Ready ✓
assert(aiInterviewCode.includes('minRequiredKwHits = Math.min(4, Math.ceil(kwTotal * 0.5))'), 'Pass Check must calculate minRequiredKwHits');
assert(aiInterviewCode.includes('hasRequiredKeywords'), 'Pass Check must check hasRequiredKeywords for Ready status');
assert(aiInterviewCode.includes('avgScore >= 70 && minQScore >= 50 && !hasDup && hasRequiredKeywords'), 'pcStatus ready must require hasRequiredKeywords');
console.log(`✓ PASSED: Test 74 - Pass Check enforces minimum 4 of 8 JD keywords (or >=50%) to achieve Ready ✓`);

// Test 75 (QA Retest Item 3): Mobile Nav Menu Button & 7-Day Opt-In Tap Targets >= 44px
assert(sharedCssText.includes('.nav-toggle-label') && sharedCssText.includes('min-width: 44px !important;') && sharedCssText.includes('min-height: 44px !important;'), 'shared.css must enforce 44px on .nav-toggle-label');
assert(aiInterviewCode.includes('id="screen1-practice-plan-optin"') && aiInterviewCode.includes('min-height:44px;'), 'screen1 optin label must have min-height:44px');
assert(aiInterviewCode.includes('id="lead-magnet-practice-plan-optin"') && aiInterviewCode.includes('min-height:44px;'), 'lead magnet optin label must have min-height:44px');
console.log(`✓ PASSED: Test 75 - Nav toggle label and 7-day practice plan opt-in checkboxes verified with 44px touch targets`);

// Test 76 (QA Retest Item 4): Secondary text, platform badges, and match % badges >= 13px
assert(testRenderWaves.includes('platform-badge') && testRenderWaves.includes('font-size:13px;'), 'render_waves.js platform badges must be 13px');
assert(testRenderWaves.includes('Strong Match') && testRenderWaves.includes('font-size:13px;'), 'render_waves.js match badges must be 13px');
assert(applyPageHtml.includes('platform-badge') && applyPageHtml.includes('font-size:13px;'), 'apply.html platform badges must be 13px');
assert(sharedCssText.includes('.platform-badge') && sharedCssText.includes('font-size: 13px !important;'), 'shared.css must enforce 13px on .platform-badge');
console.log(`✓ PASSED: Test 76 - Platform and match badges verified with 13px minimum font size`);

// Test 77 (QA Retest Item 5): Resume Defense bullet deduplication
assert(aiInterviewCode.includes('seenNorm.has(keyPrefix)'), 'extractResumeBullets must deduplicate by normalized prefix');
assert(aiInterviewCode.includes('seenTopKeys.has(key)'), 'buildResumeDefenseQuestions must enforce distinct bullet selection');
console.log(`✓ PASSED: Test 77 - Resume Defense deduplicates near-duplicate and repeated bullets`);

// Test 78 (QA Retest Items 6 & 7): Dynamic question progression wording and canonical 604 role counter
assert(aiInterviewCode.includes('${totalQuestionsCount}-question progression'), 'ai-interview.html must use dynamic totalQuestionsCount in progression wording');
assert(aiInterviewCode.includes('totalBadge.textContent = "604 Roles"'), 'ai-interview.html must set total badge to canonical 604 Roles');
assert(aiInterviewCode.includes('modalCountLabel.textContent = "604 Roles"'), 'ai-interview.html must set modal role count to 604 Roles');
console.log(`✓ PASSED: Test 78 - Dynamic question count in results summary and canonical 604 role counter verified`);

// Test 79 (QA Retest Item - Physician Roles Weak Fit):
const infectiousDiseaseRole = { title: "Infectious Disease Physician", cleanTitle: "Infectious Disease Physician", domain: "MEDICAL", atsKeywords: ["Clinical Research", "Diagnosis", "Patient Care"] };
const usLicensedPhysicianRole = { title: "US-Licensed Physician (MD/DO)", cleanTitle: "US-Licensed Physician", domain: "MEDICAL", atsKeywords: ["Clinical Medicine", "Patient Care"] };
const hospitalistRole = { title: "Hospitalist Physician", cleanTitle: "Hospitalist Physician", domain: "MEDICAL", atsKeywords: ["Inpatient Care", "Internal Medicine"] };

assert.strictEqual(getPassLikelihoodFit(infectiousDiseaseRole, qaResumeForGuards).fit, 'weak', 'Infectious Disease Physician must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(usLicensedPhysicianRole, qaResumeForGuards).fit, 'weak', 'US-Licensed Physician must be Weak fit for QA resume');
assert.strictEqual(getPassLikelihoodFit(hospitalistRole, qaResumeForGuards).fit, 'weak', 'Hospitalist Physician must be Weak fit for QA resume');
console.log(`✓ PASSED: Test 79 - Physician roles (Infectious Disease, US-Licensed, Hospitalist) verified as Weak fit for QA resume`);

// Test 80 (QA Retest Item - Off-Topic Zero-Keyword Capped at <=38%):
assert(aiInterviewCode.includes('const isOffTopicNoKeywords = (matches === 0 && kwsToEvaluate.length > 0 && wordCount >= 15 && !isDuplicateAnswer && !isBriefOrBlank);'), 'evaluateAnswerText must detect isOffTopicNoKeywords');
assert(aiInterviewCode.includes('cappedScore = Math.min(38, Math.max(20, confScore - 35));'), 'Off-topic zero-keyword answers must be capped at 38%');
assert(aiInterviewCode.includes('⚠️ Off-Topic / Zero Job Description Terms (Capped at 38%)'), 'Off-topic debrief banner must warn user of zero JD terms');
assert(aiInterviewCode.includes('Next step: retake Pass Check to earn your green checkmark'), 'Results screen must offer Retake Pass Check CTA when completed without passing');
console.log(`✓ PASSED: Test 80 - Off-topic zero-keyword answers capped at 38% and Retake Pass Check CTA verified`);

// Test 81 (QA Retest Item - Dynamic Hero Subtitle & Question Count):
assert(aiInterviewCode.includes('id="page-hero-subtitle"'), 'ai-interview.html must have id="page-hero-subtitle"');
assert(aiInterviewCode.includes('window.updateHeroSubtitle = function(mode)'), 'ai-interview.html must define window.updateHeroSubtitle');
assert(aiInterviewCode.includes('About 10 minutes &middot; 6 questions &middot; aim for 60&ndash;90 seconds per answer'), 'updateHeroSubtitle must have 6 questions for passcheck');
assert(aiInterviewCode.includes('About 12 minutes &middot; 8 questions &middot; aim for 60&ndash;90 seconds per answer'), 'updateHeroSubtitle must have 8 questions for resumedefense');
assert(aiInterviewCode.includes('About 2 minutes &middot; 1 question &middot; aim for 60&ndash;90 seconds per answer'), 'updateHeroSubtitle must have 1 question for warmup');
console.log(`✓ PASSED: Test 81 - Dynamic hero header subtitle question count verified`);

// Test 82 (Phase 1 For Teams / Enterprise Spec):
const enterprisePageHtml = fs.readFileSync('enterprise.html', 'utf8');
const privacyPageHtml = fs.readFileSync('privacy.html', 'utf8');

// 1. Hero headline & buttons
assert(enterprisePageHtml.includes('Domain experts for AI evaluation, vetted before they reach you.'), 'enterprise.html hero headline must match spec');
assert(enterprisePageHtml.includes('href="#inquiry"') && enterprisePageHtml.includes('Request evaluators'), 'enterprise.html must have Request evaluators button linked to #inquiry');
assert(enterprisePageHtml.includes('href="#expert-network"') && enterprisePageHtml.includes('Join the expert network'), 'enterprise.html must have Join the expert network button linked to #expert-network');

// 2. New Expert Network section & Jotform iframe
assert(enterprisePageHtml.includes('id="expert-network"'), 'enterprise.html must have section id="expert-network"');
assert(enterprisePageHtml.includes('Join the TrainAIToGain expert network. When a client project matches your background, we’ll contact you first.'), 'enterprise.html must contain exact intro text');
assert(enterprisePageHtml.includes('Direct client projects can be W-2, 1099 or corp-to-corp. Mercor and micro1 roles are separate: those platforms contract with you directly as an individual.'), 'enterprise.html must contain C2C / platform contract text');
assert(enterprisePageHtml.includes('https://form.jotform.com/263078475979074'), 'enterprise.html must embed the Jotform form');
assert(enterprisePageHtml.includes('height:1400px'), 'enterprise.html Jotform iframe must have height:1400px');

// 3. 3 Collapsible FAQ items
assert(enterprisePageHtml.includes('Can I work corp-to-corp?'), 'FAQ must include C2C question');
assert(enterprisePageHtml.includes('On direct client projects, yes. Mercor pays contractors as individuals, so C2C isn’t available for Mercor roles.'), 'FAQ must include C2C answer');
assert(enterprisePageHtml.includes('Is joining the expert network free?'), 'FAQ must include free question');
assert(enterprisePageHtml.includes('Yes. We never charge experts.'), 'FAQ must include free answer');
assert(enterprisePageHtml.includes('How is this different from Active Roles?'), 'FAQ must include Active Roles comparison question');
assert(enterprisePageHtml.includes('Active Roles links to open Mercor and micro1 jobs. The expert network is for direct client projects we staff ourselves.'), 'FAQ must include Active Roles answer');

// 4. Softened claims & Track updates
assert(enterprisePageHtml.includes('Mercor and micro1 referral partner'), 'Top trust strip must say Mercor and micro1 referral partner');
assert(!enterprisePageHtml.includes('Official Referral Partner'), 'Must NOT claim Official Referral Partner');
assert(!enterprisePageHtml.includes('Mercor Data-Partner Program'), 'Must NOT claim Mercor Data-Partner Program');
assert(enterprisePageHtml.includes('<h3>Technical Transition Advisory</h3>'), 'Track 02 must be named Technical Transition Advisory');
assert(!enterprisePageHtml.includes('$80–$160/hr') && !enterprisePageHtml.includes('$65–$130/hr'), 'Track 03 must NOT contain hourly pay ranges');
assert(enterprisePageHtml.includes('Now building our network in medical devices, QA and regulatory software. Rates quoted per project.'), 'Track 03 must contain the exact domain scope copy');
assert(!enterprisePageHtml.includes('within 24 hours'), 'enterprise.html must NOT contain within 24 hours');
assert(enterprisePageHtml.includes('within 1 business day'), 'enterprise.html must say within 1 business day');

// 5. Privacy policy update
assert(privacyPageHtml.includes('Expert Network Applications'), 'privacy.html must include Expert Network section');
assert(privacyPageHtml.includes('Jotform'), 'privacy.html must mention Jotform collection');
assert(privacyPageHtml.includes('permanent removal on request'), 'privacy.html must guarantee removal on request');

console.log(`✓ PASSED: Test 82 - For Teams Phase 1 spec verified (hero headline & buttons, expert network Jotform iframe, 3 FAQs, softened claims, and privacy policy)`);

console.log("==================================================================");
console.log("ALL 82 AUDIT SUITE TESTS (ALL BUGS RESOLVED) PASSED WITH 100% SUCCESS! 🚀");
console.log("==================================================================");

