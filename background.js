chrome.action.onClicked.addListener(async (tab) => {
  // 1. Prevent execution on restricted Chrome system pages
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("https://chromewebstore.google.com/")) {
    console.warn("Chrome restricts extensions from modifying system pages or the Web Store.");
    return; 
  }

  // 2. Try to send the toggle message to the tab
  try {
    await chrome.tabs.sendMessage(tab.id, { action: "toggleNotepad" });
  } catch (error) {
    // 3. If it fails, the content script isn't loaded (e.g., page wasn't refreshed). 
    // Force inject the CSS and JS, then send the message again.
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"]
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      
      // Send the message again after successful injection
      await chrome.tabs.sendMessage(tab.id, { action: "toggleNotepad" });
    } catch (injectError) {
      console.error("Could not inject notepad into this specific page:", injectError);
    }
  }
});