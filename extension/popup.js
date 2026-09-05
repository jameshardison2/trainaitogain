document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('master-toggle');

  // Load initial state (default to true)
  chrome.storage.local.get(['cheatCodeEnabled'], function(result) {
    if (result.cheatCodeEnabled !== undefined) {
      toggle.checked = result.cheatCodeEnabled;
    } else {
      toggle.checked = true;
      chrome.storage.local.set({ cheatCodeEnabled: true });
    }
  });

  // Listen for changes
  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ cheatCodeEnabled: toggle.checked }, () => {
      // Notify content scripts to instantly hide/show UI if needed
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "toggleStateChanged", enabled: toggle.checked}).catch(() => {});
        }
      });
    });
  });
});
