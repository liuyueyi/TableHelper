/**
 * SuperTables - Offscreen Document for Clipboard Operations
 * Required for clipboard access in Manifest V3
 */

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  if (message.action === 'copy') {
    handleCopy(message.text)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }
});

/**
 * Copy text to clipboard
 */
async function handleCopy(text) {
  // Try using Clipboard API first
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch (e) {
    // Clipboard API failed, try execCommand fallback
  }

  // Fallback: use execCommand
  const textarea = document.getElementById('clipboard-textarea');
  textarea.value = text;
  textarea.select();

  const success = document.execCommand('copy');
  if (!success) {
    throw new Error('execCommand copy failed');
  }
}
