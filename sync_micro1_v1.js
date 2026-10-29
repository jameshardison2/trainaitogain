// TrainAIToGain Deep Sync V1.0 for micro1
// Scans active jobs on jobs.micro1.ai and ingests them into TrainAIToGain catalog
// Attaches 1-click partner referral attribution: referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe
(async function () {
  if (!/micro1\.ai/i.test(location.hostname)) {
    const goToJobs = confirm(
      'micro1 hosts all active opportunities on jobs.micro1.ai.\n\n' +
      'Click OK to open jobs.micro1.ai now, then run this bookmark again to sync!'
    );
    if (goToJobs) location.href = 'https://jobs.micro1.ai';
    return;
  }

  const REFERRAL_CODE = '05216c9f-87cc-49af-b448-f9f8a18d2efe';
  const FALLBACK_LINK = `https://jobs.micro1.ai?referralCode=${REFERRAL_CODE}&utm_source=referral&utm_medium=share&utm_campaign=job_referral`;
  const ENDPOINT = 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs';
  const TOKEN = 'TRAINAITOGAIN_SYNC_SECURE_2026';
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  alert(
    '🚀 TrainAIToGain micro1 Sync V1.0 started!\n\n' +
    'Scanning active roles on jobs.micro1.ai...\n' +
    'Attaching dedicated referral attribution code: ' + REFERRAL_CODE + '\n\n' +
    'Please keep this tab open (~15-20 seconds).'
  );

  // 1. Scroll down repeatedly to load lazy-loaded cards
  let lastHeight = 0;
  for (let s = 0; s < 15; s++) {
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    await sleep(800);
    const newHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    if (newHeight === lastHeight && s > 3) break;
    lastHeight = newHeight;
  }

  // 2. DOM Discovery helper
  const parsePay = text => {
    const re = /\$\s*([\d,]+(?:\.\d+)?)(?:\s*[-–to]+\s*\$?\s*([\d,]+(?:\.\d+)?))?\s*(?:\/|per)?\s*(hour|hr|month|mo|year|yr|task|one-time)?/i;
    const m = (text || '').match(re);
    if (!m) return { pay: 'Competitive', payUnit: 'hr', payMin: null, payMax: null };
    const n = s => s ? Number(s.replace(/,/g, '')) : null;
    const min = n(m[1]), max = n(m[2]);
    const unit = (m[3] || 'hr').toLowerCase();
    const fmt = v => v.toLocaleString('en-US');
    const pay = '$' + fmt(min) + (max ? '–' + fmt(max) : '') + '/' + unit;
    return { pay, payUnit: unit, payMin: min, payMax: max || min };
  };

  const DOMAINS = [
    ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed/i],
    ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
    ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
    ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian/i],
    ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
    ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear/i],
    ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
  ];

  const candidateElements = Array.from(document.querySelectorAll('a[href*="/post/"], a[href*="/job/"], [class*="card" i], [class*="job" i], [role="article"]'));
  const seenPosts = new Set();
  const jobs = [];

  for (const el of candidateElements) {
    const text = el.innerText || '';
    if (!text || text.length < 5) continue;

    // Find link
    let link = el.tagName === 'A' ? el.href : '';
    if (!link) {
      const a = el.querySelector('a[href*="/post/"], a[href*="/job/"], a[href*="micro1.ai"]');
      if (a) link = a.href;
    }

    if (!link || (!link.includes('/post/') && !link.includes('/job/'))) continue;
    
    // Normalize post ID
    const idMatch = link.match(/\/(?:post|job)\/([a-zA-Z0-9_-]+)/i);
    const postId = idMatch ? idMatch[1] : '';
    if (postId && seenPosts.has(postId)) continue;
    if (postId) seenPosts.add(postId);

    // Extract title
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let title = lines[0] || 'Software Engineer';
    for (const l of lines) {
      if (l.length > 3 && !l.includes('$') && !/apply|remote|full-time|part-time|contract/i.test(l)) {
        title = l;
        break;
      }
    }

    const payInfo = parsePay(text);
    const domainMatch = DOMAINS.find(([, re]) => re.test(title) || re.test(text)) || ['SOFTWARE'];
    const domain = domainMatch[0];

    // Ensure referral attribution
    let referralLink = link;
    if (!referralLink.includes('referralCode=')) {
      const sep = referralLink.includes('?') ? '&' : '?';
      referralLink = `${referralLink}${sep}referralCode=${REFERRAL_CODE}&utm_source=referral&utm_medium=share&utm_campaign=job_referral`;
    }

    jobs.push({
      id: postId ? `micro1-${postId}` : undefined,
      title,
      pay: payInfo.pay,
      payUnit: payInfo.payUnit,
      payMin: payInfo.payMin,
      payMax: payInfo.payMax,
      domain,
      platform: 'Micro1',
      linkTarget: referralLink,
      linkIsSpecific: true,
      tags: ['Remote', 'Micro1'],
      description: `Active role on micro1. AI interview fast-track application. Compensation: ${payInfo.pay}.`
    });
  }

  if (!jobs.length) {
    alert('⚠️ No micro1 job cards found on this page.\n\nPlease verify you are on jobs.micro1.ai with jobs displayed.');
    return;
  }

  // 3. Post to directIngestJobs
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobs,
        token: TOKEN,
        syncedAt: new Date().toISOString(),
        platform: 'Micro1',
        fullSync: true
      })
    });

    if (res.ok) {
      alert(
        `🎉 TrainAIToGain micro1 Sync Complete!\n\n` +
        `✅ Successfully synced ${jobs.length} micro1 opportunities!\n` +
        `🔗 All roles tagged with referral code ${REFERRAL_CODE}.\n\n` +
        `Your catalog at trainaitogain.com/apply is now updated!`
      );
    } else {
      alert(`❌ Sync failed with status: ${res.status}`);
    }
  } catch(e) {
    alert(`❌ Sync network error: ${e.message}`);
  }
})();
