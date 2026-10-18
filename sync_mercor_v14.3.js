// TrainAIToGain Deep Sync V14.3
// Enhanced with universal pagination (page numbers 2, 3, 4..., chevrons, and unified tabs)
(async function () {
  if (/mercor\.com/i.test(location.hostname) && !/\/refer/i.test(location.pathname)) {
    alert('Please open work.mercor.com/refer (the Referrals page), then run this bookmark again.');
    return;
  }
  if (!/mercor\.com/i.test(location.hostname)) {
    alert('Open your Mercor referral jobs page first, then run this bookmark.');
    return;
  }
  alert('TrainAIToGain Deep Sync V14.3 started. Scanning roles across pages... Please do not touch your mouse.');
  const FALLBACK_LINK = 'https://t.mercor.com/wbPMF';
  const ENDPOINT = 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs';
  const TOKEN = 'TRAINAITOGAIN_SYNC_SECURE_2026';
  const MAX_PAGES = 25;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let lastCopied = '';
  try {
    const origWrite = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText.bind(navigator.clipboard) : null;
    if (origWrite) {
      navigator.clipboard.writeText = t => { lastCopied = String(t || ''); return origWrite(t); };
    }
  } catch (e) {}
  document.addEventListener('copy', e => {
    try {
      const t = (e.clipboardData && e.clipboardData.getData('text/plain')) || String(window.getSelection());
      if (t) lastCopied = t;
    } catch (err) {}
  }, true);

  const LINK_RE = /https:\/\/t\.mercor\.com\/[a-zA-Z0-9]{4,12}/g;
  const findSpecificLink = () => {
    const corpus = [
      lastCopied,
      document.body.innerText,
      ...Array.from(document.querySelectorAll('input, textarea')).map(i => i.value),
      ...Array.from(document.querySelectorAll('a')).map(a => a.href)
    ].join(' ');
    const hits = Array.from(corpus.matchAll(LINK_RE)).map(m => m[0]).filter(u => !u.includes('wbPMF'));
    return hits.length ? hits[hits.length - 1] : null;
  };

  const clickShareButton = () => {
    const btn = Array.from(document.querySelectorAll('button, a, [role="button"]')).find(el => {
      const t = (el.innerText || el.getAttribute('aria-label') || '').trim();
      return t.length < 40 && /copy (referral )?link|share|refer/i.test(t) && el.getBoundingClientRect().width > 0;
    });
    if (btn) { try { btn.click(); } catch (e) {} return true; }
    return false;
  };

  const parsePay = text => {
    const re = /\$\s*([\d,]+(?:\.\d+)?)(?:\s*[-–to]+\s*\$?\s*([\d,]+(?:\.\d+)?))?\s*(?:\/|per)\s*(hour|hr|month|mo|year|yr|task)/i;
    const m = (text || '').match(re);
    if (!m) return { pay: 'Competitive', payUnit: null, payMin: null, payMax: null };
    const n = s => s ? Number(s.replace(/,/g, '')) : null;
    const unitMap = { hour: 'hr', hr: 'hr', month: 'mo', mo: 'mo', year: 'yr', yr: 'yr', task: 'task' };
    const unit = unitMap[m[3].toLowerCase()];
    const min = n(m[1]), max = n(m[2]);
    const fmt = v => v.toLocaleString('en-US');
    const pay = '$' + fmt(min) + (max ? '–' + fmt(max) : '') + '/' + unit;
    return { pay, payUnit: unit, payMin: min, payMax: max || min };
  };

  const SKILLS = ['python','java','javascript','typescript','c++','c#','go','rust','sql','react','node','aws','gcp','azure','machine learning','deep learning','nlp','llm','data science','data analysis','statistics','excel','tableau','power bi','firmware','embedded','systems integration','devops','kubernetes','docker','security','networking','qa','testing','finance','accounting','cfa','cpa','investment','banking','quant','trading','actuarial','economics','legal','law','attorney','paralegal','compliance','regulatory','medical','clinical','physician','nurse','nursing','pharmacy','healthcare','biology','chemistry','physics','mathematics','writing','editing','translation','customer success','operations','sales','marketing','design','education','teaching'];
  const keywordsFor = (title, desc) => {
    const text = (title + ' ' + desc).toLowerCase();
    return SKILLS.filter(k => text.includes(k)).slice(0, 15);
  };

  const getCards = () => {
    const cards = Array.from(document.querySelectorAll('div, a, li')).filter(el => {
      if (window.getComputedStyle(el).cursor !== 'pointer') return false;
      const r = el.getBoundingClientRect();
      if (r.width < 200 || r.width > 600 || r.height < 50 || r.height > 400) return false;
      return /\$|\d+ hired|New opportunity|1-click apply/i.test(el.innerText || '');
    });
    return cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
  };

  const goBack = async i => {
    const back = Array.from(document.querySelectorAll('a, button'))
      .find(el => (el.innerText || '').includes('View all opportunities') && (el.innerText || '').length < 50);
    if (!back) return;
    back.click();
    for (let w = 0; w < 10000; w += 1000) { await sleep(1000); if (getCards().length > i) break; }
  };

  // Check if legacy tabs exist, otherwise single unified pass
  const ALL_TABS = ['Project-based', 'One-time', 'Talent Network'];
  const foundTabs = ALL_TABS.filter(tab => Array.from(document.querySelectorAll('button, a, li, span, div')).some(el => el.innerText && el.innerText.trim() === tab && el.children.length <= 1 && el.getBoundingClientRect().width > 0));
  const activeTabs = foundTabs.length > 0 ? foundTabs : [null];

  const allJobs = [];
  let uniqueLinks = 0, fallbackLinks = 0;

  for (const tab of activeTabs) {
    if (tab) {
      const tabEl = Array.from(document.querySelectorAll('button, a, li, span, div')).find(el => el.innerText && el.innerText.trim() === tab && el.children.length <= 1 && el.getBoundingClientRect().width > 0);
      if (tabEl) { tabEl.scrollIntoView({ block: 'center' }); await sleep(500); tabEl.click(); await sleep(3000); }
    }

    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      let initial = [];
      for (let w = 0; w < 15000; w += 1000) { initial = getCards(); if (initial.length) break; await sleep(1000); }
      if (!initial.length) break;

      for (let i = 0; i < initial.length; i++) {
        let cards = getCards();
        if (cards.length <= i) { await goBack(i); cards = getCards(); }
        if (cards.length <= i) break;
        const card = cards[i];
        const cardText = card.innerText || '';
        const titleNode = card.querySelector('h1, h2, h3, h4, strong') || card;
        let title = (titleNode.innerText || '').split('\n')[0].trim();
        if (title.includes('$')) title = cardText.split('\n')[0].trim();
        if (!title) continue;
        const payInfo = parsePay(cardText);
        card.scrollIntoView({ block: 'center' });
        await sleep(500);
        lastCopied = '';
        (card.querySelector('a') || card).click();
        let link = null, triedShare = false;
        for (let w = 0; w < 8000; w += 500) {
          link = findSpecificLink();
          if (link) break;
          if (!triedShare && w >= 2500) { triedShare = clickShareButton(); }
          await sleep(500);
        }
        if (link) uniqueLinks++; else { fallbackLinks++; link = FALLBACK_LINK; }
        let raw = '';
        const PAYLINE = /\$\s*[\d,]+[^\n]{0,20}(\/|per)\s*(hour|hr|month|mo|year|yr|task)/gi;
        const panes = Array.from(document.querySelectorAll('div, section, [role="dialog"]')).filter(el => {
          const r = el.getBoundingClientRect();
          if (r.width < 300 || r.height < 200) return false;
          const t = el.innerText || '';
          if (!t.includes(title)) return false;
          if (/signed up|application started|referee|earnings cap|paid to date|my referrals|my connections|bulk reminder|vouched/i.test(t)) return false;
          return (t.match(PAYLINE) || []).length <= 1;
        });
        if (panes.length) { panes.sort((a, b) => a.innerText.length - b.innerText.length); raw = panes[0].innerText; }
        const JUNK = /signed up|application (started|completed)|offer extended|referee|earnings cap|paid to date|vouched|bulk reminder|loaded \d+ of|my referrals|my connections|steps? completed|submitted on|hired this month|early applicant|1-click apply|new opportunity|posted by|referral|refer |earn \$|bonus|^apply\b|^share\b|copy link|view all opportunities|^\$[\d,]+$|^[A-Z]$|^\d+ hired/i;
        const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 30 && l !== title && !JUNK.test(l) && !/\$\s*[\d,]+\s*(-|–|to)?\s*\$?[\d,]*\s*(\/|per)\s*(hour|hr|month|mo|year|yr|task)/i.test(l));
        const cleanDesc = lines.join(' ').replace(/\s+/g, ' ').trim();
        if (payInfo.pay === 'Competitive') Object.assign(payInfo, parsePay(raw));
        const DOMAINS = [
          ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed|preclinical/i],
          ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
          ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
          ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian|native speaker/i],
          ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
          ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear|energetic/i],
          ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
        ];
        const domain = (DOMAINS.find(([, re]) => re.test(title)) || DOMAINS.find(([, re]) => re.test(cleanDesc)) || ['GENERAL'])[0];
        const tags = [...new Set((cleanDesc.match(/\b(Remote|Onsite|Hybrid|US Only|India|LatAm)\b/ig) || ['Remote']).map(t => t[0].toUpperCase() + t.slice(1)))];
        allJobs.push({ title, pay: payInfo.pay, payUnit: payInfo.payUnit, payMin: payInfo.payMin, payMax: payInfo.payMax, description: cleanDesc.substring(0, 350) + (cleanDesc.length > 350 ? '...' : ''), atsKeywords: keywordsFor(title, cleanDesc), tags, linkTarget: link, linkIsSpecific: link !== FALLBACK_LINK, domain, platform: 'Mercor', sourceTab: tab || 'All' });
        console.log('[' + (tab || 'All') + '] ' + title + ' | ' + payInfo.pay + ' | ' + link);
        await goBack(i);
      }

      // Universal Next Page Finder: looks for page number, aria-label, chevron, or Next button
      const nextPageNum = pageNum + 1;
      let next = Array.from(document.querySelectorAll('button, a, [role="button"]')).find(el => el.innerText && el.innerText.trim() === String(nextPageNum) && el.getBoundingClientRect().width > 0 && !el.disabled);
      if (!next) {
        next = document.querySelector('[aria-label*="next page" i], [aria-label*="next" i], [title*="next" i]');
      }
      if (!next) {
        next = Array.from(document.querySelectorAll('button, a')).find(el => {
          const t = (el.innerText || el.getAttribute('aria-label') || '').trim();
          return (/^(next|>|→|»)$/i.test(t) || t.toLowerCase().includes('next')) && el.getBoundingClientRect().width > 0 && !el.disabled;
        });
      }
      if (!next || next.disabled || next.getAttribute('aria-disabled') === 'true') break;
      next.scrollIntoView({ block: 'center' });
      await sleep(600);
      next.click();
      for (let w = 0; w < 10000; w += 1000) {
        await sleep(1000);
        const active = document.querySelector('button[aria-current="page"], [class*="active"], [aria-selected="true"]');
        if (active && active.innerText == nextPageNum) break;
      }
    }
  }

  const byKey = new Map();
  for (const j of allJobs) {
    const key = j.linkIsSpecific ? j.linkTarget : (j.title + '|' + j.pay);
    if (!byKey.has(key)) byKey.set(key, j);
  }
  const jobs = Array.from(byKey.values());
  let ok = false, status = '';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs, token: TOKEN, syncedAt: new Date().toISOString(), platform: 'Mercor', fullSync: true })
    });
    ok = res.ok; status = res.status;
  } catch (e) { status = e.message; }
  alert((ok ? 'Sync complete. ' : 'Sync FAILED (' + status + '). Nothing was saved. ') + jobs.length + ' roles found. ' + uniqueLinks + ' with their own referral link, ' + fallbackLinks + ' using the general link.');
})();
