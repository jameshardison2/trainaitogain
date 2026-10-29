// TrainAIToGain Deep Sync V1.1 for micro1 (Direct Multi-Page API Lightning Sync)
// Scans ALL 294+ expert opportunities across micro1 in ~2 seconds.
// Attaches 1-click partner referral attribution: referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe
(async function () {
  if (!/micro1\.ai/i.test(location.hostname)) {
    const goToJobs = confirm(
      'micro1 hosts all active opportunities on micro1.ai/experts/opportunities.\n\n' +
      'Click OK to open opportunities now, then run this bookmark again to sync!'
    );
    if (goToJobs) location.href = 'https://www.micro1.ai/experts/opportunities';
    return;
  }

  const REFERRAL_CODE = '05216c9f-87cc-49af-b448-f9f8a18d2efe';
  const ENDPOINT = 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs';
  const TOKEN = 'TRAINAITOGAIN_SYNC_SECURE_2026';

  alert(
    '🚀 TrainAIToGain micro1 Deep Sync V1.1 started!\n\n' +
    'Directly querying micro1 portal API for ALL 294+ active roles...\n' +
    'Attaching dedicated referral attribution: ' + REFERRAL_CODE + '\n\n' +
    'Please wait ~3 seconds...'
  );

  const DOMAINS = [
    ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed/i],
    ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
    ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
    ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian/i],
    ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
    ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear/i],
    ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
  ];

  const formatPay = (rateObj, yearlyComp, monthlyMin, monthlyMax) => {
    if (rateObj && (rateObj.min || rateObj.max)) {
      const min = rateObj.min, max = rateObj.max;
      if (min && max && min !== max) return `$${min}–$${max}/hr`;
      if (min) return `$${min}/hr`;
      if (max) return `$${max}/hr`;
    }
    if (monthlyMin || monthlyMax) {
      if (monthlyMin && monthlyMax && monthlyMin !== monthlyMax) return `$${monthlyMin.toLocaleString()}–$${monthlyMax.toLocaleString()}/mo`;
      if (monthlyMin) return `$${monthlyMin.toLocaleString()}/mo`;
      if (monthlyMax) return `$${monthlyMax.toLocaleString()}/mo`;
    }
    if (yearlyComp) return `$${Number(yearlyComp).toLocaleString()}/yr`;
    return 'Competitive';
  };

  let rawJobs = [];
  try {
    for (let p = 1; p <= 6; p++) {
      const res = await fetch(`https://prod-api.micro1.ai/api/v1/job/portal?page=${p}&limit=100&keyword=`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_all_jobs', filters: { type: ['EXPERT'] } })
      });
      if (!res.ok) break;
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        rawJobs = rawJobs.concat(json.data);
      } else {
        break;
      }
    }
  } catch (err) {
    alert('❌ Could not connect to micro1 API: ' + err.message);
    return;
  }

  const seen = new Set();
  const jobs = [];

  for (const r of rawJobs) {
    if (!r.job_id || seen.has(r.job_id)) continue;
    seen.add(r.job_id);

    const title = (r.job_name || 'Software Engineer').trim();
    const skills = Array.isArray(r.skills) ? r.skills : [];
    const payStr = formatPay(r.ideal_hourly_rate, r.ideal_yearly_compensation, r.ideal_monthly_salary_min, r.ideal_monthly_salary_max);
    
    let domain = 'GENERAL';
    const corpus = title + ' ' + skills.join(' ');
    for (const [dom, re] of DOMAINS) {
      if (re.test(corpus)) { domain = dom; break; }
    }

    const linkTarget = `https://jobs.micro1.ai/post/${r.job_id}?referralCode=${REFERRAL_CODE}&utm_source=referral&utm_medium=share&utm_campaign=job_referral`;

    jobs.push({
      id: `micro1-${r.job_id}`,
      title,
      pay: payStr,
      payUnit: payStr.includes('/hr') ? 'hr' : (payStr.includes('/mo') ? 'mo' : (payStr.includes('/yr') ? 'yr' : null)),
      domain,
      platform: 'Micro1',
      linkTarget,
      linkIsSpecific: true,
      tags: ['Remote', 'Micro1'],
      atsKeywords: skills,
      description: `Active expert role on micro1. AI interview fast-track application. Compensation: ${payStr}.`
    });
  }

  if (!jobs.length) {
    alert('⚠️ No micro1 opportunities returned from API.');
    return;
  }

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
        `🎉 TrainAIToGain micro1 Deep Sync Complete!\n\n` +
        `✅ Successfully synced ALL ${jobs.length} micro1 opportunities!\n` +
        `🔗 100% tagged with referral code ${REFERRAL_CODE}.\n\n` +
        `Your live catalog at trainaitogain.com/apply is now fully updated!`
      );
    } else {
      alert(`❌ Sync failed with status: ${res.status}`);
    }
  } catch(e) {
    alert(`❌ Sync network error: ${e.message}`);
  }
})();
