document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const viewWrongSite = document.getElementById('view-wrong-site');
    const viewHome = document.getElementById('view-home');
    const viewTroubleshoot = document.getElementById('view-troubleshoot');
    const viewSosSent = document.getElementById('view-sos-sent');
    
    const btnStuck = document.getElementById('btn-stuck');
    const btnSos = document.getElementById('btn-sos');
    const btnZoom = document.getElementById('btn-zoom');
    
    // 1. Check if we are on Mercor
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && tab.url.includes("mercor.com")) {
        // We are on Mercor, show the home view
        viewHome.classList.add('active-view');
    } else {
        // Not on Mercor, show warning
        viewWrongSite.classList.add('active-view');
    }

    // 2. "Help! I'm Stuck" Button Clicked
    btnStuck.addEventListener('click', () => {
        viewHome.classList.remove('active-view');
        viewTroubleshoot.classList.add('active-view');
    });

    // 3. Tip Logic (attached to window for inline onclick)
    window.showTip = function(tipText) {
        const container = document.getElementById('tip-container');
        container.style.display = 'block';
        container.innerText = tipText;
    };

    // 4. "SOS" Life Alert Button Clicked
    btnSos.addEventListener('click', async () => {
        btnSos.innerText = "Capturing Screen...";
        
        try {
            // Take Screenshot using Chrome API
            const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'jpeg', quality: 50});
            
            // Transition UI
            viewTroubleshoot.classList.remove('active-view');
            viewSosSent.classList.add('active-view');
            
            // Show Screenshot
            const imgPreview = document.getElementById('screenshot-preview');
            imgPreview.src = dataUrl;
            imgPreview.style.display = 'block';
            
            // In a real app, we would send this dataUrl + tab.url to Firebase here
            console.log("SOS Triggered! Context:", tab.url);
            
        } catch (err) {
            console.error("Error capturing screen:", err);
            // Fallback if screenshot fails
            viewTroubleshoot.classList.remove('active-view');
            viewSosSent.classList.add('active-view');
        }
    });

    // 5. Join Zoom
    btnZoom.addEventListener('click', () => {
        // Open a dummy zoom link or send an alert
        window.open("https://zoom.us/test", "_blank");
    });
});
