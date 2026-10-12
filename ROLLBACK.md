# Rollback Instructions

If you need to roll back to the Oct 12 live site snapshot at any time:

### 1. Fastest (live site only via Firebase Console)
1. Navigate to Firebase Console → Hosting → Release History.
2. Locate the release from Oct 12 before Round 2.
3. Click the menu (⋮) → **Roll back**.
*(Takes approximately 1 minute)*

### 2. From the Backup Hosting Channel
```bash
firebase hosting:clone trainaitogain-50c19:backup-oct12 trainaitogain-50c19:live
```

### 3. From Git (Permanent Repository Snapshot)
```bash
git checkout v2026.10.12-live-before-round2
firebase deploy --only hosting
# If Cloud Functions changed as well:
firebase deploy --only hosting,functions
```

### 4. Restoring Role Data
- Restore `backups/2026-10-12/waves.json` by copying it back to the project root:
  ```bash
  cp backups/2026-10-12/waves.json waves.json
  ```
- To restore Mercor jobs in Firestore, re-import `backups/2026-10-12/mercor_jobs.json` or re-execute Sync V13 bookmarklet from `mercor.com`.
