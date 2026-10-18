// render_waves.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Fallback Soft Landing & Apply Click
if (!window.updateAllPlatformWarnings) {
    window.updateAllPlatformWarnings = function(currentPlatform) {
        document.querySelectorAll('.diff-platform-alert').forEach(function(el) {
            var rolePlatform = el.getAttribute('data-role-platform');
            if (rolePlatform && rolePlatform !== currentPlatform) {
                el.style.display = 'block';
                var prevEl = el.querySelector('.prev-platform-name');
                if (prevEl) prevEl.innerText = currentPlatform;
            } else {
                el.style.display = 'none';
            }
        });
    };
}

if (!window.handleApplyClick) {
    window.handleApplyClick = function(title, linkTarget, btn, roleId, matchScore, domain) {
        if (window.event) window.event.stopPropagation();
        const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
        let targetUrl = linkTarget || 'https://t.mercor.com/wbPMF';
        
        if (refCode && targetUrl.includes('mercor')) {
            if (!targetUrl.includes('ref=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(refCode);
        } else if (refCode && targetUrl.includes('micro1')) {
            if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(refCode);
        }

        const isMicro1 = targetUrl.includes('micro1');
        const platformName = isMicro1 ? 'micro1' : 'Mercor';
        const prevPlatform = localStorage.getItem('tgt_last_applied_platform') || '';
        localStorage.setItem('tgt_last_applied_platform', platformName);

        if (typeof window.updateAllPlatformWarnings === 'function') {
            window.updateAllPlatformWarnings(platformName);
        }

        let applyCount = parseInt(localStorage.getItem('tgt_apply_count') || '0', 10) + 1;
        localStorage.setItem('tgt_apply_count', String(applyCount));
        let applyNumber = applyCount === 1 ? '1st' : (applyCount === 2 ? '2nd' : (applyCount === 3 ? '3rd' : applyCount + 'th'));

        const computedRoleId = roleId || (title || 'role').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const isMobileDevice = window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
        const deviceType = isMobileDevice ? 'mobile' : (window.innerWidth <= 1024 ? 'tablet' : 'desktop');

        if (typeof gtag === 'function') {
            const eventPayload = {
                platform: platformName,
                role_title: title,
                role_id: computedRoleId,
                match_score: matchScore !== undefined && matchScore !== null ? matchScore : null,
                device_type: deviceType,
                from_page: 'active_roles',
                apply_number: applyNumber,
                link_url: targetUrl,
                outbound: true
            };
            gtag('event', 'apply_click', eventPayload);
            gtag('event', 'job_apply_click', eventPayload);
        }

        const isGenericMercor = targetUrl.includes('wbPMF');
        if (isGenericMercor && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(title).catch(() => {});
        }

        // 1. Immediately open the platform in a new tab (Never blocks click)
        window.open(targetUrl, '_blank');

        // 2. Locate card element and expand with Soft Landing
        const cardEl = btn ? (btn.closest('.opp-card') || btn.closest('.wave-card')) : null;

        if (cardEl && !cardEl.querySelector('.apply-soft-landing')) {
            const softLandingEl = document.createElement('div');
            softLandingEl.className = 'apply-soft-landing';
            softLandingEl.style.cssText = 'background:#f0fdf4; border:1.5px solid #10b981; border-radius:10px; padding:18px; margin-top:16px; text-align:left; animation:slideUp 0.3s ease; box-sizing:border-box; width:100%;';

            const safeTitleStr = (title || 'Role').replace(/'/g, "\\'");
            const safeTargetStr = (targetUrl || '').replace(/'/g, "\\'");
            const safePlatformStr = platformName;

            let diffPlatformBannerHtml = '';
            if (prevPlatform && prevPlatform !== platformName) {
                diffPlatformBannerHtml = `
                    <div style="background:#fee2e2; border:1.5px solid #ef4444; border-radius:8px; padding:10px 12px; margin-bottom:12px; color:#991b1b; font-size:12px; line-height:1.45;">
                        <div style="display:flex; align-items:center; gap:6px; font-weight:800; color:#dc2626; margin-bottom:3px; font-size:11px; text-transform:uppercase;">
                            <span>🚨 DIFFERENT PLATFORM WARNING</span>
                        </div>
                        You switched from <strong>${prevPlatform}</strong> to <strong>${platformName}</strong>! Remember: your ${prevPlatform} credentials will not work here. You must create a new account on ${platformName} in this browser.
                    </div>
                `;
            }

            softLandingEl.innerHTML = `
                ${diffPlatformBannerHtml}
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                    <span style="font-size:22px;">🚀</span>
                    <h4 style="margin:0; font-size:16px; font-weight:800; color:#065f46;">You’re headed to ${platformName}. Here’s what’s next:</h4>
                </div>
                <ol style="margin:0 0 16px 0; padding-left:20px; font-size:13px; color:#166534; line-height:1.6;">
                    <li style="margin-bottom:6px;"><strong>Create your free account</strong> in this same browser so your referral carries over.</li>
                    <li style="margin-bottom:6px;"><strong>The AI interview takes about 20 minutes</strong>, so practice first if you like: 
                        <a href="/ai-interview" target="_blank" onclick="window.trackHandoffMock ? window.trackHandoffMock('${safeTitleStr}', '${safePlatformStr}') : null" style="color:#059669; font-weight:700; text-decoration:underline;">[mock interview]</a> &bull; 
                        <a href="/readiness-checklist" target="_blank" style="color:#059669; font-weight:700; text-decoration:underline;">[readiness checklist]</a>
                    </li>
                    <li><strong>Matching can take a few days</strong>, and silence doesn’t mean no.</li>
                </ol>
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; border-top:1px solid #bbf7d0; padding-top:12px;">
                    <span style="font-size:12px; color:#15803d; font-weight:600;">Track in Dashboard & set reminder:</span>
                    <button type="button" onclick="event.stopPropagation(); window.markCardStarted ? window.markCardStarted('${safeTitleStr}', '${safeTargetStr}', '${safePlatformStr}', this) : null" style="background:#10b981; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:700; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                        Mark as Started ✓
                    </button>
                </div>
            `;
            cardEl.appendChild(softLandingEl);

            if (typeof gtag === 'function') {
                gtag('event', 'handoff_shown', {
                    platform: platformName,
                    role_title: title,
                    role_id: computedRoleId,
                    device_type: deviceType
                });
            }
        }

        // 3. Show "Roles like this one" under card
        if (cardEl && typeof showRolesLikeThisOne === 'function' && !cardEl.querySelector('.roles-like-this-one')) {
            showRolesLikeThisOne(cardEl, domain || 'SOFTWARE', title);
        }

        // 4. Record last clicked apply for non-blocking return prompt
        window.lastClickedApply = {
            title: title,
            targetUrl: targetUrl,
            platform: platformName,
            domain: domain,
            cardEl: cardEl,
            prompted: false
        };
    };
}

// Fallback Mobile Save Link
if (!window.handleMobileSave) {
    window.handleMobileSave = function(title, linkTarget, btn) {
        if (window.event) window.event.stopPropagation();
        let email = localStorage.getItem('user_email');
        if (!email || !email.includes('@')) {
            email = prompt("Enter your email address to receive this application link directly on your laptop:");
        }
        if (!email || !email.includes('@')) return;
        email = email.trim().toLowerCase();
        localStorage.setItem('user_email', email);

        const origHtml = btn.innerHTML;
        btn.innerHTML = 'Sending link...';
        btn.disabled = true;

        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
                form_name: 'mobile_laptop_save',
                lead_type: 'mobile_save',
                role: title,
                link_url: linkTarget,
                email: email
            });
        }

        // Server Pipeline Logging
        fetch('/api/logPipelineEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'generate_lead',
                email: email,
                referral_id: localStorage.getItem('affiliate_ref') || 'organic',
                session_id: localStorage.getItem('tgt_session_id') || 'sess',
                page_url: window.location.pathname,
                metadata: { lead_type: 'mobile_save', role: title, link_url: linkTarget }
            })
        }).catch(() => {});

        // Google Sheet Backup
        fetch('https://script.google.com/macros/s/AKfycbymXTe1ePaiA33w_q1DnCrixUi_ZiFbWxFXL7bBCKP-Z-hvyI_EyKPyajSaB1oqPltS2Q/exec', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                source: 'Mobile Save Link',
                role: title,
                link: linkTarget
            })
        }).catch(() => {});

        btn.style.background = '#065f46';
        btn.style.color = '#ffffff';
        btn.innerHTML = '✓ Link emailed to ' + email + '!';
        setTimeout(() => {
            btn.innerHTML = origHtml;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.color = '';
        }, 4000);
    };
}

