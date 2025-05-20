console.log('Background script loaded');

// Handle notifications and state updates
chrome.runtime.onMessage.addListener((message) => {
  console.log('Received message:', message);
  if (message.type === 'TEXT_FOUND') {
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon128.png',
        title: 'Page Watcher',
        message: message.notificationMessage || 'Page Watcher detected text'
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  } else if (message.type === 'UPDATE_STATE') {
    // Update storage with new state
    chrome.storage.local.set({
      watchState: message.state
    });

    // Update extension icon to inactive state
    chrome.action.setIcon({
      path: {
        16: '/icons/icon16.png',
        48: '/icons/icon48.png',
        128: '/icons/icon128.png',
      },
    });
  }
}); 