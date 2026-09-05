chrome.action.onClicked.addListener((tab) => {
  // Only send message if it's a valid tab (e.g. not a chrome:// URL)
  if (tab.id && tab.url && tab.url.includes("work.mercor.com")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggleHub" }).catch(() => {
      // Ignore errors if the content script hasn't loaded yet
    });
  }
});
