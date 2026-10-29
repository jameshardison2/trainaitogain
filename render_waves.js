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

if (!window.ensureReferralAttribution) {
    window.ensureReferralAttribution = function(rawUrl, platform) {
        if (!rawUrl || typeof rawUrl !== 'string') {
            var isM1 = platform === 'micro1' || (platform || '').toLowerCase().indexOf('micro') !== -1;
            return isM1
                ? 'https://jobs.micro1.ai?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral'
                : 'https://t.mercor.com/wbPMF';
        }
        var url = rawUrl.trim();
        var isMicro1 = platform === 'micro1' || url.toLowerCase().indexOf('micro1') !== -1;
        if (isMicro1) {
            if (url.indexOf('referralCode=') === -1) {
                var sep = url.indexOf('?') !== -1 ? '&' : '?';
                url = url + sep + 'referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe&utm_source=referral&utm_medium=share&utm_campaign=job_referral';
            }
            return url;
        }
        // Mercor
        if (url.indexOf('https://t.mercor.com/') === 0) {
            return url;
        }
        if (url.indexOf('work.mercor.com') !== -1 || url.indexOf('mercor.com') !== -1) {
            if (url.indexOf('referralCode=') === -1 && url.indexOf('ref=') === -1) {
                var sepM = url.indexOf('?') !== -1 ? '&' : '?';
                url = url + sepM + 'referralCode=867a4c34-8e4d-4d1b-8ac7-13370a4a3942&ref=wbPMF&utm_campaign=job&utm_medium=direct&utm_source=referral';
            }
        }
        return url;
    };
}

if (!window.handleApplyClick) {
    window.handleApplyClick = function(title, linkTarget, btn, roleId, matchScore, domain) {
        if (window.event) window.event.stopPropagation();
        const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
        let targetUrl = linkTarget || 'https://t.mercor.com/wbPMF';
        
        const isMicro1 = targetUrl.toLowerCase().includes('micro1');
        const platformName = isMicro1 ? 'micro1' : 'Mercor';
        
        targetUrl = window.ensureReferralAttribution(targetUrl, platformName);
        if (targetUrl.includes('mercor') && !targetUrl.startsWith('https://t.mercor.com/')) {
            const mRef = refCode || 'wbPMF';
            if (!targetUrl.includes('ref=') && !targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(mRef);
        } else if (targetUrl.includes('micro1')) {
            const m1Ref = refCode || '05216c9f-87cc-49af-b448-f9f8a18d2efe';
            if (!targetUrl.includes('referralCode=')) targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'referralCode=' + encodeURIComponent(m1Ref);
        }

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

        const isGenericMercor = (targetUrl === 'https://t.mercor.com/wbPMF' || targetUrl === 'https://t.mercor.com/wbPMF/') && !targetUrl.includes('listingId');
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
                <!-- Pre-Apply Checklist (Avoid Costly Rejections) -->
                <div style="background:#ffffff; border:1.5px solid #10b981; border-radius:8px; padding:12px 14px; margin-bottom:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
                    <div style="font-size:12px; font-weight:800; color:#065f46; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                        <span>📋 Pre-Apply Checklist (Avoid Costly Rejections)</span>
                    </div>
                    <ul style="margin:0; padding-left:18px; font-size:12px; color:#374151; line-height:1.55;">
                        <li style="margin-bottom:4px;"><strong>Profile Hours Match:</strong> Set your profile availability to <strong>20–40 hrs/wk</strong>. Selecting 10 hours for a 20-hour role can permanently disqualify you without an edit option.</li>
                        <li style="margin-bottom:4px;"><strong>Apply Early &amp; Complete:</strong> Finish 100% of the profile and upload your resume immediately in this tab.</li>
                        <li style="margin-bottom:4px;"><strong>Start Tasks Right Away:</strong> Once approved, claim your first project task promptly to keep your placement active.</li>
                        <li><strong>Country Eligibility:</strong> Confirm your tax residency matches this role before submitting.</li>
                    </ul>
                </div>
                <ol style="margin:0 0 16px 0; padding-left:20px; font-size:13px; color:#166534; line-height:1.6;">
                    <li style="margin-bottom:6px;"><strong>Create your free account</strong> in this same browser so your referral carries over.</li>
                    <li style="margin-bottom:6px;"><strong>The AI interview takes about 20 minutes</strong>, on a laptop or desktop with a webcam and mic. Practice first if you like: 
                        <a href="/ai-interview" target="_blank" onclick="window.trackHandoffMock ? window.trackHandoffMock('${safeTitleStr}', '${safePlatformStr}') : null" style="color:#059669; font-weight:700; text-decoration:underline;">[mock interview]</a> &bull; 
                        <a href="/readiness-checklist" target="_blank" onclick="window.trackHandoffChecklist ? window.trackHandoffChecklist('${safeTitleStr}', '${safePlatformStr}') : null" style="color:#059669; font-weight:700; text-decoration:underline;">[checklist]</a>
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

if (!window.trackHandoffMock) {
    window.trackHandoffMock = function(title, platform) {
        if (typeof gtag === 'function') {
            gtag('event', 'handoff_mock_click', {
                role_title: title,
                platform: platform,
                target: 'mock_interview'
            });
        }
    };
}

if (!window.trackHandoffChecklist) {
    window.trackHandoffChecklist = function(title, platform) {
        if (typeof gtag === 'function') {
            gtag('event', 'handoff_checklist_click', {
                role_title: title,
                platform: platform,
                target: 'readiness_checklist'
            });
        }
    };
}

if (!window.markCardStarted) {
    window.markCardStarted = function(title, targetUrl, platform, btn) {
        let saved = JSON.parse(localStorage.getItem('savedRoles') || '[]');
        const roleId = (title || 'role').toLowerCase().replace(/[^a-z0-9]/g, '-') + '_role';
        let existing = saved.find(r => r && (r.title === title || r.id === roleId));
        if (existing) {
            existing.status = 'Started';
        } else {
            saved.push({
                id: roleId,
                title: title,
                domain: platform === 'micro1' ? 'SOFTWARE' : 'GENERAL',
                pay: 'Competitive',
                linkTarget: targetUrl,
                platform: platform,
                status: 'Started',
                date: new Date().toISOString()
            });
        }
        localStorage.setItem('savedRoles', JSON.stringify(saved));

        if (typeof gtag === 'function') {
            gtag('event', 'mark_started_click', {
                role_title: title,
                platform: platform
            });
            gtag('event', 'pipeline_status_changed', {
                status: 'Started',
                role: title,
                platform: platform
            });
        }

        let email = localStorage.getItem('user_email');
        function sendReminder(em) {
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    lead_type: 'reminder',
                    email: em,
                    role: title
                });
            }
            fetch('/api/setRoleReminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: em,
                    roleId: roleId,
                    roleTitle: title,
                    rolePay: 'Competitive',
                    linkTarget: targetUrl,
                    platform: platform,
                    status: 'Started'
                })
            }).catch(() => {});
        }

        if (btn) {
            btn.innerText = 'Marked Started ✓';
            btn.style.background = '#047857';
            btn.disabled = true;
        }

        if (!email || !email.includes('@')) {
            if (window.showModalPrompt) {
                window.showModalPrompt({
                    title: 'Set 2-Day Application Reminder',
                    description: 'Enter your email so we can send interview tips and a reminder if you get stuck:',
                    inputPlaceholder: 'you@example.com',
                    submitText: 'Save Reminder',
                    onConfirm: (em) => {
                        localStorage.setItem('user_email', em);
                        sendReminder(em);
                    }
                });
            }
        } else {
            sendReminder(email);
        }
    };
}

