// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'triggerSOS') {
        handleSOSRequest(request.payload, sender.tab, sendResponse);
        return true; // Keep message channel open for async response
    }
    if (request.action === 'chatMessage') {
        handleChatMessage(request.payload, sendResponse);
        return true;
    }
});

async function handleChatMessage(payload, sendResponse) {
    const userMsg = payload.message;
    const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
    
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        sendResponse({
            success: true, 
            reply: "Please configure your Gemini API Key in background.js to enable the AI Copilot."
        });
        return;
    }

    const systemPrompt = `You are the TrainAIToGain Application Copilot, embedded directly on the Mercor candidate portal.
Your job is to help the candidate finish their application if they get stuck. 
Keep your answers very brief (1-2 sentences max) as they are reading this in a small chat window.

If the user asks about searching, filtering, or finding jobs, you MUST include the text [TOOL:highlightSearch] or [TOOL:highlightFilter] in your response to trigger the DOM interaction.
For example: "I can highlight the search bar for you! [TOOL:highlightSearch]"`;

    const requestBody = {
        system_instruction: { parts: [{text: systemPrompt}] },
        contents: [{ parts: [{ text: userMsg }], role: "user" }]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            let reply = data.candidates[0].content.parts[0].text;
            let domAction = null;
            
            // Simple regex based tool parsing
            if (reply.includes("[TOOL:highlightSearch]")) {
                domAction = { type: 'highlightSearch' };
                reply = reply.replace("[TOOL:highlightSearch]", "").trim();
            } else if (reply.includes("[TOOL:highlightFilter]")) {
                domAction = { type: 'highlightFilter' };
                reply = reply.replace("[TOOL:highlightFilter]", "").trim();
            }

            sendResponse({ success: true, reply: reply, domAction: domAction });
        } else {
            sendResponse({ success: false });
        }
    } catch (err) {
        console.error("Gemini API Error:", err);
        sendResponse({ success: false });
    }
}

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