// Helpers for Role Requirements & Filters
function getRoleRequirements(role) {
    const text = ((role.title || '') + ' ' + (role.description || '') + ' ' + (Array.isArray(role.tags) ? role.tags.join(' ') : '')).toLowerCase();
    
    // 1. Location / Country
    let location = 'Worldwide (Remote)';
    let locKey = 'ALL';
    if (text.includes('us only') || text.includes('(us)') || text.includes('us-based') || text.includes('united states') || text.includes('north america') || text.includes('u.s.')) {
        location = 'US Based (Remote)';
        locKey = 'US';
    } else if (text.includes('india') || text.includes('bengaluru') || text.includes('delhi')) {
        location = 'India (Remote)';
        locKey = 'INDIA';
    } else if (text.includes('latam') || text.includes('latin america') || text.includes('brazil') || text.includes('mexico')) {
        location = 'LatAm (Remote)';
        locKey = 'LATAM';
    } else if (text.includes('europe') || text.includes('uk-based') || text.includes('united kingdom') || text.includes('eu-based')) {
        location = 'Europe / UK (Remote)';
        locKey = 'EUROPE';
    } else if (text.includes('international') || text.includes('worldwide') || text.includes('global') || text.includes('bilingual')) {
        location = 'International (Remote)';
        locKey = 'INTL';
    }

    // 2. Degree
    let degree = null;
    if (text.includes('ph.d') || text.includes('phd') || text.includes('doctorate') || text.includes('m.d.') || text.includes('md ') || text.includes('postdoc')) {
        degree = 'Doctorate / Ph.D. or MD';
    } else if (text.includes('master') || text.includes('ms ') || text.includes('msc') || text.includes('mba') || text.includes('j.d.') || text.includes('jd ')) {
        degree = "Master's Degree or higher";
    } else if (text.includes('bachelor') || text.includes('bs ') || text.includes('ba ') || text.includes('degree in')) {
        degree = "Bachelor's Degree or Equiv.";
    }

    // 3. Professional License / Certification
    let license = null;
    if (text.includes('cpa') || text.includes('certified public accountant')) {
        license = 'Active CPA License';
    } else if (text.includes('cfa') || text.includes('chartered financial analyst')) {
        license = 'CFA Charterholder';
    } else if (text.includes('medical license') || text.includes('board certified') || text.includes('physician') || text.includes('doctor') || text.includes('md/do') || text.includes('surgeon')) {
        license = 'Active Medical License (MD/DO)';
    } else if (text.includes('registered nurse') || text.includes('rn ') || text.includes('nursing license') || text.includes('bsn')) {
        license = 'Active RN License';
    } else if (text.includes('bar admission') || text.includes('admitted to the bar') || text.includes('law license') || text.includes('attorney') || text.includes('lawyer')) {
        license = 'Bar Admission / Licensed Attorney';
    } else if (text.includes('pe license') || text.includes('professional engineer')) {
        license = 'PE License';
    }

    return { location, locKey, degree, license };
}