// Global in-page non-blocking prompt modal
window.showModalPrompt = function(options) {
    const existing = document.getElementById('tgt-modal-prompt');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'tgt-modal-prompt';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'tgt-modal-title');
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:99999; padding:16px; box-sizing:border-box; animation:fadeIn 0.2s ease;';

    const card = document.createElement('div');
    card.style.cssText = 'background:white; border-radius:12px; width:100%; max-width:440px; padding:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.2); box-sizing:border-box;';
    
    card.innerHTML = `
        <h3 id="tgt-modal-title" style="margin:0 0 8px; font-size:18px; font-weight:800; color:#111827;">${options.title || 'Enter your details'}</h3>
        <p style="margin:0 0 16px; font-size:13.5px; color:#4b5563; line-height:1.5;">${options.description || ''}</p>
        <form id="tgt-modal-form" style="display:flex; flex-direction:column; gap:12px;">
            <input type="${options.inputType || 'email'}" id="tgt-modal-input" required placeholder="${options.inputPlaceholder || 'you@example.com'}" style="width:100%; padding:12px 14px; border:1.5px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box; outline:none;" />
            <div id="tgt-modal-error" style="display:none; color:#dc2626; font-size:12px; font-weight:600;"></div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
                <button type="button" id="tgt-modal-cancel" style="padding:10px 16px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:6px; font-weight:600; font-size:13px; color:#374151; cursor:pointer;">Cancel</button>
                <button type="submit" id="tgt-modal-submit" style="padding:10px 20px; background:#10b981; border:none; border-radius:6px; font-weight:700; font-size:13px; color:white; cursor:pointer;">${options.submitText || 'Confirm'}</button>
            </div>
        </form>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const input = document.getElementById('tgt-modal-input');
    const form = document.getElementById('tgt-modal-form');
    const cancelBtn = document.getElementById('tgt-modal-cancel');
    const errorDiv = document.getElementById('tgt-modal-error');

    setTimeout(() => { if (input) input.focus(); }, 50);

    const closeModal = () => {
        window.removeEventListener('keydown', handleKey);
        overlay.remove();
        if (options.onCancel) options.onCancel();
    };

    const handleKey = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);

    overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
    };

    cancelBtn.onclick = closeModal;

    form.onsubmit = (e) => {
        e.preventDefault();
        const val = input.value.trim().toLowerCase();
        if (options.inputType === 'email' || !options.inputType) {
            if (!val.includes('@') || !val.includes('.') || val.length < 5) {
                errorDiv.innerText = 'Please enter a valid email address.';
                errorDiv.style.display = 'block';
                return;
            }
        }
        window.removeEventListener('keydown', handleKey);
        overlay.remove();
        if (options.onConfirm) options.onConfirm(val);
    };
};

// Fallback Mobile Save Link
if (!window.handleMobileSave) {
    window.handleMobileSave = function(title, linkTarget, btn) {
        if (window.event) window.event.stopPropagation();
        function doSend(em) {
            const origHtml = btn.innerHTML;
            btn.innerHTML = 'Sending link...';
            btn.disabled = true;

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    form_name: 'mobile_laptop_save',
                    lead_type: 'mobile_save',
                    role: title,
                    link_url: linkTarget,
                    email: em
                });
            }

            fetch('/api/logPipelineEvent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'generate_lead',
                    email: em,
                    referral_id: localStorage.getItem('affiliate_ref') || 'organic',
                    session_id: localStorage.getItem('tgt_session_id') || 'sess',
                    page_url: window.location.pathname,
                    metadata: { form_name: 'mobile_laptop_save', role: title, link_url: linkTarget }
                })
            }).catch(() => {});

            fetch('/api/directIngestJobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: em,
                    source: 'Mobile Save Link',
                    role: title,
                    link: linkTarget
                })
            }).catch(() => {});

            btn.style.background = '#065f46';
            btn.style.color = '#ffffff';
            btn.innerHTML = '✓ Link emailed to ' + em + '!';
            setTimeout(() => {
                btn.innerHTML = origHtml;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.color = '';
            }, 4000);
        }

        let email = localStorage.getItem('user_email');
        if (!email || !email.includes('@')) {
            if (window.showModalPrompt) {
                window.showModalPrompt({
                    title: 'Email Link to Your Laptop',
                    description: 'Enter your email address to receive this application link directly on your laptop:',
                    inputPlaceholder: 'you@example.com',
                    submitText: 'Send Link ➔',
                    onConfirm: (em) => {
                        localStorage.setItem('user_email', em);
                        doSend(em);
                    }
                });
            }
        } else {
            doSend(email);
        }
    };
}

// Helpers for Role Requirements & Filters
function getRoleRequirements(role) {
    const text = ((role.title || '') + ' ' + (role.description || '') + ' ' + (Array.isArray(role.tags) ? role.tags.join(' ') : '')).toLowerCase();
    
    // 1. Location / Country
    let location = 'Worldwide (Remote)';
    let locKey = 'ALL';
    if (/(?:\bu\.s\.(?:[\s,;:\/|()\[\]]|$)|(?:\b|^)(?:us|usa|united states|us-based|us-licensed|american|north america|us only|us gov)\b)/i.test(text)) {
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

    // 2. Degree - fix medical vs non-medical doctorate tags
    let degree = null;
    const isMedicalRole = (role.domain === 'MEDICAL' || text.includes('clinical') || text.includes('medical') || text.includes('physician') || text.includes('doctor') || text.includes('nurse'));
    const hasDoctorate = text.includes('ph.d') || text.includes('phd') || text.includes('doctorate') || text.includes('postdoc');
    const hasMD = text.includes('m.d.') || (/\bmd\b/i.test(text) && isMedicalRole);

    if (hasDoctorate && hasMD) {
        degree = 'Doctorate (Ph.D. or MD)';
    } else if (hasMD) {
        degree = 'Medical Doctorate (M.D.)';
    } else if (hasDoctorate) {
        degree = 'Doctorate / Ph.D.';
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
    } else if (text.includes('registered nurse') || text.includes('rn ') || text.includes('(rn)') || text.includes('nursing license') || text.includes('bsn')) {
        license = 'Active RN License';
    } else if (text.includes('bar admission') || text.includes('admitted to the bar') || text.includes('law license') || text.includes('attorney') || text.includes('lawyer')) {
        license = 'Bar Admission / Licensed Attorney';
    } else if (text.includes('pe license') || text.includes('professional engineer')) {
        license = 'PE License';
    }

    // 4. Hours / Schedule
    let hours = null;
    const hoursMatch = text.match(/\b(\d{1,2}\s*(?:–|-|to)\s*\d{1,2}\s*(?:hrs?|hours?)(?:\s*\/\s*wk)?|\d{1,2}\s*(?:hrs?|hours?)(?:\s*\/\s*wk)?|full[-\s]time|part[-\s]time)\b/i);
    if (hoursMatch) {
        hours = hoursMatch[0].trim();
    } else if (text.includes('part-time') || text.includes('part time')) {
        hours = 'Part-Time / Flexible';
    } else if (text.includes('full-time') || text.includes('full time')) {
        hours = 'Full-Time';
    }

    return { location, locKey, degree, license, hours };
}

// Global Robust Pay Normalization Function
function parseRolePay(rawPay, title) {
    if (!rawPay || rawPay === 'Competitive') return { cleanPay: 'Competitive', yearlyValue: 0 };
    let pStr = String(rawPay).toLowerCase().replace(/,/g, '');
    const nums = (pStr.match(/\d+/g) || []).map(n => parseInt(n, 10));
    if (!nums.length) return { cleanPay: 'Competitive', yearlyValue: 0 };
    
    const maxVal = Math.max(...nums);
    const minVal = Math.min(...nums);

    if (pStr.includes('/hr')) {
        // Less than $12/hr is scrape/currency error -> hide and mark Competitive
        if (minVal < 12) {
            return { cleanPay: 'Competitive', yearlyValue: 0 };
        }
        // Extreme rates for Junior/Intern roles -> hide unverified pay
        if ((title || '').toLowerCase().includes('junior') && maxVal >= 150) {
            return { cleanPay: 'Competitive', yearlyValue: 0 };
        }
        if (maxVal > 500) {
            if (maxVal >= 15000 && maxVal <= 600000) {
                return { cleanPay: `$${Math.round(minVal/1000)}k–$${Math.round(maxVal/1000)}k/yr`, yearlyValue: maxVal };
            }
            return { cleanPay: 'Competitive', yearlyValue: 0 };
        }
        // Normalize single-value ranges e.g. $230-$230/hr -> $230/hr
        let clean = rawPay;
        if (minVal === maxVal && rawPay.includes('-')) {
            clean = `$${maxVal}/hr`;
        }
        return { cleanPay: clean, yearlyValue: maxVal * 2000 };
    }

    if (pStr.includes('/yr')) {
        let multiplier = pStr.includes('k') ? 1000 : 1;
        let clean = rawPay;
        if (minVal === maxVal && rawPay.includes('-')) {
            clean = pStr.includes('k') ? `$${maxVal}k/yr` : `$${maxVal}/yr`;
        }
        return { cleanPay: clean, yearlyValue: maxVal * multiplier };
    }

    if (pStr.includes('/mo')) {
        return { cleanPay: rawPay, yearlyValue: maxVal * 12 };
    }

    if (pStr.includes('/task') || pStr.includes('bounty')) {
        // AI evaluation tasks average ~1.5-2 hrs, ~1000 tasks/yr equivalent
        return { cleanPay: rawPay, yearlyValue: maxVal * 1000 };
    }

    return { cleanPay: rawPay, yearlyValue: maxVal };
}

// Unified Keyword Matching function matching ATS Resume Guide
const optionalModifiers = new Set([
    'webdriver', 'queries', 'query', 'frameworks', 'framework', 'systems', 'system',
    'tools', 'tool', 'practices', 'practice', 'skills', 'skill', 'experience',
    'knowledge', 'methods', 'method', 'concepts', 'concept', 'fundamentals',
    'basics', 'principles', 'technologies', 'technology', 'scripts', 'scripting',
    'pipelines', 'pipeline', 'libraries', 'library', 'architecture', 'engineering',
    'development', 'management', 'standards', 'processes', 'process', 'applications',
    'application', 'solutions', 'solution', 'platforms', 'platform', 'patterns', 'pattern',
    'programming', 'services', 'service', 'operations', 'operation'
]);

function keywordMatchesText(rawKw, resumeText) {
    if (!rawKw || !resumeText) return false;
    const kwLower = rawKw.toLowerCase().trim();
    const resLower = resumeText.toLowerCase();

    // 1. Direct exact substring match (only for length >= 4, or whole word for short keywords)
    if (kwLower.length >= 4 && resLower.includes(kwLower)) return true;
    if (kwLower.length < 4) {
        const re = new RegExp('\\b' + kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (re.test(resLower)) return true;
    }

    // 2. Parentheses acronym: e.g. "Electronic Health Records (EHR) Systems" -> "ehr"
    const parenMatch = rawKw.match(/\(([^)]+)\)/);
    if (parenMatch) {
        const insideParen = parenMatch[1].toLowerCase().trim();
        const re = new RegExp('\\b' + insideParen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (re.test(resLower)) return true;
        const beforeParen = rawKw.split('(')[0].toLowerCase().trim();
        if (beforeParen.length > 2 && resLower.includes(beforeParen)) return true;
    }

    // 3. Standalone acronym (e.g. "AWS", "SQL", "EHR", "RN", "MD", "CI/CD")
    // Applies ONLY when the raw keyword is a single acronym token, NOT a multi-word phrase like "AI Agents"
    const trimmed = rawKw.trim();
    if (/^[A-Z0-9/#+.-]{2,6}$/i.test(trimmed) && !trimmed.includes(' ')) {
        const acrClean = trimmed.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const acrRe = new RegExp('\\b' + acrClean + '\\b', 'i');
        if (acrRe.test(resLower)) return true;
    }

    // 4. Normalized punctuation match (for phrases of 4+ chars)
    const cleanKw = kwLower.replace(/[^\w\s+#.-]/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanText = resLower.replace(/[^\w\s+#.-]/g, ' ').replace(/\s+/g, ' ');
    if (cleanKw.length >= 4 && cleanText.includes(cleanKw)) return true;

    // 5. Main term matching with optional modifiers / qualifiers
    // Words like "webdriver", "queries", "frameworks", "tools", "systems" are secondary qualifiers
    const words = cleanKw.split(/\s+/).filter(w => w.length >= 2);
    const mainWords = words.filter(w => !optionalModifiers.has(w));

    // If removing modifiers leaves core technical terms (e.g. "selenium" from "selenium webdriver",
    // "sql" from "sql queries", "test automation" from "test automation frameworks")
    if (mainWords.length > 0 && mainWords.length < words.length) {
        const mainPhrase = mainWords.join(' ');
        if (mainPhrase.length >= 4 && resLower.includes(mainPhrase)) return true;
        if (mainWords.every(w => {
            const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp('\\b' + escaped + '\\b', 'i').test(resLower);
        })) {
            return true;
        }
    }

    // 6. Multi-word phrase matching where all words are required (e.g. "AI Agents" requires both "ai" and "agents")
    if (words.length >= 2) {
        if (words.every(w => {
            const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp('\\b' + escaped + '\\b', 'i').test(resLower);
        })) {
            return true;
        }
    }

    return false;
}

// Shared Unified Calibrated Match Scoring Function
window.calculateRoleMatchScore = function(role, resumeText) {
    if (!resumeText || resumeText.trim().length < 50) return null;
    const resumeLower = resumeText.toLowerCase();
    const title = (role.title || '').trim();
    let kws = (role.atsKeywords && Array.isArray(role.atsKeywords)) ? [...role.atsKeywords] : [];
    
    // Supplement thin keywords with title tokens ONLY if role has fewer than 3 keywords
    if (kws.length < 3) {
        const titleTokens = title.split(/[^a-zA-Z0-9+#]+/).filter(w => w.length >= 2 && !/^(and|for|the|with|role|expert|senior|lead|specialist|practitioner|specialists|users|engineer|developer|tester|consultant)$/i.test(w));
        titleTokens.forEach(tok => {
            const tokLow = tok.toLowerCase();
            if (!kws.some(k => k.toLowerCase().includes(tokLow))) {
                kws.push(tok);
            }
        });
    }

    // Language requirement check: if title explicitly specifies a foreign language, candidate must have it
    const languages = ['dutch', 'german', 'french', 'spanish', 'italian', 'portuguese', 'japanese', 'chinese', 'mandarin', 'korean', 'arabic', 'hindi', 'bengali', 'tamil', 'telugu', 'malayalam', 'marathi', 'gujarati', 'danish', 'finnish', 'norwegian', 'swedish', 'polish', 'russian', 'turkish', 'vietnamese', 'indonesian', 'thai'];
    let requiredLang = null;
    for (const lang of languages) {
        if (new RegExp('\\b' + lang + '\\b', 'i').test(title)) {
            requiredLang = lang;
            break;
        }
    }
    if (requiredLang && !resumeLower.includes(requiredLang)) {
        // Failed mandatory foreign language requirement -> 0% match, do not show in Top Qualified Roles
        return { score: 0, hits: 0, total: Math.max(kws.length, 4), tier: "None" };
    }

    let hits = 0;
    kws.forEach(kw => {
        if (keywordMatchesText(kw, resumeLower)) {
            hits++;
        }
    });

    const total = kws.length;
    if (total === 0 || hits === 0) return { score: 0, hits: 0, total: total || 0, tier: "None" };

    // Accurate, honest math: 2 of 3 = 67%, 1 of 2 = 50%, 3 of 4 = 75%, 4 of 4 = 100%
    const rawPct = Math.round((hits / total) * 100);
    const score = Math.min(100, Math.max(10, rawPct));

    // Clear, trustworthy qualification tiers (Require at least 3 keywords for Strong Match)
    let tier = "Stretch Role";
    if (score >= 70 && hits >= 3 && total >= 3) {
        tier = "Strong Match";
    } else if (score >= 50 || (score >= 70 && hits >= 1)) {
        tier = "Good Match";
    }

    return { score, hits, total, tier };
};

function getRoleMatchInfo(role) {
    try {
        const resumeText = (typeof window.resolveStoredResume === 'function') 
            ? window.resolveStoredResume() 
            : (localStorage.getItem('candidateResumeText') || sessionStorage.getItem('candidateResumeText') || '');
        const computed = (resumeText && window.calculateRoleMatchScore) ? window.calculateRoleMatchScore(role, resumeText) : null;
        const raw = sessionStorage.getItem('ai_matches') || localStorage.getItem('ai_matches');
        if (raw) {
            const matches = JSON.parse(raw);
            if (Array.isArray(matches)) {
                const found = matches.find(m => (m.roleName || m.role || '').toLowerCase().trim() === (role.title || '').toLowerCase().trim());
                if (found) {
                    let sc = parseInt(found.computedScore || found.matchScore || found.match, 10);
                    if (!isNaN(sc)) {
                        const hits = (found.hits !== undefined) ? found.hits : (computed ? computed.hits : undefined);
                        const total = (found.total !== undefined) ? found.total : (computed ? computed.total : undefined);
                        const isStrong = (sc >= 70 && hits !== undefined && total !== undefined && hits >= 3 && total >= 3);
                        const tier = isStrong ? 'Strong Match' : (sc >= 50 ? 'Good Match' : 'Stretch Role');
                        return {
                            score: sc,
                            hits: hits,
                            total: total,
                            tier: tier
                        };
                    }
                }
            }
        }
        if (computed) {
            return computed;
        }
    } catch (e) {}
    return null;
}

function getRoleMatchScore(role) {
    const info = getRoleMatchInfo(role);
    return info ? info.score : null;
}

function formatSyncDate(dateStr) {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    } catch (e) {}
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderWavesApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('waves.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            let syncDate = (data && data.meta && data.meta.syncedAt) || data.lastUpdated || new Date().toISOString();

            try {
                const apiRes = yield fetch('/api/getRoles');
                if (apiRes && apiRes.ok) {
                    const apiData = yield apiRes.json();
                    if (apiData && apiData.meta && apiData.meta.syncedAt) {
                        const prevTime = new Date(syncDate).getTime();
                        const mercorTime = new Date(apiData.meta.syncedAt).getTime();
                        if (!isNaN(mercorTime) && (isNaN(prevTime) || mercorTime > prevTime)) {
                            syncDate = apiData.meta.syncedAt;
                        }
                    }
                    if (apiData && apiData.roles && apiData.roles.length > 0) {
                        // 1. Identify platforms present in incoming API sync
                        const incomingPlatforms = new Set(apiData.roles.map(r => (r.platform || 'Mercor').toLowerCase()));

                        // 2. Retain baseline roles ONLY for platforms NOT present in incoming sync (e.g. micro1)
                        const retainedBaselineRoles = (data.roles || []).filter(r => {
                            const p = (r.platform || 'Mercor').toLowerCase();
                            const l = (r.linkTarget || '').toLowerCase();
                            const isMicro1 = p.includes('micro') || l.includes('micro1');
                            if (isMicro1) return !incomingPlatforms.has('micro1');
                            return !incomingPlatforms.has('mercor');
                        });

                        // 3. Process, sanitize, and deduplicate incoming API roles
                        const domMap = [
                            ['MEDICAL', /nurse|physician|medical|clinical|health|doctor|md\b|pharm|oncolog|neurolog|urolog|radiolog|hospital|dental|patient|biomed|preclinical/i],
                            ['LEGAL', /legal|lawyer|attorney|law\b|paralegal|litigation|j\.d|counsel/i],
                            ['FINANCE', /financ|accounting|banking|investment|equity|quant|trading|actuar|tax|economic|cpa|cfa|private equity|venture/i],
                            ['LANGUAGE', /voice actor|language|translat|linguist|spanish|french|german|japanese|korean|chinese|arabic|hindi|portuguese|italian|native speaker/i],
                            ['SOFTWARE', /software|engineer|developer|swe\b|coding|code|data scien|machine learning|\bml\b|\bai\b|devops|security|cyber|backend|frontend|full.?stack|mobile|qa\b/i],
                            ['SCIENCE', /chemist|physic|biolog|math|scien|research|materials|nuclear|energetic/i],
                            ['CREATIVE', /design|writer|writing|editor|video|creative|art|music|film|game/i]
                        ];

                        const seenTitles = new Set();
                        const freshRoles = [];

                        apiData.roles.forEach(apiRole => {
                            if (!apiRole || !apiRole.title) return;
                            const tClean = apiRole.title.trim();
                            const tLow = tClean.toLowerCase();
                            if (tLow.includes('sample') || tLow.includes('test')) return;
                            if (seenTitles.has(tLow)) return;
                            seenTitles.add(tLow);

                            apiRole.title = tClean;
                            apiRole.status = apiRole.status || 'ACTIVE';
                            apiRole.badgeClass = apiRole.badgeClass || 'orange';
                            apiRole.description = apiRole.description || 'Actively hiring for this position.';
                            apiRole.platform = apiRole.platform || 'Mercor';
                            apiRole.lastUpdated = apiRole.lastUpdated || apiData.meta.syncedAt || syncDate;

                            // Ensure valid linkTarget with referral attribution
                            if (!apiRole.linkTarget) {
                                apiRole.linkTarget = (apiRole.platform === 'micro1' || (apiRole.platform || '').toLowerCase().includes('micro'))
                                    ? 'https://jobs.micro1.ai?referralCode=05216c9f-87cc-49af-b448-f9f8a18d2efe'
                                    : 'https://t.mercor.com/wbPMF';
                            } else if (apiRole.linkTarget.includes('listingId=')) {
                                const lidMatch = apiRole.linkTarget.match(/listingId=(list_[A-Za-z0-9_-]+)/);
                                if (lidMatch) {
                                    const lid = lidMatch[1];
                                    apiRole.linkTarget = `https://work.mercor.com/jobs/${lid}?referralCode=867a4c34-8e4d-4d1b-8ac7-13370a4a3942&ref=wbPMF&utm_campaign=job&utm_content=${lid}&utm_medium=direct&utm_source=referral`;
                                }
                            }

                            // R2-5: Pay guard for /hr over 500
                            let pStr = apiRole.pay || 'Competitive';
                            if (pStr.toLowerCase().includes('/hr')) {
                                const m = pStr.match(/\d[\d,]*/);
                                if (m && parseInt(m[0].replace(/,/g, ''), 10) > 500) {
                                    pStr = pStr.replace(/\/hr/i, '/yr');
                                }
                            }
                            apiRole.pay = pStr;

                            // Resolve domain
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

                            freshRoles.push(apiRole);
                        });

                        // 4. Combine fresh incoming roles with retained baseline roles (deduplicating across all)
                        const combinedRoles = [...freshRoles];
                        retainedBaselineRoles.forEach(baseRole => {
                            if (!baseRole || !baseRole.title) return;
                            const tLow = baseRole.title.trim().toLowerCase();
                            if (!seenTitles.has(tLow)) {
                                seenTitles.add(tLow);
                                if (!baseRole.lastUpdated) {
                                    const isM1 = (baseRole.platform || '').toLowerCase().includes('micro') || (baseRole.linkTarget || '').includes('micro1');
                                    baseRole.lastUpdated = isM1 ? '2026-10-18T12:00:00Z' : syncDate;
                                }
                                combinedRoles.push(baseRole);
                            }
                        });

                        data.roles = combinedRoles;
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
            if (typeof window.restoreMatches === 'function') {
                try { window.restoreMatches(); } catch(e) {}
            }

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

                <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; align-items:center;">
                    <input type="text" id="jobSearchInput" placeholder="Search roles (e.g. Python, Nurse, ML)..." style="flex:1; min-width:200px; padding:12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                    <select id="jobDomainFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="ALL">All Categories</option>
                        <option value="SOFTWARE">Software & Engineering</option>
                        <option value="MEDICAL">Medical & Clinical</option>
                        <option value="FINANCE">Finance & Economics</option>
                        <option value="LEGAL">Legal & Compliance</option>
                        <option value="LANGUAGE">Language & Translation</option>
                        <option value="SCIENCE">Science & Research</option>
                        <option value="CREATIVE">Creative & Media</option>
                        <option value="SALES">Sales & Growth</option>
                        <option value="GENERAL">General & Expert</option>
                        <option value="MICRO1">Micro1 Roles</option>
                        <option value="MERCOR">Mercor Roles</option>
                    </select>
                    <select id="jobLocationFilter" style="appearance:none; -webkit-appearance:none; background-color:white; background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:right 12px center; padding:12px 36px 12px 16px; border-radius:8px; border:1px solid var(--gray-300); font-family:inherit; font-size:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);">
                        <option value="ALL">Where are you based? (All)</option>
                        <option value="US">United States (US Based)</option>
                        <option value="US_ONLY">🇺🇸 US Only (Hide Worldwide)</option>
                        <option value="INTL">International (Any Country)</option>
                        <option value="INDIA">India</option>
                        <option value="INDIA_ONLY">🇮🇳 India Only (Hide Worldwide)</option>
                        <option value="LATAM">Latin America (LatAm)</option>
                        <option value="LATAM_ONLY">🌎 LatAm Only (Hide Worldwide)</option>
                        <option value="EUROPE">Europe / UK</option>
                        <option value="EUROPE_ONLY">🇪🇺 Europe / UK Only (Hide Worldwide)</option>
                    </select>
                    <label style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--gray-700); cursor:pointer; background:white; padding:10px 14px; border:1px solid var(--gray-300); border-radius:8px; user-select:none; box-shadow:inset 0 1px 2px rgba(0,0,0,0.05);" title="Hide worldwide roles and show only region-specific openings">
                        <input type="checkbox" id="jobRegionOnlyToggle" style="cursor:pointer; width:16px; height:16px; accent-color:var(--primary);">
                        <span>Region-only</span>
                    </label>
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
                    <div class="category-wrapper" data-domain="${cat.domain}">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:48px;">
                        <div style="width:40px; height:40px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:20px;">${cat.icon}</div>
                        <h2 style="font-size:24px; font-weight:800; color:var(--black); margin:0;">${cat.name}</h2>
                    </div>
                    
                    <div style="position:relative;">
                        <button class="carousel-btn" style="position:absolute; left:-18px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--gray-800); border:1.5px solid var(--gray-200); width:42px; height:42px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='white'; this.style.color='var(--gray-800)'; this.style.borderColor='var(--gray-200)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: -340, behavior: 'smooth'})">‹</button>
                        <button class="carousel-btn" style="position:absolute; right:-18px; top:50%; transform:translateY(-50%); z-index:10; background:white; color:var(--gray-800); border:1.5px solid var(--gray-200); width:42px; height:42px; border-radius:50%; cursor:pointer; font-size:24px; font-weight:800; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='white'; this.style.color='var(--gray-800)'; this.style.borderColor='var(--gray-200)';" onclick="document.getElementById('${cat.id}')?.scrollBy({left: 340, behavior: 'smooth'})">›</button>
                        
                        <div id="${cat.id}" class="category-carousel-track" style="display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:20px; padding:12px 6px 24px; scroll-behavior:smooth; -webkit-overflow-scrolling:touch; scrollbar-width:none;">
                            <style>
                                #${cat.id}::-webkit-scrollbar { display: none; }
                            </style>
                `;

                categoryRoles.forEach((role, index) => {
                    const parsedPay = parseRolePay(role.pay, role.title);
                    const cleanPay = parsedPay.cleanPay;
                    const payYearly = parsedPay.yearlyValue;

                    const req = getRoleRequirements(role);
                    const matchInfo = getRoleMatchInfo(role);
                    const matchScore = matchInfo ? matchInfo.score : null;
                    const kwCountStr = (matchInfo && matchInfo.hits !== undefined && matchInfo.total !== undefined && matchInfo.total > 0)
                        ? ` (${matchInfo.hits} of ${matchInfo.total} keywords)`
                        : '';

                    let tagsList = Array.isArray(role.tags) ? role.tags : (role.tags ? [role.tags] : ['Remote', role.platform || 'Mercor']);
                    let tagsHtml = tagsList.map(t => `<span style="background:var(--gray-200); color:var(--gray-700); font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">${t}</span>`).join('');
                    const bg = role.badgeClass === 'orange' ? 'var(--orange)' : 'var(--black)';
                    const isMicro1Role = (role.platform === 'micro1' || (role.platform || '').toLowerCase().includes('micro') || (role.linkTarget || '').includes('micro1'));
                    const rolePlatform = isMicro1Role ? 'micro1' : 'Mercor';
                    const rawTargetLink = role.linkTarget || (isMicro1Role ? 'https://jobs.micro1.ai' : 'https://t.mercor.com/wbPMF');
                    const safeLink = (window.ensureReferralAttribution ? window.ensureReferralAttribution(rawTargetLink, rolePlatform) : rawTargetLink).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeTitle = (role.title || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeDomain = (role.domain || 'GENERAL').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safePay = cleanPay.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const safeId = (role.id || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");

                    // Match badge if candidate scanned resume
                    let matchBadgeHtml = '';
                    const matchTier = matchInfo ? matchInfo.tier : 'None';
                    const tierRank = (matchTier === 'Strong Match') ? 3 : (matchTier === 'Good Match' ? 2 : (matchScore > 0 ? 1 : 0));
                    const matchHits = (matchInfo && matchInfo.hits !== undefined) ? matchInfo.hits : 0;
                    if (matchScore !== null && matchScore > 0) {
                        if (matchTier === 'Strong Match') {
                            matchBadgeHtml = `<span style="background:var(--primary-light); color:var(--primary-dark); border:1px solid #a7f3d0; font-size:11px; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">🌟 Strong Match • ${matchScore}%${kwCountStr}</span>`;
                        } else if (matchTier === 'Good Match' || matchScore >= 50) {
                            matchBadgeHtml = `<span style="background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; font-size:11px; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">⭐ Good Match • ${matchScore}%${kwCountStr}</span>`;
                        } else {
                            matchBadgeHtml = `<span style="background:#fffbeb; color:#92400e; border:1px solid #fde68a; font-size:11px; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">📈 Stretch Role • ${matchScore}%${kwCountStr}</span>`;
                        }
                    }

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

                    // Pay Type calculation
                    let payTypeBadge = '';
                    if (cleanPay.toLowerCase().includes('/task') || cleanPay.toLowerCase().includes('task')) {
                        payTypeBadge = `<span style="background:#f3e8ff; color:#7e22ce; border:1px solid #d8b4fe; font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">📄 Pay per Task</span>`;
                    } else if (cleanPay.includes('/hr')) {
                        payTypeBadge = `<span style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">⏱️ Hourly Contract</span>`;
                    } else {
                        payTypeBadge = `<span style="background:#f8fafc; color:#475569; border:1px solid #cbd5e1; font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">💼 Flexible Contract</span>`;
                    }

                    // Requirements block with hours & verified freshness
                    const isTaskBased = cleanPay.toLowerCase().includes('/task') || cleanPay.toLowerCase().includes('task');
                    
                    let hoursDisplay = req.hours;
                    if (!hoursDisplay) {
                        if (isTaskBased) {
                            hoursDisplay = 'Self-Paced (Pay per task)';
                        } else {
                            hoursDisplay = `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="color:#059669; text-decoration:underline; font-weight:600;" onclick="if(window.event) window.event.stopPropagation();">Check listing for hours ↗</a>`;
                        }
                    }

                    const roleRawDate = role.lastUpdated || role.syncedAt || (isMicro1Role ? '2026-10-18T12:00:00Z' : syncDate);
                    let cardDateStr = isMicro1Role ? 'Oct 18, 2026' : 'Oct 29, 2026';
                    try {
                        const dObj = new Date(roleRawDate);
                        if (!isNaN(dObj.getTime())) {
                            cardDateStr = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        }
                    } catch(e) {}

                    const reqHtml = `
                        <div class="role-requirements" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:8px 12px; margin-bottom:14px; font-size:12px; line-height:1.4;">
                            <div style="font-weight:700; color:#374151; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">📋 Requirements &amp; Details</div>
                            <div style="display:flex; flex-direction:column; gap:3px; color:#4b5563;">
                                <div>📍 <strong>Location:</strong> ${req.location}</div>
                                <div>⏰ <strong>Schedule:</strong> ${hoursDisplay}</div>
                                <div>📅 <strong>Verified Active:</strong> ${cardDateStr} Sync</div>
                                ${req.degree ? `<div>🎓 <strong>Degree:</strong> ${req.degree}</div>` : ''}
                                ${req.license ? `<div>📜 <strong>License:</strong> <span style="color:#b45309; font-weight:700;">${req.license}</span></div>` : ''}
                            </div>
                        </div>
                    `;

                    // Standardized Vector SVG Icons for action buttons
                    const svgBookmark = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
                    const svgCheck = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                    const svgTarget = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;

                    // High-Converting Standardized CTA Buttons:
                    const isLowMatch = (matchScore !== null && matchScore > 0 && matchScore < 50);

                    const desktopButtonsHtml = isLowMatch ? `
                        <div class="desktop-actions card-actions-wrapper">
                            <button type="button" class="btn-card-match" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" title="Check ATS match requirements" aria-label="Check match">${svgTarget} Check match (${matchScore}%) ➔</button>
                            <div class="card-options-toolbar">
                                <button type="button" class="btn-card-tool" style="flex:1.2; font-weight:700; color:var(--primary);" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore}, '${safeDomain}');">Apply anyway ➔</button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save role to Dashboard" aria-label="Save role">${svgBookmark} <span>Save</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark as applied" aria-label="Mark applied">${svgCheck} <span>Applied</span></button>
                            </div>
                        </div>
                    ` : `
                        <div class="desktop-actions card-actions-wrapper">
                            <button type="button" class="btn-card-primary" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}');">Apply on ${rolePlatform} ➔</button>
                            <div class="card-options-toolbar">
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" title="Practice ATS guide for this role" aria-label="Practice ATS">${svgTarget} <span>ATS Guide</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save role to Dashboard" aria-label="Save role">${svgBookmark} <span>Save</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark as applied" aria-label="Mark applied">${svgCheck} <span>Applied</span></button>
                            </div>
                        </div>
                    `;

                    const mobileButtonsHtml = isLowMatch ? `
                        <div class="mobile-actions" style="display:none; flex-direction:column; gap:8px; width:100%;">
                            <button type="button" class="btn-card-match" style="width:100%; height:44px;" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');">${svgTarget} Check your match (${matchScore}%) ➔</button>
                            <div class="card-options-toolbar">
                                <button type="button" class="btn-card-tool" style="flex:1.2; font-weight:700; color:var(--primary);" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore}, '${safeDomain}');">Apply anyway ➔</button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save role">${svgBookmark} <span>Save</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark applied">${svgCheck} <span>Applied</span></button>
                            </div>
                        </div>
                    ` : `
                        <div class="mobile-actions" style="display:none; flex-direction:column; gap:8px; width:100%;">
                            <button type="button" class="btn-card-primary" style="width:100%; height:44px;" onclick="event.stopPropagation(); window.handleMobileSave('${safeTitle}', '${safeLink}', this);">💻 Best on a laptop: email me this link</button>
                            <div class="card-options-toolbar">
                                <button type="button" class="btn-card-tool" style="flex:1.2; font-weight:700; color:var(--primary);" onclick="event.stopPropagation(); window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}');">Apply anyway ➔</button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); window.open('/resume-ats-guide?role=' + encodeURIComponent('${safeTitle}'), '_blank');" title="ATS Guide">${svgTarget} <span>ATS</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); saveRole('${safeTitle}', '${safeDomain}', '${safePay}', this, '${safeLink}')" title="Save role">${svgBookmark} <span>Save</span></button>
                                <button type="button" class="btn-card-tool" onclick="event.stopPropagation(); markAsComplete('${safeTitle}', '${safeDomain}', '${safePay}', this)" title="Mark applied">${svgCheck} <span>Applied</span></button>
                            </div>
                        </div>
                    `;

                    // Build searchable data string
                    const searchTokens = [
                        role.title || '',
                        role.domain || '',
                        role.status || '',
                        cleanPay || '',
                        Array.isArray(role.tags) ? role.tags.join(' ') : (role.tags || ''),
                        Array.isArray(role.atsKeywords) ? role.atsKeywords.join(' ') : (role.atsKeywords || ''),
                        role.description || '',
                        req.location || '',
                        req.degree || '',
                        req.license || '',
                        rolePlatform || '',
                        role.platform || ''
                    ].join(' ').toLowerCase();
                    const safeSearchAttr = searchTokens.replace(/"/g, '&quot;');

                    html += `
                        <div class="feature-card opp-card" onclick="window.handleApplyClick('${safeTitle}', '${safeLink}', this, '${safeId}', ${matchScore !== null ? matchScore : 'null'}, '${safeDomain}')" data-domain="${role.domain}" data-platform="${rolePlatform}" data-pay="${payYearly}" data-match="${matchScore !== null ? matchScore : 0}" data-tier-rank="${tierRank}" data-hits="${matchHits}" data-location="${req.locKey}" data-index="${index}" data-search="${safeSearchAttr}" style="cursor:pointer; min-width:min(320px, 86vw); max-width:340px; flex:0 0 min(320px, 86vw); scroll-snap-align:start; box-sizing:border-box; order:${index}; background:var(--white); border:1.5px solid #e5e7eb; padding:22px; display:flex; flex-direction:column; position:relative; border-radius:var(--radius-lg); box-shadow:0 1px 3px rgba(0,0,0,0.05); overflow:hidden; transition:all 0.2s ease;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:14px; align-items:center; flex-wrap:wrap; gap:8px;">
                                <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                                    <div style="padding:5px 8px; background:var(--black); color:var(--white); border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em;">${role.domain}</div>
                                    <div style="padding:5px 8px; background:${bg}; color:white; border-radius:6px; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${role.status}</div>
                                    ${platformBadgeHtml}
                                    ${payTypeBadge}
                                    ${matchBadgeHtml}
                                </div>
                                <div style="color:var(--primary); font-weight:800; font-size:18px;">${cleanPay}</div>
                            </div>
                            <h3 style="font-size:18px; margin-bottom:8px; color:var(--black); line-height:1.2;">${role.title}</h3>
                            ${(role.description && role.description.trim() && role.platform !== 'Mercor') ? `<p style="color:var(--gray-500); font-size:14px; margin-bottom:14px; flex-grow:1; line-height:1.6;">${role.description}</p>` : `<p style="color:var(--gray-500); font-size:14px; margin-bottom:14px; flex-grow:1; line-height:1.6;">Remote, ${cleanPay.includes('/hr') ? 'hourly' : (cleanPay.includes('/mo') ? 'monthly' : (cleanPay.includes('/yr') ? 'annual' : 'flexible'))} role. Direct application on ${rolePlatform}.</p>`}
                            
                            ${reqHtml}

                            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">${tagsHtml}</div>
                            
                            ${diffAlertHtml}
                            ${preApplyWarningHtml}

                            ${desktopButtonsHtml}
                            ${mobileButtonsHtml}
                            
                            <div style="text-align:center; font-size:11px; color:var(--gray-500); margin-top:8px; font-weight:600;">3 min to apply, 20 min AI interview • Have your PDF resume ready</div>
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
            const regionOnlyToggle = document.getElementById('jobRegionOnlyToggle');
            const matchFilter = document.getElementById('jobMatchFilter');
            const sortFilter = document.getElementById('jobSortFilter');

            function filterJobs() {
                const term = (searchInput ? searchInput.value : '').trim().toLowerCase();
                const domain = domainFilter ? domainFilter.value : 'ALL';
                const loc = locationFilter ? locationFilter.value : 'ALL';
                const regionOnly = regionOnlyToggle ? regionOnlyToggle.checked : false;
                const matchVal = matchFilter ? matchFilter.value : 'ALL';
                const sort = sortFilter ? sortFilter.value : 'DEFAULT';

                const cards = carouselWrapper.querySelectorAll('.opp-card');
                let cardsArray = Array.from(cards);

                cardsArray.forEach((card) => {
                    const searchData = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    const cardDomain = card.getAttribute('data-domain');
                    const cardPlatform = (card.getAttribute('data-platform') || '').toUpperCase();
                    const cardLoc = card.getAttribute('data-location') || 'ALL';
                    const cardMatch = parseInt(card.getAttribute('data-match') || '0', 10);

                    // 1. Search Query: Whole-word token matching for short terms (e.g. RN, MD, AI, QA, C++, GO), with support for leading dots (.NET)
                    let matchesSearch = true;
                    if (term) {
                        if (term.includes(' ') || term.includes('.')) {
                            matchesSearch = searchData.includes(term);
                        } else if (term.length <= 4) {
                            const tokens = searchData.split(/[^a-zA-Z0-9+#]+/);
                            matchesSearch = tokens.includes(term);
                        } else {
                            matchesSearch = searchData.includes(term);
                        }
                    }

                    // 2. Category / Domain
                    let matchesDomain = true;
                    if (domain !== 'ALL') {
                        if (domain === 'MICRO1' || domain === 'MERCOR') {
                            matchesDomain = cardPlatform === domain;
                        } else {
                            matchesDomain = cardDomain === domain;
                        }
                    }

                    // 3. Location / Country
                    let matchesLoc = true;
                    if (loc === 'US') {
                        matchesLoc = regionOnly ? (cardLoc === 'US') : (cardLoc === 'US' || cardLoc === 'ALL');
                    } else if (loc === 'US_ONLY') {
                        matchesLoc = (cardLoc === 'US');
                    } else if (loc === 'INTL') {
                        matchesLoc = (cardLoc !== 'US');
                    } else if (loc === 'INDIA') {
                        matchesLoc = regionOnly ? (cardLoc === 'INDIA') : (cardLoc === 'INDIA' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    } else if (loc === 'INDIA_ONLY') {
                        matchesLoc = (cardLoc === 'INDIA');
                    } else if (loc === 'LATAM') {
                        matchesLoc = regionOnly ? (cardLoc === 'LATAM') : (cardLoc === 'LATAM' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    } else if (loc === 'LATAM_ONLY') {
                        matchesLoc = (cardLoc === 'LATAM');
                    } else if (loc === 'EUROPE') {
                        matchesLoc = regionOnly ? (cardLoc === 'EUROPE') : (cardLoc === 'EUROPE' || cardLoc === 'INTL' || cardLoc === 'ALL');
                    } else if (loc === 'EUROPE_ONLY') {
                        matchesLoc = (cardLoc === 'EUROPE');
                    }

                    // 4. Match % Filter logic
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
                        containerCards.sort((a, b) => {
                            const tierB = parseInt(b.getAttribute('data-tier-rank') || '0', 10);
                            const tierA = parseInt(a.getAttribute('data-tier-rank') || '0', 10);
                            if (tierB !== tierA) return tierB - tierA;
                            const mB = parseInt(b.getAttribute('data-match') || '0', 10);
                            const mA = parseInt(a.getAttribute('data-match') || '0', 10);
                            if (mB !== mA) return mB - mA;
                            return parseInt(b.getAttribute('data-hits') || '0', 10) - parseInt(a.getAttribute('data-hits') || '0', 10);
                        });
                    } else if (sort === 'PAY_HIGH') {
                        containerCards.sort((a, b) => {
                            const pB = parseInt(b.getAttribute('data-pay') || '0', 10);
                            const pA = parseInt(a.getAttribute('data-pay') || '0', 10);
                            if (pB !== pA) return pB - pA;
                            return parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10);
                        });
                    } else if (term) {
                        // Title match relevance ranking: Put roles with term in title first
                        containerCards.sort((a, b) => {
                            const titleA = (a.querySelector('h3')?.textContent || '').toLowerCase();
                            const titleB = (b.querySelector('h3')?.textContent || '').toLowerCase();
                            const aHas = titleA.includes(term) ? 1 : 0;
                            const bHas = titleB.includes(term) ? 1 : 0;
                            if (bHas !== aHas) return bHas - aHas;
                            return parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10);
                        });
                    } else {
                        // Default sort: Pin region-specific roles to the front if region filter selected
                        const targetRegion = loc.replace('_ONLY', '');
                        if (targetRegion === 'INDIA' || targetRegion === 'US' || targetRegion === 'LATAM' || targetRegion === 'EUROPE') {
                            containerCards.sort((a, b) => {
                                const aReg = (a.getAttribute('data-location') === targetRegion) ? 1 : 0;
                                const bReg = (b.getAttribute('data-location') === targetRegion) ? 1 : 0;
                                if (bReg !== aReg) return bReg - aReg;
                                return parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10);
                            });
                        } else {
                            containerCards.sort((a, b) => parseInt(a.getAttribute('data-index') || '0', 10) - parseInt(b.getAttribute('data-index') || '0', 10));
                        }
                    }

                    // Physically re-append cards to update DOM tree order for horizontal scroll-snap
                    containerCards.forEach((c) => {
                        container.appendChild(c);
                    });
                    // Reset horizontal scroll
                    container.scrollLeft = 0;
                });

                // When sorting by Highest Paying, also sort the category carousels by highest paying role
                if (sort === 'PAY_HIGH') {
                    const wrappers = Array.from(carouselWrapper.querySelectorAll('.category-wrapper'));
                    wrappers.sort((a, b) => {
                        const maxPayA = Math.max(0, ...Array.from(a.querySelectorAll('.opp-card')).map(c => parseInt(c.getAttribute('data-pay') || '0', 10)));
                        const maxPayB = Math.max(0, ...Array.from(b.querySelectorAll('.opp-card')).map(c => parseInt(c.getAttribute('data-pay') || '0', 10)));
                        return maxPayB - maxPayA;
                    });
                    wrappers.forEach(w => carouselWrapper.appendChild(w));
                } else if (term) {
                    // When searching, sort the category carousels so categories with matching titles are front and center
                    const wrappers = Array.from(carouselWrapper.querySelectorAll('.category-wrapper'));
                    wrappers.sort((a, b) => {
                        const hasA = Array.from(a.querySelectorAll('.opp-card:not([style*="display: none"])')).some(c => (c.querySelector('h3')?.textContent || '').toLowerCase().includes(term)) ? 1 : 0;
                        const hasB = Array.from(b.querySelectorAll('.opp-card:not([style*="display: none"])')).some(c => (c.querySelector('h3')?.textContent || '').toLowerCase().includes(term)) ? 1 : 0;
                        return hasB - hasA;
                    });
                    wrappers.forEach(w => carouselWrapper.appendChild(w));
                }

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
            if (regionOnlyToggle) regionOnlyToggle.addEventListener('change', filterJobs);
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
