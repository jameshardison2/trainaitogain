// TrainAIToGain Deep Sync V15.4 (High-Yield Multi-Tab Virtual Explorer)
// Fully preserves ALL 290+ opportunities without deduplication collision,
// intercepts copy events across all mechanisms (textarea execCommand, clipboard API, setData, toast DOM),
// and syncs the complete catalog with dedicated referral links to TrainAIToGain.
(async function () {
  // 1. URL Guard & Guided Navigation
  if (!/mercor\.com/i.test(location.hostname)) {
    alert('Please open work.mercor.com/explore (Explore opportunities) in your browser, then run this bookmark again.');
    return;
  }
  if (!/\/explore/i.test(location.pathname)) {
    const goToExplore = confirm(
      'Mercor hosts all active job opportunities on the "Explore opportunities" page (work.mercor.com/explore).\n\n' +
      'Click OK to navigate to work.mercor.com/explore now, then click this bookmark again to start the sync.'
    );
    if (goToExplore) {
      location.href = 'https://work.mercor.com/explore';
    }
    return;
  }

  // 2. Start Notice
  alert('🚀 TrainAIToGain Deep Sync V15.4 started!\n\nScanning ALL 290+ "Project-based" & "One-time" opportunities...\nThis will scroll through all listings and capture dedicated referral links.\n\nPlease keep this tab open and do not touch your mouse or keyboard.');

  const FALLBACK_LINK = 'https://t.mercor.com/wbPMF';
  const ENDPOINT = 'https://us-central1-trainaitogain-50c19.cloudfunctions.net/directIngestJobs';
  const TOKEN = 'TRAINAITOGAIN_SYNC_SECURE_2026';
  const MAX_WAVES = 40;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 3. Multi-Channel Clipboard & Copy Sniffer (Intercepts textarea execCommand, writeText, setData)
  let lastCopied = '';
  try {
    const origWrite = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText.bind(navigator.clipboard) : null;
    if (origWrite) {
      navigator.clipboard.writeText = async t => {
        lastCopied = String(t || '');
        try { return await origWrite(t); } catch (e) { return true; }
      };
    }
  } catch (e) {}

  document.addEventListener('copy', e => {
    try {
      if (e.clipboardData) {
        if (typeof e.clipboardData.setData === 'function') {
          const origSet = e.clipboardData.setData.bind(e.clipboardData);
          e.clipboardData.setData = function (format, data) {
            if (data) lastCopied = String(data);
            return origSet(format, data);
          };
        }
        const text = e.clipboardData.getData('text/plain');
        if (text) lastCopied = text;
      }
    } catch (err) {}
  }, true);

  const origExec = document.execCommand;
  try {
    document.execCommand = function (cmd, showUI, value) {
      if (cmd && cmd.toLowerCase() === 'copy') {
        try {
          const el = document.activeElement;
          if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) {
            const val = el.value.substring(el.selectionStart, el.selectionEnd) || el.value;
            if (val) lastCopied = val;
          }
          if (!lastCopied && window.getSelection) {
            const s = window.getSelection().toString();
            if (s) lastCopied = s;
          }
        } catch (e) {}
      }
      return origExec ? origExec.apply(this, arguments) : true;
    };
  } catch (e) {}

  const LINK_RE = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?mercor\.com\/([a-zA-Z0-9_-]{4,20})/gi;
  const IGNORE_CODES = new Set(['explore', 'refer', 'referrals', 'earnings', 'profile', 'learn', 'home', 'signin', 'login', 'jobs', 'apply', 'wbpmf', 'submit', 'save', 'auth']);

  // Extract link strictly from clipboard, active textarea, or this specific card
  const getLinkFromClipboardOrCard = card => {
    // 1. Check lastCopied
    if (lastCopied) {
      const m = lastCopied.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?mercor\.com\/([a-zA-Z0-9_-]{4,20})/i);
      if (m && !IGNORE_CODES.has(m[1].toLowerCase())) {
        return 'https://t.mercor.com/' + m[1];
      }
    }

    // 2. Check activeElement if it was an offscreen copy textarea
    try {
      const act = document.activeElement;
      if (act && (act.tagName === 'TEXTAREA' || act.tagName === 'INPUT') && act.value) {
        const m = act.value.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?mercor\.com\/([a-zA-Z0-9_-]{4,20})/i);
        if (m && !IGNORE_CODES.has(m[1].toLowerCase())) {
          return 'https://t.mercor.com/' + m[1];
        }
      }
    } catch (e) {}

    // 3. Elements inside this card or newly appeared copy toast
    const cardCorpus = [
      ...Array.from(card.querySelectorAll('input, [data-copy-text], [data-url], [data-clipboard-text]')).map(el =>
        el.value || el.getAttribute('data-copy-text') || el.getAttribute('data-url') || el.getAttribute('data-clipboard-text') || ''
      ),
      ...Array.from(card.querySelectorAll('a')).map(a => a.href),
      ...Array.from(document.querySelectorAll('[role="status"], [role="alert"], [class*="toast" i]')).map(el => el.innerText || '')
    ].join(' ');

    const matches = Array.from(cardCorpus.matchAll(LINK_RE));
    const hits = matches
      .map(m => m[1])
      .filter(code => code && !IGNORE_CODES.has(code.toLowerCase()));

    return hits.length ? ('https://t.mercor.com/' + hits[hits.length - 1]) : null;
  };

  // 4. Pay & Compensation Parsing
  const parsePay = text => {
    const re = /\$\s*([\d,]+(?:\.\d+)?)(?:\s*[-–to]+\s*\$?\s*([\d,]+(?:\.\d+)?))?\s*(?:\/|per)\s*(hour|hr|month|mo|year|yr|task|one-time)/i;
    const m = (text || '').match(re);
    if (!m) return { pay: 'Competitive', payUnit: null, payMin: null, payMax: null };
    const n = s => s ? Number(s.replace(/,/g, '')) : null;
    const unitMap = { hour: 'hr', hr: 'hr', month: 'mo', mo: 'mo', year: 'yr', yr: 'yr', task: 'task', 'one-time': 'task' };
    const unit = unitMap[m[3].toLowerCase()] || 'hr';
    const min = n(m[1]), max = n(m[2]);
    const fmt = v => v.toLocaleString('en-US');
    const pay = '$' + fmt(min) + (max ? '–' + fmt(max) : '') + '/' + unit;
    return { pay, payUnit: unit, payMin: min, payMax: max || min };
  };

  // 5. Taxonomy & Domains
  const SKILLS = [
    'python','java','javascript','typescript','c++','c#','go','rust','sql','react','node','aws','gcp','azure',
    'machine learning','deep learning','nlp','llm','data science','data analysis','statistics','excel','tableau','power bi',
    'firmware','embedded','systems integration','devops','kubernetes','docker','security','networking','qa','testing',
    'finance','accounting','cfa','cpa','investment','banking','quant','trading','actuarial','economics',
    'legal','law','attorney','paralegal','compliance','regulatory',
    'medical','clinical','physician','nurse','nursing','pharmacy','healthcare','biology','chemistry','physics','mathematics',
    'forensics','toxicology','materials','energetic','chemical defense','ballistics',
    'writing','editing','translation','customer success','operations','sales','marketing','design','education','teaching'
  ];

  const keywordsFor = (title, desc) => {
    const text = (title + ' ' + desc).toLowerCase();
    return SKILLS.filter(k => text.includes(k)).slice(0, 15);
  };

  const DOMAINS = [
    ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed|preclinical/i],
    ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
    ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
    ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian|native speaker/i],
    ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
    ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear|energetic|forensic|toxicolog|ballistic|hazardous|defense/i],
    ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
  ];

  // 6. Card Finder on work.mercor.com/explore
  const getCards = () => {
    const candidates = Array.from(document.querySelectorAll('div, article, li, a')).filter(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 180 || r.width > 700 || r.height < 70 || r.height > 500) return false;
      const text = el.innerText || '';
      const hasPay = /\$\s*[\d,]+.*(\/|per)\s*(hour|hr|task|month|mo|year|yr|one-time)/i.test(text);
      const hasReferralOrHired = /\+\s*\$\d+|\b\d+\s*hired\b|new opportunity|1-click apply|apply\s*↗|submitted on|\$\s*\d{2,4}\b/i.test(text);
      return hasPay && hasReferralOrHired;
    });
    return candidates.filter(c => !candidates.some(o => o !== c && o.contains(c)));
  };

  // Find the referral button on each card (matches "$250", "$240", "+ $250", "& $250", etc.)
  const findCardReferralBtn = card => {
    const elements = Array.from(card.querySelectorAll('button, [role="button"], a, div, span, p'));
    const match = elements.find(el => {
      const t = (el.innerText || '').trim();
      const title = (el.getAttribute('title') || el.getAttribute('aria-label') || '').trim();

      // Tooltip match
      if (/referral|earn up to|copy (referral )?link/i.test(title)) return true;

      // Standalone referral dollar amount: $250, $240, +$250, & $250 (must NOT be hourly/task pay)
      if (/^(\+|&|\$|👤|\s)*\$\s*\d{2,4}$/i.test(t)) {
        return true;
      }

      // Explicit referral text
      if (/earn\s*\$|\brefer\b/i.test(t) && !/explore/i.test(t)) return true;

      return false;
    });

    if (!match) return null;
    return match.closest('button, [role="button"], a') || match.parentElement || match;
  };

  // Proper event dispatch for React synthetic event propagation
  const triggerClick = el => {
    if (!el) return;
    try {
      el.focus();
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      el.click();
    } catch (e) {
      try { el.click(); } catch (err) {}
    }
  };

  // Comprehensive Virtual Scroll Down
  const scrollAllDown = () => {
    window.scrollTo(0, document.body.scrollHeight);
    if (document.documentElement) document.documentElement.scrollTop = document.documentElement.scrollHeight;
    if (document.body) document.body.scrollTop = document.body.scrollHeight;

    const scrollables = Array.from(document.querySelectorAll('*')).filter(el => {
      try {
        const style = window.getComputedStyle(el);
        return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
      } catch (e) {
        return false;
      }
    });

    for (const el of scrollables) {
      el.scrollTop = el.scrollHeight;
      el.dispatchEvent(new Event('scroll', { bubbles: true }));
    }

    const cards = getCards();
    if (cards.length) {
      cards[cards.length - 1].scrollIntoView({ block: 'end', behavior: 'smooth' });
    }

    window.dispatchEvent(new Event('scroll'));
    document.dispatchEvent(new Event('scroll'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', code: 'PageDown', bubbles: true }));

    // Check for explicit Next / Load More buttons
    const nextOrMore = Array.from(document.querySelectorAll('button, a, [role="button"]')).find(el => {
      const t = (el.innerText || el.getAttribute('aria-label') || '').trim();
      return (/load more|show more|view more/i.test(t) || /^(next|>|→|»)$/i.test(t)) && el.getBoundingClientRect().width > 0 && !el.disabled;
    });
    if (nextOrMore) {
      try { nextOrMore.click(); } catch (e) {}
    }

    // Dismiss any accidental popups or open drawer
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
  };

  // 7. Scanning Loop Across Tabs
  const TARGET_TABS = ['Project-based', 'One-time'];
  const allJobs = [];

  for (const tabName of TARGET_TABS) {
    console.log(`[Mercor Sync] >>> Switching to tab: ${tabName} <<<`);

    const tabEl = Array.from(document.querySelectorAll('button, a, [role="tab"], div, span')).find(el =>
      el.innerText && el.innerText.trim() === tabName && el.getBoundingClientRect().width > 0 && el.children.length <= 2
    );

    if (tabEl) {
      tabEl.scrollIntoView({ block: 'center' });
      await sleep(300);
      tabEl.click();
      await sleep(2200);
    }

    let tabProcessedKeys = new Set();
    let stagnantPasses = 0;

    for (let wave = 1; wave <= MAX_WAVES; wave++) {
      let cards = [];
      for (let w = 0; w < 6000; w += 600) {
        cards = getCards();
        if (cards.length) break;
        await sleep(600);
      }

      if (!cards.length) {
        console.log(`[Mercor Sync] No cards visible on tab ${tabName} at wave ${wave}`);
        break;
      }

      let newCardsInThisWave = 0;

      for (let i = 0; i < cards.length; i++) {
        const currentCards = getCards();
        if (i >= currentCards.length) break;
        const card = currentCards[i];
        const cardText = card.innerText || '';

        // Extract title
        const titleEl = card.querySelector('h1, h2, h3, h4, h5, [class*="title" i], strong') || card;
        let rawTitle = titleEl.getAttribute('title') || titleEl.getAttribute('aria-label') || titleEl.innerText || '';
        let title = rawTitle.split('\n')[0].replace(/^(submitted on|1-click apply|new opportunity|apply\s*↗)\s*/i, '').trim();

        // If title was visually truncated with ..., look for slug in link URL to get the full title
        const jobLinkEl = card.querySelector('a[href*="/"]');
        if (jobLinkEl) {
          const href = jobLinkEl.getAttribute('href') || '';
          const slugMatch = href.match(/\/([a-z0-9-]+)(?:\?|$)/i);
          if (slugMatch && slugMatch[1] && (title.includes('...') || title.includes('…'))) {
            const expanded = slugMatch[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            if (expanded.length > title.length - 3) title = expanded;
          }
        }

        if (title.includes('$')) title = cardText.split('\n')[0].trim();
        title = title.replace(/\s+/g, ' ').trim();
        if (!title || title.length < 3) continue;

        const payInfo = parsePay(cardText);
        const dedupeKey = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (tabProcessedKeys.has(dedupeKey)) continue;
        tabProcessedKeys.add(dedupeKey);
        newCardsInThisWave++;

        // Scroll card gently into view
        card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        await sleep(60);

        // --- Click the Referral Button Directly on the Card ---
        lastCopied = '';
        let link = null;
        const refBtn = findCardReferralBtn(card);
        if (refBtn) {
          try {
            triggerClick(refBtn);
            for (let w = 0; w < 600; w += 80) {
              await sleep(80);
              link = getLinkFromClipboardOrCard(card);
              if (link) break;
            }
          } catch (e) {}
        }

        // Domain classification
        const domainMatch = DOMAINS.find(([, re]) => re.test(title)) || ['GENERAL'];
        const domain = domainMatch[0];
        const tags = ['Remote', tabName];

        const cleanDesc = `Active ${tabName} role on Mercor. Compensation is ${payInfo.pay}. Direct fast-track application through verified Mercor talent network.`;

        allJobs.push({
          title,
          pay: payInfo.pay,
          payUnit: payInfo.payUnit,
          payMin: payInfo.payMin,
          payMax: payInfo.payMax,
          description: cleanDesc,
          atsKeywords: keywordsFor(title, cleanDesc),
          tags,
          linkTarget: link || FALLBACK_LINK,
          linkIsSpecific: !!link && link !== FALLBACK_LINK,
          domain,
          platform: 'Mercor',
          sourceTab: tabName
        });

        console.log(`[Mercor Sync] [${tabName}] #${allJobs.length} ${title} | ${payInfo.pay} | ${link || 'fallback'}`);
      }

      if (newCardsInThisWave === 0) {
        stagnantPasses++;
        if (stagnantPasses >= 3) {
          console.log(`[Mercor Sync] Finished tab ${tabName}. Captured ${tabProcessedKeys.size} roles.`);
          break;
        }
      } else {
        stagnantPasses = 0;
      }

      scrollAllDown();
      await sleep(1400);
    }
  }

  // 8. Deduplicate Strictly by Title (Never Collapsing by Link!)
  const byKey = new Map();
  for (const j of allJobs) {
    const key = j.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!byKey.has(key)) {
      byKey.set(key, j);
    } else if (j.linkIsSpecific && !byKey.get(key).linkIsSpecific) {
      byKey.set(key, j);
    }
  }
  const jobs = Array.from(byKey.values());

  if (!jobs.length) {
    alert('⚠️ No Mercor jobs could be found.\n\nPlease ensure you are at work.mercor.com/explore and logged in.');
    return;
  }

  // 9. Ingest to TrainAIToGain Firestore Cloud Functions
  let ok = false, status = '';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobs,
        token: TOKEN,
        syncedAt: new Date().toISOString(),
        platform: 'Mercor',
        fullSync: true
      })
    });
    ok = res.ok;
    status = res.status;
  } catch (e) {
    status = e.message;
  }

  // 10. Accurate Summary Breakdown
  const specificCount = jobs.filter(j => j.linkIsSpecific).length;
  const fallbackCount = jobs.filter(j => !j.linkIsSpecific).length;

  if (ok) {
    alert(
      `🎉 TrainAIToGain Deep Sync Complete!\n\n` +
      `✅ Successfully synced ${jobs.length} total Mercor opportunities across all tabs!\n` +
      `🔗 ${specificCount} roles with dedicated 1-click referral links.\n` +
      `📎 ${fallbackCount} roles with general referral link.\n\n` +
      `Your live catalog at trainaitogain.com/apply is now fully loaded!`
    );
  } else {
    alert(`❌ Sync Failed (Status: ${status}). Cloud function did not accept the data. Please check connection.`);
  }
})();
