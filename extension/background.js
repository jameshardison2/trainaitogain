// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'triggerSOS') {
        handleSOSRequest(request.payload, sender.tab, sendResponse);
        return true; // Keep message channel open for async response
    }
});

async function handleSOSRequest(payload, tab, sendResponse) {
    try {
        // 1. Capture the visible tab
        // Note: host_permissions allows us to capture the tab even if activeTab isn't triggered
        const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'jpeg', quality: 50});
        
        // 2. Prepare payload for Firebase Firestore REST API
        // Database: trainaitogain-50c19, Collection: sos_alerts
        const firebaseUrl = 'https://firestore.googleapis.com/v1/projects/trainaitogain-50c19/databases/(default)/documents/sos_alerts';
        
        const firestorePayload = {
            fields: {
                timestamp: { stringValue: new Date().toISOString() },
                url: { stringValue: tab ? tab.url : 'unknown' },
                issueType: { stringValue: payload.issueType || 'General Error' },
                screenshotDataUrl: { stringValue: dataUrl },
                referred_by: { stringValue: payload.referred_by || 'unknown' }
            }
        };

        // 3. Send to Firebase
        const response = await fetch(firebaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firestorePayload)
        });
        
        if (!response.ok) {
            throw new Error(`Firebase Error: ${response.status} ${response.statusText}`);
        }
        
        console.log("SOS Alert sent to Firebase successfully.");
        sendResponse({ success: true });
        
    } catch (error) {
        console.error("SOS Trigger failed:", error);
        sendResponse({ success: false, error: error.message });
    }
}
