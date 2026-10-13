# Release Log

## Release: v2026.10.12-platform-warnings-live
- **Date:** October 12, 2026
- **Git Commit:** `3f4f91d5`
- **Git Tag:** `v2026.10.12-platform-warnings-live`
- **Firebase Project:** `trainaitogain-50c19`
- **Live Domains:** `https://trainaitogain.com`, `https://trainaitogain-50c19.web.app`

### Summary of Changes Released:
1. **Platform Indicator Badges (`apply.html`, `render_waves.js`, `saved-roles.html`):**
   - Distinctive badges on every role card: `⚡ Mercor` (emerald green badge) vs `🌐 micro1` (indigo badge).
2. **Pre-Apply Warning Box:**
   - Every role card displays a clear, non-blocking warning notice box above the Apply button *before* clicking:
     `ℹ️ Applying on [Platform] — Requires creating a free [Platform] account & completing their AI evaluation.`
3. **Different-Platform Switching Alert:**
   - If a candidate previously clicked Apply on one platform (e.g., Mercor) and is now looking at or applying to a role on a different platform (e.g., micro1), a highlighted alert is displayed:
     `🚨 DIFFERENT PLATFORM WARNING: You previously applied to a [Previous Platform] role. This position is on [Current Platform], which requires a separate account and application.`
   - Updates dynamically in real-time across all visible role cards as soon as an Apply click is registered without needing a page refresh (`window.updateAllPlatformWarnings`).
4. **Platform Guidance Banner:**
   - Added a top-of-jobs guidance banner on `/apply` detailing what to expect when applying to Mercor vs. micro1 roles.
5. **Dashboard Consistency (`saved-roles.html`):**
   - Mirrored platform badges, different platform warning alerts, and pre-apply notice blocks on all saved and started roles in candidate dashboards.

---

## Release: v2026.10.12-round4-live
- **Date:** October 12, 2026
- **Git Commit:** `e2b35f4e`
- **Git Tag:** `v2026.10.12-round4-live`
- **Firebase Project:** `trainaitogain-50c19`
- **Live Domains:** `https://trainaitogain.com`, `https://trainaitogain-50c19.web.app`

### Summary of Changes Released:
1. **Soft Landing on Apply (`apply.html` & `render_waves.js`):**
   - Immediate non-blocking new tab open with referral links.
   - Inline soft landing expansion card:
     - Account creation reminder.
     - 20-minute AI interview expectation with links to `ai-interview` and `readiness-checklist`.
     - Matching timeline note.
     - "Mark as Started ✓" button tied to Pipeline Dashboard & reminder scheduling.
   - Removed exit-intent popup and mouseleave listeners completely.
2. **Role Requirements Display & Location Filtering (`render_waves.js`):**
   - Requirements pill on all cards displaying Location, Degree, and License requirements.
   - "Where are you based?" filter dropdown (`US`, `INTL`, `INDIA`, `LATAM`, `EUROPE`, `ALL`).
   - "Last synced: [date]" display from `meta.syncedAt` / `waves.json`.
   - Hidden closed / inactive roles.
3. **Mobile & Low Match UX Improvements:**
   - On mobile ($\le 768\text{px}$): Primary button swapped to `💻 Best on a laptop: email me this link` (`generate_lead`, `lead_type: mobile_save`) with smaller `Apply anyway ➔`.
   - Under 50% Match: `Check your match 🎯` becomes primary button; `Apply anyway ➔` becomes secondary.
   - Analytics events `apply_click` pass `device_type` and `match_score`.
4. **Mock Interview Roles Dropdown (`ai-interview.html`):**
   - Prepend target role from ATS resume scan (`atsRole`).
   - Dynamically load all active open pipeline roles from `waves.json` into the dropdown alongside core domain presets.
5. **Outreach CRM (`outreach-tool.html`):**
   - Direct-to-queue if contacts already exist in cloud storage.
   - "Skip, go to my queue ➔" button on upload screen.
   - "Upload / merge CSV" button inside queue toolbar.
   - "No contacts yet" empty state.
   - One-time cloud sync banner for local browser contacts into Firestore.
6. **Partner Dashboard (`dashboard.html`):**
   - Replaced "Access Denied" browser `alert()` with styled on-page error warning.
7. **Email System Status (`functions/index.js`):**
   - Mock results email (`sendMockResultsEmail`): LIVE.
   - Welcome email (`subscribeRoleAlerts`): LIVE.
   - `sendRoleAlertsDigest`: In test mode (strictly sends only to `james.hardison2@gmail.com`).
   - `processRoleReminders`: In test mode (strictly sends only to `james.hardison2@gmail.com`).
   - `sendFollowUpEmails`: Paused pending approval.
   - All email footers contain `[Postal Address Pending]`.

---

### Exact Rollback Steps

If any issue arises on live:

#### Option 1: Fastest (Firebase Console)
1. Go to Firebase Console → Hosting → Release History.
2. Find the release prior to `v2026.10.12-round4-live` (tagged `v2026.10.12-before-round4-live`).
3. Click `⋮` → **Roll back**.

#### Option 2: From Backup Channel
```bash
firebase hosting:clone trainaitogain-50c19:backup-oct12 trainaitogain-50c19:live
```

#### Option 3: From Permanent Git Tag
```bash
git checkout v2026.10.12-before-round4-live
firebase deploy --only hosting,functions,firestore:rules --project trainaitogain-50c19
```
