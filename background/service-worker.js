/**
 * SuperTables - Background Service Worker
 * Minimal implementation - most logic is in content scripts
 */

// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('SuperTables: Extension installed');
  } else if (details.reason === 'update') {
    console.log('SuperTables: Extension updated to', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getState') {
    // Could be used for syncing state across tabs
    sendResponse({ enabled: true });
    return true;
  }

  // Handle clipboard copy request from content script
  if (message.action === 'copyToClipboard') {
    copyToClipboard(message.text)
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error('SuperTables: Background copy failed', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }

  return true;
});

/**
 * Copy text to clipboard using offscreen document (MV3)
 */
async function copyToClipboard(text) {
  // For MV3, we need to use offscreen document API or fallback
  try {
    // Try using offscreen document (Chrome 109+)
    if (chrome.offscreen) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['CLIPBOARD'],
        justification: 'Copy text to clipboard'
      }).catch(() => {}); // Ignore if already exists

      await chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'copy',
        text: text
      });
    } else {
      // Fallback for older Chrome versions - use active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (textToCopy) => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          },
          args: [text]
        });
      }
    }
  } catch (e) {
    console.error('SuperTables: copyToClipboard error', e);
    throw e;
  }
}
