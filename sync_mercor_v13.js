// TrainAIToGain Deep Sync V13
// Run on Mercor's referral jobs page (the page your V12 bookmark runs on).
// Changes from V12:
//  1. Grabs each role's OWN referral link (catches the link when Mercor copies it
//     to the clipboard, and clicks Share / Copy link / Refer if needed).
//  2. Reads pay correctly: commas, ranges, and the real unit (/hr, /mo, /yr, /task).
//     No more $50000/hr.
//  3. Collects every tab and page first, then sends ONE update at the end, so a
//     later page can never overwrite earlier pages.
//  4. Adds ATS keywords from the title and description, so the ATS scanner can match.
//  5. Sends a real sync date, and dedupes by link (or title + pay), so two
//     different "Finance Expert" roles stay separate and true duplicates collapse.
//  6. Ends with a report: roles found, unique links vs fallback links.
(async function () {
  if (!/mercor\.com/i.test(location.hostname)) {
    alert('Open your Mercor referral jobs page first, then run this bookmark.');
    return;
  }
  alert('TrainAIToGain Deep Sync V13 started. Please do not touch your mouse until the final message.');

  const FALLBACK_LINK = 'https://t.mercor.com/wbPMF';
  const ENDPOINT = 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs';
  const TOKEN = 'TRAINAITOGAIN_SYNC_SECURE_2026'; // rotate this (see notes)
  const TABS = ['Project-based', 'One-time', 'Talent Network'];
  const MAX_PAGES = 40;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ---- 1. Catch referral links Mercor copies to the clipboard ----
  let lastCopied = '';
  try {
    const origWrite = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText.bind(navigator.clipboard) : null;
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

  // ---- 2. Pay parsing ----
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

  // ---- 4. ATS keywords ----
  const SKILLS = ['python','java','javascript','typescript','c++','c#','go','rust','sql','react','node','aws','gcp','azure',
    'machine learning','deep learning','nlp','llm','data science','data analysis','statistics','excel','tableau','power bi',
    'firmware','embedded','systems integration','devops','kubernetes','docker','security','networking','qa','testing',
    'finance','accounting','cfa','cpa','investment','banking','quant','trading','actuarial','economics',
    'legal','law','attorney','paralegal','compliance','regulatory',
    'medical','clinical','physician','nurse','nursing','pharmacy','healthcare','biology','chemistry','physics','mathematics',
    'writing','editing','translation','customer success','operations','sales','marketing','design','education','teaching'];
  const keywordsFor = (title, desc) => {
    const text = (title + ' ' + desc).toLowerCase();
    return SKILLS.filter(k => text.includes(k)).slice(0, 15);
  };

  // ---- Card finding (same rules as V12) ----
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

  const allJobs = [];
  let uniqueLinks = 0, fallbackLinks = 0;

  for (const tab of TABS) {
    const tabEl = Array.from(document.querySelectorAll('button, a, li, span, div')).find(el =>
      el.innerText && el.innerText.trim() === tab && el.children.length <= 1 && el.getBoundingClientRect().width > 0);
    if (tabEl) { tabEl.scrollIntoView({ block: 'center' }); await sleep(500); tabEl.click(); await sleep(3000); }

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

        // Wait for a specific link; after 2.5s try the Share / Copy link button once.
        let link = null, triedShare = false;
        for (let w = 0; w < 8000; w += 500) {
          link = findSpecificLink();
          if (link) break;
          if (!triedShare && w >= 2500) { triedShare = clickShareButton(); }
          await sleep(500);
        }
        if (link) uniqueLinks++; else { fallbackLinks++; link = FALLBACK_LINK; }

        let description = '';
        const panes = Array.from(document.querySelectorAll('div')).filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 300 && r.height > 300 && (el.innerText || '').includes('Application');
        });
        if (panes.length) { panes.sort((a, b) => a.innerText.length - b.innerText.length); description = panes[0].innerText; }
        else {
          const modal = document.querySelector('[role="dialog"], [class*="drawer"]');
          if (modal) description = modal.innerText;
        }
        if (!description) description = cardText;
        const cleanDesc = description.replace(/\s+/g, ' ').trim();
        if (payInfo.pay === 'Competitive') Object.assign(payInfo, parsePay(cleanDesc));

        const tags = [...new Set((cleanDesc.match(/\b(Remote|Onsite|Hybrid|US Only|India|LatAm)\b/ig) || ['Remote'])
          .map(t => t[0].toUpperCase() + t.slice(1)))];

        allJobs.push({
          title,
          pay: payInfo.pay,
          payUnit: payInfo.payUnit,
          payMin: payInfo.payMin,
          payMax: payInfo.payMax,
          description: cleanDesc.substring(0, 350) + (cleanDesc.length > 350 ? '...' : ''),
          atsKeywords: keywordsFor(title, cleanDesc),
          tags,
          linkTarget: link,
          linkIsSpecific: link !== FALLBACK_LINK,
          platform: 'Mercor',
          sourceTab: tab
        });
        console.log('[' + tab + '] ' + title + ' | ' + payInfo.pay + ' | ' + link);
        await goBack(i);
      }

      // Next page
      let next = document.querySelector('[aria-label="Next page"], [aria-label*="next"], button[title*="Next"]');
      if (!next) {
        next = Array.from(document.querySelectorAll('*')).find(el => {
          if (el.children.length > 2) return false;
          const t = (el.textContent || '').trim();
          if (!/^Next\s*>?$/.test(t)) return false;
          return el.getBoundingClientRect().width > 0 && getComputedStyle(el).opacity !== '0.5' &&
            el.getAttribute('aria-disabled') !== 'true' && !el.disabled;
        });
      }
      if (!next || next.disabled || next.getAttribute('aria-disabled') === 'true') break;
      next.scrollIntoView({ block: 'center' });
      await sleep(600);
      next.click();
      for (let w = 0; w < 10000; w += 1000) {
        await sleep(1000);
        const active = document.querySelector('button[aria-current="page"], [class*="active"]');
        if (active && active.innerText == pageNum + 1) break;
      }
    }
  }

  // ---- 5. Dedupe: by specific link, otherwise by title + pay ----
  const byKey = new Map();
  for (const j of allJobs) {
    const key = j.linkIsSpecific ? j.linkTarget : (j.title + '|' + j.pay);
    if (!byKey.has(key)) byKey.set(key, j);
  }
  const jobs = Array.from(byKey.values());

  // ---- 3. One update at the end ----
  let ok = false, status = '';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs, token: TOKEN, syncedAt: new Date().toISOString(), platform: 'Mercor', fullSync: true })
    });
    ok = res.ok; status = res.status;
  } catch (e) { status = e.message; }

  alert((ok ? 'Sync complete. ' : 'Sync FAILED (' + status + '). Nothing was saved. ') +
    jobs.length + ' roles found. ' + uniqueLinks + ' with their own referral link, ' +
    fallbackLinks + ' using the general link.');
})();
