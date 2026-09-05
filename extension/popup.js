document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('master-toggle');

  // Load initial state (default to true)
  chrome.storage.local.get(['tgExtensionEnabled'], function(result) {
    if (result.tgExtensionEnabled !== undefined) {
      toggle.checked = result.tgExtensionEnabled;
    } else {
      toggle.checked = true;
      chrome.storage.local.set({ tgExtensionEnabled: true });
    }
  });

  // Listen for changes
  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ tgExtensionEnabled: toggle.checked }, () => {
      // Notify content scripts to instantly hide/show UI if needed
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0] && tabs[0].url.includes("work.mercor.com")) {
          // Tell the content script to reload or toggle visibility
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
});
