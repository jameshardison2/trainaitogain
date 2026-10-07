import re

with open('apply.html', 'r') as f:
    content = f.read()

# UC-11: Upload size limit
old_file_input = """      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadZone.style.display = 'none';"""

new_file_input = """      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // UC-11: Resume Upload Size Limit (Prevent 25MB Serverless Timeouts)
        if (file.size > 20 * 1024 * 1024) {
            alert("Upload Error: File payload exceeds maximum size limit (20MB). This causes serverless function timeouts. Please compress your PDF and try again.");
            e.target.value = '';
            return;
        }

        uploadZone.style.display = 'none';"""

content = content.replace(old_file_input, new_file_input)

# UC-14: Network Drop Offline Caching
old_submit = """            const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            
            await addDoc(collection(db, "leads"), {"""

new_submit = """            const refCode = localStorage.getItem('affiliate_ref') || new URLSearchParams(window.location.search).get('ref') || '';
            
            // UC-14: Network Drop Webhook Sync
            if (!navigator.onLine) {
                let cache = JSON.parse(localStorage.getItem('offline_webhook_sync') || '[]');
                cache.push({ firstName: nameInput || 'Applicant', email: emailInput, source: window.location.href + ' (Apply Modal Offline)', referred_by: refCode, status: 'Application Started' });
                localStorage.setItem('offline_webhook_sync', JSON.stringify(cache));
                alert('Connection dropped. Your application has been cached locally and will automatically sync when network is restored.');
            } else {
                await addDoc(collection(db, "leads"), {"""

content = content.replace(old_submit, new_submit)

# Close the else block for addDoc
old_submit_end = """              status: 'Application Started' // They are applying right now
            });
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');"""

new_submit_end = """              status: 'Application Started' // They are applying right now
            });
            } // Close navigator.onLine else block
            
            localStorage.setItem('hasEnteredEmailForApply', 'true');"""

content = content.replace(old_submit_end, new_submit_end)

# Add the online sync listener
sync_listener = """
    <script>
      // UC-14: Network Restore Background Sync
      window.addEventListener('online', async () => {
          let cache = JSON.parse(localStorage.getItem('offline_webhook_sync') || '[]');
          if (cache.length > 0) {
              try {
                  const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
                  const { getApp, getApps, initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
                  let app = getApps().length ? getApp() : initializeApp({ projectId: "trainaitogain-50c19" });
                  const db = getFirestore(app);
                  for (let doc of cache) {
                      doc.timestamp = serverTimestamp();
                      await addDoc(collection(db, "leads"), doc);
                  }
                  localStorage.removeItem('offline_webhook_sync');
              } catch(e) { console.error('Offline sync failed', e); }
          }
      });
    </script>
</body>"""

content = content.replace("</body>", sync_listener)

with open('apply.html', 'w') as f:
    f.write(content)
print("apply.html patched")
