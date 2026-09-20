// eligibility.ts
// Converted real component for candidate keyword matching
const mercorKeywords = [
    'finance', 'accounting', 'cpa', 'aml', 'kyc',
    'engineer', 'aerospace', 'mechanical', 'software', 'developer',
    'procurement', 'audit', 'controls',
    'healthcare', 'medical', 'doctor', 'clinical',
    'lawyer', 'legal', 'compliance',
    'data scientist', 'machine learning', 'ai'
];
export function checkKeywords(val) {
    const msgDiv = document.getElementById('keyword-match-msg');
    if (!msgDiv)
        return;
    const lowerVal = val.toLowerCase();
    const matched = mercorKeywords.some(kw => lowerVal.includes(kw));
    if (val.length < 3) {
        msgDiv.style.display = 'none';
    }
    else if (matched) {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#4ade80'; // green
        msgDiv.innerText = '✓ Strong match with current hiring wave!';
    }
    else {
        msgDiv.style.display = 'block';
        msgDiv.style.color = '#f87171'; // red
        msgDiv.innerText = 'No exact match found in current wave, but submit to check evergreen roles.';
    }
}
// Make function available to the global window object for inline HTML handlers
window.checkKeywords = checkKeywords;
