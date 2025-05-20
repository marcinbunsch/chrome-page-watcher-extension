import { useState, useEffect } from 'react';

interface WatchState {
  isWatching: boolean;
  searchTerm: string;
  notificationMessage: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('Page Watcher detected text');
  const [isWatching, setIsWatching] = useState(false);

  console.log('isWatching', isWatching);  

  // Load saved state when popup opens
  useEffect(() => {
    chrome.storage.local.get(['watchState'], (result) => {
      const state = result.watchState as WatchState | undefined;
      if (state) {
        setSearchTerm(state.searchTerm);
        setNotificationMessage(state.notificationMessage || 'Page Watcher detected text');
        setIsWatching(state.isWatching);
      }
    });

    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.watchState) {
        const newState = changes.watchState.newValue as WatchState;
        setSearchTerm(newState.searchTerm);
        setNotificationMessage(newState.notificationMessage || 'Page Watcher detected text');
        setIsWatching(newState.isWatching);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup listener when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleStartStop = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    
    if (!isWatching) {
      console.log('Starting watch');  
      try {
        // Start watching
        await chrome.tabs.sendMessage(tab.id!, {
          type: 'START_WATCHING',
          searchTerm,
          notificationMessage,
        });
        chrome.action.setIcon({
          path: {
            16: '/icons/icon16-active.png',
            48: '/icons/icon48-active.png',
            128: '/icons/icon128-active.png',
          },
        });
        
        const newState = true;
        setIsWatching(newState);
        
        // Save state to storage
        chrome.storage.local.set({
          watchState: {
            isWatching: newState,
            searchTerm,
            notificationMessage,
          },
        });
      } catch (error) {
        console.error('Failed to start watching:', error);
        // Optionally show an error message to the user
      }
    } else {
      console.log('Stopping watch');  
      try {
        // Stop watching
        await chrome.tabs.sendMessage(tab.id!, {
          type: 'STOP_WATCHING',
        });
        chrome.action.setIcon({
          path: {
            16: '/icons/icon16.png',
            48: '/icons/icon48.png',
            128: '/icons/icon128.png',
          },
        });
        
        const newState = false;
        setIsWatching(newState);
        
        // Save state to storage
        chrome.storage.local.set({
          watchState: {
            isWatching: newState,
            searchTerm,
            notificationMessage,
          },
        });
      } catch (error) {
        console.error('Failed to stop watching:', error);
        // Optionally show an error message to the user
      }
    }
    
    const newState = !isWatching;
    setIsWatching(newState);
    
    // Save state to storage
    chrome.storage.local.set({
      watchState: {
        isWatching: newState,
        searchTerm,
        notificationMessage,
      },
    });
  };

  return (
    <div className="w-80 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">Page Watcher</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
            Text to watch for:
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter text to watch for..."
          />
        </div>
        <div>
          <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-700">
            Notification message:
          </label>
          <input
            type="text"
            id="notificationMessage"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Page Watcher detected text"
          />
        </div>
        <button
          onClick={handleStartStop}
          disabled={!searchTerm}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isWatching
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isWatching ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
}

export default App; 