function getRoleMatchScore(role) {
    try {
        const raw = sessionStorage.getItem('ai_matches') || localStorage.getItem('ai_matches');
        if (raw) {
            const matches = JSON.parse(raw);
            if (Array.isArray(matches)) {
                const found = matches.find(m => (m.roleName || m.role || '').toLowerCase() === (role.title || '').toLowerCase());
                if (found) {
                    let sc = parseInt(found.computedScore || found.matchScore || found.match, 10);
                    if (!isNaN(sc)) return sc;
                }
            }
        }
        const resumeText = localStorage.getItem('candidateResumeText');
        if (resumeText && resumeText.trim().length >= 50) {
            let kws = (role.atsKeywords && Array.isArray(role.atsKeywords)) ? role.atsKeywords : [];
            if (!kws.length) {
                kws = (role.title || '').split(/[^a-zA-Z0-9]+/).filter(w => w.length > 2 && !/^(and|for|the|with|role|expert|senior|lead)$/i.test(w));
            }
            if (kws.length > 0) {
                let hits = 0;
                kws.forEach(kw => {
                    if (resumeText.toLowerCase().includes(kw.toLowerCase().trim())) hits++;
                });
                return Math.round((hits / kws.length) * 100);
            }
        }
    } catch (e) {}
    return null;
}

function formatSyncDate(dateStr) {
    if (!dateStr) return 'Oct 12, 2026';
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    } catch (e) {}
    return 'Oct 12, 2026';
}

function renderWavesApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('waves.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            let syncDate = data.lastUpdated || '2026-10-12T12:00:00Z';

            try {
                const apiRes = yield fetch('/api/getRoles');
                if (apiRes && apiRes.ok) {
                    const apiData = yield apiRes.json();
                    if (apiData && apiData.meta && apiData.meta.syncedAt) {
                        syncDate = apiData.meta.syncedAt;
                    }
                    if (apiData && apiData.roles && apiData.roles.length > 0) {
                        const existingTitles = new Set(data.roles.map(r => (r.title || '').toLowerCase()));
                        apiData.roles.forEach(apiRole => {
                            if (!apiRole || !apiRole.title) return;
                            const tLow = (apiRole.title || '').toLowerCase();
                            if (tLow.includes('sample') || tLow.includes('test')) return;

                            // R2-1: Never render a Mercor role whose linkTarget is wbPMF unless linkIsSpecific is false
                            const isWbPMF = (apiRole.linkTarget || '').includes('wbPMF');
                            if ((apiRole.platform === 'Mercor' || !apiRole.platform) && isWbPMF && apiRole.linkIsSpecific !== false) {
                                return;
                            }

                            // R2-5: Pay guard for /hr over 500
                            let pStr = apiRole.pay || 'Competitive';
                            if (pStr.toLowerCase().includes('/hr')) {
                                const m = pStr.match(/\d[\d,]*/);
                                if (m && parseInt(m[0].replace(/,/g, ''), 10) > 500) {
                                    pStr = pStr.replace(/\/hr/i, '/yr');
                                }
                            }

                            apiRole.status = apiRole.status || 'ACTIVE';
                            apiRole.badgeClass = apiRole.badgeClass || 'orange';
                            apiRole.description = apiRole.description || 'Mercor is actively hiring for this position.';
                            
                            // R2b-2: Resolve domain for all incoming roles
                            const domMap = [
                                ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed|preclinical/i],
                                ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
                                ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
                                ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian|native speaker/i],
                                ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
                                ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear|energetic/i],
                                ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
                            ];
                            let resolvedDom = (apiRole.domain || '').toUpperCase();
                            if (!resolvedDom || resolvedDom === 'SOFTWARE' || resolvedDom === 'GENERAL') {
                                for (const [d, re] of domMap) {
                                    if (re.test(apiRole.title || '')) { resolvedDom = d; break; }
                                }
                                if (!resolvedDom || resolvedDom === 'SOFTWARE') {
                                    for (const [d, re] of domMap) {
                                        if (re.test(apiRole.description || '')) { resolvedDom = d; break; }
                                    }
                                }
                            }
                            apiRole.domain = resolvedDom || 'GENERAL';
                            apiRole.pay = pStr;
                            apiRole.platform = apiRole.platform || 'Mercor';

                            if (!existingTitles.has(tLow)) {
                                data.roles.unshift(apiRole);
                                existingTitles.add(tLow);
                            } else {
                                const match = data.roles.find(r => (r.title || '').toLowerCase() === tLow);
                                if (match) {
                                    if (apiRole.linkTarget) match.linkTarget = apiRole.linkTarget;
                                    if (apiRole.pay) match.pay = apiRole.pay;
                                    if (apiRole.status) match.status = apiRole.status;
                                    if (apiRole.badgeClass) match.badgeClass = apiRole.badgeClass;
                                    if (apiRole.description) match.description = apiRole.description;
                                    if (apiRole.domain) match.domain = apiRole.domain;
                                }
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn("Could not fetch /api/getRoles, using baseline waves.json:", err);
            }

            // Hide roles not seen in latest sync or marked closed/inactive
            const closedSet = new Set(data.closedRoles || []);
            data.roles = data.roles.filter(r => {
                if (!r || !r.title) return false;
                if (r.status === 'CLOSED' || r.status === 'INACTIVE') return false;
                if (closedSet.has(r.title)) return false;
                return true;
            });

            // R2-5: Pay guard for all roles
            data.roles.forEach(role => {
                if (!role || !role.pay) return;
                let pStr = role.pay;
                if (pStr.toLowerCase().includes('/hr')) {
                    const m = pStr.match(/\d[\d,]*/);
                    if (m && parseInt(m[0].replace(/,/g, ''), 10) > 500) {
                        role.pay = pStr.replace(/\/hr/i, '/yr');
                    }
                }
            });
            window.allRoles = data.roles;

            const syncDateFormatted = formatSyncDate(syncDate);

            // 1. Create the Dynamic Category Carousels
            const carouselWrapper = document.createElement('div');
            carouselWrapper.style.marginBottom = '48px';
            carouselWrapper.style.position = 'relative';

            const categories = [
                { id: 'carousel-software', name: 'Software & Engineering Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', domain: 'SOFTWARE' },
                { id: 'carousel-medical', name: 'Medical & Clinical Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>', domain: 'MEDICAL' },
                { id: 'carousel-finance', name: 'Finance & Quant Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>', domain: 'FINANCE' },
                { id: 'carousel-legal', name: 'Legal & Compliance Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', domain: 'LEGAL' },
                { id: 'carousel-language', name: 'Translation & Voice Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', domain: 'LANGUAGE' },
                { id: 'carousel-science', name: 'Science & Research Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10 2v7.31L4.35 18A2 2 0 0 0 6 21h12a2 2 0 0 0 1.65-3L14 9.31V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line></svg>', domain: 'SCIENCE' },
                { id: 'carousel-creative', name: 'Creative, Writing & Media Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>', domain: 'CREATIVE' },
                { id: 'carousel-sales', name: 'Sales & Growth Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 19l16-16"></path><path d="M4 19l3-3"></path><path d="M20 3l-3 3"></path></svg>', domain: 'SALES' },
                { id: 'carousel-general', name: 'General & Domain Expert Pipelines', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>', domain: 'GENERAL' }
            ];

            let html = `
                <style>
                  @media (max-width: 768px) {
                    .desktop-actions { display: none !important; }
                    .mobile-actions { display: flex !important; }
                  }
                  @media (min-width: 769px) {
                    .desktop-actions { display: flex !important; }
                    .mobile-actions { display: none !important; }
                  }
                </style>
                <div style="background:var(--gray-100); border-left:4px solid var(--primary); padding:16px; margin-bottom:32px; border-radius:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:8px;">
                        <h4 style="margin:0; color:var(--black); font-size:16px;">What to expect after you click Apply:</h4>
                        <div style="display:inline-flex; align-items:center; gap:6px; background:white; border:1px solid var(--gray-300); border-radius:100px; padding:3px 12px; font-size:12px; font-weight:600; color:var(--gray-700);">
                            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
                            Last synced: <span style="font-weight:700; color:var(--black);">${syncDateFormatted}</span>
                        </div>
                    </div>
                    <ul style="margin:0; padding-left:20px; color:var(--gray-700); font-size:14px; line-height:1.6;">
                        <li>First, create your account on the partner platform (Mercor or micro1).</li>
                        <li>Next, complete a roughly 20-minute AI interview (audio/video).</li>
                        <li>Finally, matching can take a few days. Silence doesn't mean you're rejected—just keep an eye on your inbox!</li>
                    </ul>
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
                    <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Medical)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                    <select id="jobDomainFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="ALL">All Categories</option>
                        <option value="SOFTWARE">Software & Engineering</option>
                        <option value="MEDICAL">Medical & Clinical</option>
                        <option value="FINANCE">Finance & Economics</option>
                        <option value="LEGAL">Legal & Compliance</option>
                        <option value="LANGUAGE">Language & Translation</option>
                        <option value="SCIENCE">Science & Research</option>
                        <option value="CREATIVE">Creative & Media</option>
                        <option value="GENERAL">General & Expert</option>
                        <option value="MICRO1">Micro1 Roles</option>
                        <option value="MERCOR">Mercor Roles</option>
                    </select>
                    <select id="jobLocationFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="ALL">Where are you based? (All)</option>
                        <option value="US">United States (US Based)</option>
                        <option value="INTL">International (Any Country)</option>
                        <option value="INDIA">India</option>
                        <option value="LATAM">Latin America (LatAm)</option>
                        <option value="EUROPE">Europe / UK</option>
                    </select>
                    <select id="jobMatchFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="ALL">All Match Scores</option>
                        <option value="70">🌟 70%+ Match (High Fit)</option>
                        <option value="50">📊 50%+ Match (Good Fit)</option>
                        <option value="SCANNED">🎯 Scanned Matches Only</option>
                    </select>
                    <select id="jobSortFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="DEFAULT">Recommended Sort</option>
                        <option value="MATCH_HIGH">🌟 Highest Match %</option>
                        <option value="PAY_HIGH">💰 Highest Paying</option>
                    </select>
                </div>
            `;

            categories.forEach(cat => {
                const categoryRoles = data.roles.filter((r) => r.domain === cat.domain);
                if (categoryRoles.length === 0) return;

                html += `
                    <div class="category-wrapper">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
                        <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">${cat.icon}</div>
                        <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">${cat.name}</h2>
                    </div>
                    
                    <div style="position:relative;">
                        <button class="carousel-btn" style="position:absolute; left:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: -320, behavior: 'smooth'})">‹</button>
                        <button class="carousel-btn" style="position:absolute; right:-20px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--orange); border:1px solid var(--orange); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--orange)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--orange)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: 320, behavior: 'smooth'})">›</button>
                        
                        <div id="${cat.id}" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:24px; padding: 12px 0 24px;">
                            <style>
                                #${cat.id}::-webkit-scrollbar { display: none; }
                            </style>
                `;

                categoryRoles.forEach((role, index) => {
                    let payYearly = 0;
                    let pStr = (role.pay || '').toLowerCase().replace(/,/g, '');
                    let m = pStr.match(/(\d+)/);
                    if (m) {
                        let val = parseInt(m[1], 10);
                        if (pStr.includes('k')) val *= 1000;
                        if (pStr.includes('/hr')) payYearly = val * 2000;
                        else if (pStr.includes('/mo')) payYearly = val * 12;
                        else payYearly = val;
                    }

                    const req = getRoleRequirements(role);
                    const matchScore = getRoleMatchScore(role);

                    let tagsList = Array.isArray(role.tags) ? role.tags : (role.tags ? [role.tags] : ['Remote', role.platform || 'Mercor']);
                    let tagsHtml = tagsList.map(t => `<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">${t}</span>`).join('');
                    const bg = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                    const safeTitle = (role.title || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeDomain = (role.domain || 'GENERAL').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    let cleanPay = (role.pay || 'Competitive');
                    if (cleanPay.includes('/hr')) {
                        let nums = cleanPay.match(/\d[\d,]*/g);
                        if (nums) {
                            let maxVal = Math.max(...nums.map(n => parseInt(n.replace(/,/g, ''), 10)));
                            if (maxVal > 300) {
                                cleanPay = (maxVal >= 15000 && maxVal <= 600000) ? cleanPay.replace('/hr', '/yr') : 'Competitive';
                            }
                        }
                    } else if (cleanPay === ',000–,000/yr') {
                        cleanPay = (role.payMin && role.payMax) ? `$${Math.round(role.payMin/1000)}k–$${Math.round(role.payMax/1000)}k/yr` : 'Competitive';
                    }
                    const safePay = cleanPay.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeLink = (role.linkTarget || 'https://t.mercor.com/wbPMF').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeId = (role.id || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");

                    // Match badge if candidate scanned resume
                    let matchBadgeHtml = '';
                    if (matchScore !== null) {
                        if (matchScore >= 50) {
                            matchBadgeHtml = `<span style="background:var(--primary-light); color:var(--primary-dark); font-size:11px; font-weight:800; padding:4px 8px; border-radius:4px;">🌟 ${matchScore}% Match</span>`;
                        } else {
                            matchBadgeHtml = `<span style="background:#fef3c7; color:#92400e; font-size:11px; font-weight:800; padding:4px 8px; border-radius:4px;">📊 ${matchScore}% Match</span>`;
                        }
                    }

                    const isMicro1Role = (role.platform === 'micro1' || safeLink.includes('micro1'));
                    const rolePlatform = isMicro1Role ? 'micro1' : 'Mercor';
                    const lastAppliedPlatform = typeof localStorage !== 'undefined' ? (localStorage.getItem('tgt_last_applied_platform') || '') : '';
                    const isDifferentPlatform = (lastAppliedPlatform && lastAppliedPlatform !== rolePlatform);

                    const platformBadgeHtml = isMicro1Role
                        ? `<span class="platform-badge" style="padding:4px 8px; background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.03em; display:inline-flex; align-items:center; gap:4px;">🌐 micro1 • Direct Application</span>`
                        : `<span class="platform-badge" style="padding:4px 8px; background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.03em; display:inline-flex; align-items:center; gap:4px;">⚡ Mercor • Direct Application</span>`;

                    const diffAlertHtml = `
                        <div class="diff-platform-alert" data-role-platform="${rolePlatform}" style="background:#f8fafc; border:1px solid #cbd5e1; border-left:3px solid #6366f1; border-radius:6px; padding:6px 10px; margin-bottom:12px; font-size:12px; line-height:1.4; text-align:left; display:${isDifferentPlatform ? 'block' : 'none'};">
                            <div style="color:#334155; font-size:11.5px;">
                                💡 Note: This role is on <strong>${rolePlatform}</strong> (requires a separate free account from <span class="prev-platform-name">${lastAppliedPlatform || 'other platforms'}</span>).
                            </div>
                        </div>
                    `;

                    const preApplyWarningHtml = `
                        <div style="font-size:11px; color:#6b7280; margin-bottom:10px; display:flex; align-items:center; gap:4px;">
                            <span>🔒 Free fast-track application • Direct referral</span>
                        </div>
                    `;

                    // Requirements block
                    const reqHtml = `
                        <div class="role-requirements" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:8px 12px; margin-bottom:14px; font-size:12px; line-height:1.4;">
                            <div style="font-weight:700; color:#374151; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">📋 Requirements</div>
                            <div style="display:flex; flex-direction:column; gap:3px; color:#4b5563;">
                                <div>📍 <strong>Location:</strong> ${req.location}</div>
                                ${req.degree ? `<div>🎓 <strong>Degree:</strong> ${req.degree}</div>` : ''}
                                ${req.license ? `<div>📜 <strong>License:</strong> <span style="color:#b45309; font-weight:700;">${req.license}</span></div>` : ''}
                            </div>
                        </div>
                    `;

                    // High-Converting CTA Buttons:
                    // Apply Now is the undisputed primary button on both desktop and mobile
                    const desktopButtonsHtml = `
                        <div class="desktop-actions" style="display:flex; gap:8px; width:100%;">
                            <button type="button" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}');" style="flex:1; text-align:center; background:var(--primary); border:none; color:var(--white); font-weight:800; font-size:14px; padding:12px; border-radius:var(--radius-sm); transition:all 0.2s; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onmouseover="this.style.background='#059669';" onmouseout="this.style.background='var(--primary)';">Apply on ${rolePlatform} ➔</button>
                            <button type="button" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save to Dashboard" aria-label="Save to Dashboard" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 12px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">💾</button>
                            <button type="button" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark as applied" aria-label="Mark as applied" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 12px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">✅</button>
                            <button type="button" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" title="Check match" aria-label="Check match" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:0 12px; border-radius:var(--radius-sm); font-size:16px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'; this.style.color='var(--primary-dark)';" onmouseout="this.style.background='var(--gray-100)'; this.style.color='var(--gray-700)';">🎯</button>
                        </div>
                    `;

                    const mobileButtonsHtml = `
                        <div class="mobile-actions" style="display:none; flex-direction:column; gap:6px; width:100%;">
                            <button type="button" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}');" style="width:100%; text-align:center; background:var(--primary); color:white; border:none; font-weight:800; font-size:14px; padding:12px; border-radius:var(--radius-sm); cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1);">Apply on ${rolePlatform} ➔</button>
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; padding-top:4px;">
                                <button type="button" onclick="event.stopPropagation(); window.handleMobileSave('${safeTitle}', '${safeLink}', this);" style="background:transparent; border:none; color:var(--gray-500); font-size:11.5px; font-weight:600; text-decoration:underline; cursor:pointer; padding:0;">💻 On phone? Email me link for laptop</button>
                                <div style="display:flex; gap:6px;">
                                    <button type="button" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save to Dashboard" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:4px 8px; border-radius:var(--radius-sm); font-size:13px; cursor:pointer;">💾</button>
                                    <button type="button" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark as applied" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:4px 8px; border-radius:var(--radius-sm); font-size:13px; cursor:pointer;">✅</button>
                                    <button type="button" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" title="Check match" style="background:var(--gray-100); border:1px solid var(--gray-200); color:var(--gray-700); padding:4px 8px; border-radius:var(--radius-sm); font-size:13px; cursor:pointer;">🎯</button>
                                </div>
                            </div>
                        </div>
                    `;

                    html += `
                        <div class="feature-card opp-card" onclick="window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}')" data-domain="${role.domain}" data-platform="${rolePlatform}" data-pay="${payYearly}" data-match="${matchScore !== null ? matchScore : 0}" data-location="${req.locKey}" data-index="${index}" style="cursor:pointer; width:100%; box-sizing:border-box; order:${index}; background:var(--white); border:2px solid var(--orange); padding:24px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:14px; align-items:center; flex-wrap:wrap; gap:8px;">
                                <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                                    <div style="padding:5px 8px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
                                    <div style="padding:5px 8px; background:${bg}; color:white; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.status}</div>
                                    ${platformBadgeHtml}
                                    ${matchBadgeHtml}
                                </div>
                                <div style="color:var(--primary); font-weight:800; font-size:18px;">${role.pay}</div>
                            </div>
                            <h3 style="font-size:18px; margin-bottom:8px; color:var(--black); line-height:1.2;">${role.title}</h3>
                            ${(role.description && role.description.trim() && role.platform !== 'Mercor') ? `<p style="color:var(--gray-500); font-size:14px; margin-bottom:14px; flex-grow:1; line-height:1.6;">${role.description}</p>` : `<p style="color:var(--gray-500); font-size:14px; margin-bottom:14px; flex-grow:1; line-height:1.6;">Remote, ${role.pay.includes('/hr') ? 'hourly' : (role.pay.includes('/mo') ? 'monthly' : (role.pay.includes('/yr') ? 'annual' : 'flexible'))} role. Direct application on ${rolePlatform}.</p>`}
                            
                            ${reqHtml}

                            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">${tagsHtml}</div>
                            
                            ${diffAlertHtml}
                            ${preApplyWarningHtml}

                            ${desktopButtonsHtml}
                            ${mobileButtonsHtml}
                            
                            <div style="text-align:center; font-size:11px; color:var(--gray-500); margin-top:8px; font-weight:600;">Takes 3 mins • Have your PDF resume ready</div>
                        </div>
                    `;
                });

                html += `</div></div></div>`;
            });

            carouselWrapper.innerHTML = html;
            const targetContainer = document.getElementById('dynamic-jobs-container');
            if (targetContainer) {
                targetContainer.innerHTML = '';
                targetContainer.appendChild(carouselWrapper);
            } else {
                const carouselsSection = document.querySelector('.section .container');
                if (carouselsSection && carouselsSection.firstChild) {
                    carouselsSection.insertBefore(carouselWrapper, carouselsSection.firstChild);
                }
            }

            const searchInput = document.getElementById('jobSearchInput');
            const domainFilter = document.getElementById('jobDomainFilter');
            const locationFilter = document.getElementById('jobLocationFilter');
            const matchFilter = document.getElementById('jobMatchFilter');
            const sortFilter = document.getElementById('jobSortFilter');

            function filterJobs() {
                const term = searchInput ? searchInput.value.toLowerCase() : '';
                const domain = domainFilter ? domainFilter.value : 'ALL';
                const loc = locationFilter ? locationFilter.value : 'ALL';
                const matchVal = matchFilter ? matchFilter.value : 'ALL';
                const sort = sortFilter ? sortFilter.value : 'DEFAULT';

                const cards = carouselWrapper.querySelectorAll('.opp-card');
                let cardsArray = Array.from(cards);

                cardsArray.forEach((card) => {
                    const text = (card.textContent || '').toLowerCase();
                    const cardDomain = card.getAttribute('data-domain');
                    const cardPlatform = (card.getAttribute('data-platform') || '').toUpperCase();
                    const cardLoc = card.getAttribute('data-location') || 'ALL';
                    const cardMatch = parseInt(card.getAttribute('data-match') || '0', 10);

                    let matchesSearch = text.includes(term);
                    let matchesDomain = true;
                    if (domain !== 'ALL') {
                        if (domain === 'MICRO1' || domain === 'MERCOR') {
                            matchesDomain = cardPlatform === domain;
                        } else {
                            matchesDomain = cardDomain === domain;
                        }
                    }

                    // Where are you based? Filter logic
                    let matchesLoc = true;
                    if (loc === 'US') {
                        matchesLoc = (cardLoc === 'US' || cardLoc === 'ALL');
                    } else if (loc === 'INTL') {
                        matchesLoc = (cardLoc !== 'US');
                    } else if (loc === 'INDIA') {
                        matchesLoc = (cardLoc === 'INDIA' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    } else if (loc === 'LATAM') {
                        matchesLoc = (cardLoc === 'LATAM' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    } else if (loc === 'EUROPE') {
                        matchesLoc = (cardLoc === 'EUROPE' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    }

                    // Match % Filter logic
                    let matchesMatch = true;
                    if (matchVal === '70') {
                        matchesMatch = (cardMatch >= 70);
                    } else if (matchVal === '50') {
                        matchesMatch = (cardMatch >= 50);
                    } else if (matchVal === 'SCANNED') {
                        matchesMatch = (cardMatch > 0);
                    }

                    if (matchesSearch && matchesDomain && matchesLoc && matchesMatch) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Sorting
                const containerWrappers = carouselWrapper.querySelectorAll('[id^="carousel-"]');
                containerWrappers.forEach((container) => {
                    const containerCards = Array.from(container.querySelectorAll('.opp-card'));
                    if (sort === 'MATCH_HIGH') {
                        containerCards.sort((a, b) => parseInt(b.getAttribute('data-match') || '0', 10) - parseInt(a.getAttribute('data-match') || '0', 10));
                    } else if (sort === 'PAY_HIGH') {
                        containerCards.sort((a, b) => parseInt(b.getAttribute('data-pay') || '0', 10) - parseInt(a.getAttribute('data-pay') || '0', 10));
                    } else {
                        containerCards.sort((a, b) => parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10));
                    }
                    containerCards.forEach((c, i) => {
                        c.style.order = i.toString();
                    });
                });

                // Hide empty categories
                const wrappers = carouselWrapper.querySelectorAll('.category-wrapper');
                let totalVisibleCards = 0;
                wrappers.forEach((wrapper) => {
                    const visibleCards = Array.from(wrapper.querySelectorAll('.opp-card')).filter((c) => c.style.display !== 'none');
                    totalVisibleCards += visibleCards.length;
                    if (visibleCards.length === 0) {
                        wrapper.style.display = 'none';
                    } else {
                        wrapper.style.display = 'block';
                    }
                });

                let noResultsMsg = document.getElementById('no-results-msg');
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'no-results-msg';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.padding = '64px 20px';
                    noResultsMsg.style.color = 'var(--gray-500)';
                    noResultsMsg.style.fontSize = '18px';
                    noResultsMsg.innerHTML = '<span style="font-size:32px; display:block; margin-bottom:12px;">🔍</span> No open roles match your specific search criteria.<br><span style="font-size:15px; margin-top:8px; display:block;">Try broadening your filters or check back tomorrow for new waves.</span>';
                    carouselWrapper.appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = totalVisibleCards === 0 ? 'block' : 'none';
            }

            if (searchInput) searchInput.addEventListener('input', filterJobs);
            if (domainFilter) domainFilter.addEventListener('change', filterJobs);
            if (locationFilter) locationFilter.addEventListener('change', filterJobs);
            if (matchFilter) matchFilter.addEventListener('change', filterJobs);
            if (sortFilter) sortFilter.addEventListener('change', filterJobs);

        } catch (error) {
            console.error("Error rendering waves:", error);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWavesApp);
} else {
    renderWavesApp();
}
